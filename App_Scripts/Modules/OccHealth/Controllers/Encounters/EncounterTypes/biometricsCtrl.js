
angular.module("app")
        .controller("biometricsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {
             // Begin

             $scope.changeSubView = sharedservices.changeSubView;

             //Set Navigation bar options
             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BIODetails" : 1004,
                 resultsFormId: undefined,
                 investigationFormId: undefined
             };
             $scope.showSubNavbars = true;
             $scope.loadingAction = false;



             //Initialissation
             $scope.toggleQuestionComment = function (question) {
                 question.commentStatus = !question.commentStatus;
             };

             $scope.hourStep = sharedservices.hourStep;
             $scope.minuteStep = sharedservices.minuteStep;
             $scope.BloodGlucoseTestTime = new Date();
             $scope.BloodPresureTestTime = new Date();
             $scope.BodyDimensionMeasurementTime = new Date();
             $scope.LipidProfileTestTime = new Date();
             $scope.DrawTimet = new Date();

             $scope.FieldDisabled = false;
             $scope.scheduleFollowUp = {
                 EncounterTypeScheduleFollowUpID: 0
            , ReasonForFollowUp: ""
            , FollowUpTypeID: 0
            , AppointmentDate: ""
            , AppointmentTime: ""
            , hourStep: ""
            , minuteStep: ""
            , HealthCareProviderID: 0
            , AppointmentScheduledName: globalobject.currentSession.username
             };


             //GetData Details 
             $scope.getBiometricDetails = function () {
                 $scope.showLoadingOverlay = true;
                 globalobject.currentEncounter.EncounterTypeID = (sharedservices.getURLParameter().EncounterTypeID != undefined && sharedservices.getURLParameter().EncounterTypeID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().EncounterTypeID) : parseInt(globalobject.currentEncounter.EncounterTypeID);
                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);



                 $scope.UomtypeList = (globalobject.UomtypeList.length > 0) ? globalobject.UomtypeList : [];
                 $scope.TestPositionFrameList = (globalobject.TestPositionFrameList.length > 0) ? globalobject.TestPositionFrameList : [];
                 $scope.MedicationFrequencyList = (globalobject.MedicationFrequencyList.length > 0) ? globalobject.MedicationFrequencyList : [];
                 $scope.MonitoringTypeBiometricsList = (globalobject.MonitoringTypeBiometricsList.length > 0) ? globalobject.MonitoringTypeBiometricsList : [];
                 $scope.DiagnosticMethodList = (globalobject.DiagnosticMethodList.length > 0) ? globalobject.DiagnosticMethodList : [];
                 $scope.LiquidUOMList = (globalobject.LiquidUOMList.length > 0) ? globalobject.LiquidUOMList : [];
                 $scope.PressureUOMList = (globalobject.PressureUOMList.length > 0) ? globalobject.PressureUOMList : [];
                 $scope.SpeedUOMList = (globalobject.SpeedUOMList.length > 0) ? globalobject.SpeedUOMList : [];
                 $scope.HeightUOMList = (globalobject.HeightUOMList.length > 0) ? globalobject.HeightUOMList : [];
                 $scope.DensityUOMList = (globalobject.DensityUOMList.length > 0) ? globalobject.DensityUOMList : [];
                 $scope.FollowUpList = (globalobject.FollowUpTypeList.length > 0) ? globalobject.FollowUpTypeList : [];
                 $scope.HealthcareProviderList = (globalobject.HealthcareProviderList.length > 0) ? globalobject.HealthcareProviderList : [];
                 $scope.WeightUOMList = (globalobject.WeightUOMList.length > 0) ? globalobject.WeightUOMList : [];
                 $scope.ArmLeft = (globalobject.BodyPartSideList.length > 0) ? _.where(globalobject.BodyPartSideList, { Text: 'Left' })[0].ID : [];
                 $scope.ArmRight = (globalobject.BodyPartSideList.length > 0) ? _.where(globalobject.BodyPartSideList, { Text: 'Right' })[0].ID : [];
                 $scope.NomacyLevelList = [{ ID: 1, Text: 1 },
                                           { ID: 2, Text: 2 },
                                           { ID: 3, Text: 3 },
                                           { ID: 4, Text: 4 },
                                           { ID: 5, Text: 5}];

                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/BiometricsService.asmx/GetBiometricsDetails",
                     data: { AppointmentEncounterTypeID: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID), EncounterTypeID: parseInt(globalobject.currentEncounter.EncounterTypeID), EmployeePK: parseInt(globalobject.employee.ID) }
                 };

                 sharedservices.xhrService(configs)
                  .success(getBiometriDataSuccess)
                  .error(function (data, status, headers, config) {
                      $scope.showLoadingOverlay = false;
                  });
             };

             setTimeout(function () {
                 $scope.getBiometricDetails();
             }, 1000);


             function getBiometriDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.BiometricDetails = data.d.Object;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = $scope.BiometricDetails.BiometricTestDetails.BiometricTestID;

                     if ($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime != null && $scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime.substr(0, 2));
                         d.setMinutes($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime.substr(3, 2));
                         $scope.BloodGlucoseTestTime = d;
                     }

                     if ($scope.BiometricDetails.BloodPressure.BloodPresureTestTime != null && $scope.BiometricDetails.BloodPressure.BloodPresureTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BiometricDetails.BloodPressure.BloodPresureTestTime.substr(0, 2));
                         d.setMinutes($scope.BiometricDetails.BloodPressure.BloodPresureTestTime.substr(3, 2));
                         $scope.BloodPresureTestTime = d;
                     }

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime != null && $scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime.substr(0, 2));
                         d.setMinutes($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime.substr(3, 2));
                         $scope.BodyDimensionMeasurementTime = d;
                     }

                     if ($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime != null && $scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime.substr(0, 2));
                         d.setMinutes($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime.substr(3, 2));
                         $scope.LipidProfileTestTime = d;
                     }

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate != null) {
                         $scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate = moment($scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate).format('MMMM DD YYYY');
                     }

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate != null) {
                         $scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate = moment($scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate).format('MMMM DD YYYY');
                     }

                     if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp) {
                         $scope.FieldDisabled = true;
                     }
                     translations.tags = translations.tags.concat($scope.BiometricDetails.Translations);
                     $scope.getIncidentList();
                     if ($scope.BiometricDetails.BiometricTestDetails.BiometricTestID != 0) {
                         $scope.getScheduleFollowUpDetails();
                     }
                     $scope.showLoadingOverlay = false;

                 }
             };

             $scope.CheckDateEmpty = function (date) {

                 if (date == "" && date != undefined || date == null) {
                     return false;
                 }
                 return true;

             };

             $scope.resetSchedulefollwupdetails = function () {
                 $scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp = false;
             }

             //Save Biometric details
             $scope.saveBiometricDetails = function () {
                 $scope.savestatus = true;
                 $scope.msg = '';

                 $scope.scheduleFollowUp.AppointmentTime = moment($scope.DrawTimet).format('HH:mm');
                 $scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime = moment($scope.BloodGlucoseTestTime).format('HH:mm');
                 $scope.BiometricDetails.BloodPressure.BloodPresureTestTime = moment($scope.BloodPresureTestTime).format('HH:mm');
                 $scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime = moment($scope.BodyDimensionMeasurementTime).format('HH:mm');
                 $scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime = moment($scope.LipidProfileTestTime).format('HH:mm');

                 if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp && !(moment($scope.scheduleFollowUp.AppointmentDate)).isAfter(moment())) {
                     $scope.savestatus = false;
                     $scope.msg = $filter('translate')('msgappointmentdateshouldbegreaterthancurrentdate');
                 }

                 //                 if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.CheckDateEmpty($scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate) && !(moment($scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate)).isAfter(moment())) {
                 //                     savestatus = false;
                 //                     msg = $filter('translate')('msgTargetDateShouldNotBeLessThanCurrentDate');
                 //                 }

                 //                 if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.CheckDateEmpty($scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate) && !(moment($scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate)).isAfter(moment())) {
                 //                     savestatus = false;
                 //                     msg = $filter('translate')('msgCompletionDateShouldNotBeLessThanCurrentDate');
                 //                 }
                 if (($scope.BiometricDetails.BiometricTestDetails.WorkRelated === null) || ($scope.BiometricDetails.BiometricTestDetails.PartOfHBR === null)
                       || ($scope.BiometricDetails.BiometricTestDetails.SubmitedForHBR === null) || ($scope.BiometricDetails.BiometricTestDetails.EncounterStatus === null) ||
                       (($scope.BiometricDetails.BiometricTestDetails.EncounterStatus == 1003) && ($scope.BiometricDetails.BiometricTestDetails.ReasonEncounterIncomplete == null || $scope.BiometricDetails.BiometricTestDetails.ReasonEncounterIncomplete == "")) ||

                       (($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestPerformed) &&
                       (
                       ($scope.BiometricDetails.BloodGlucose.MeasurementTypeID == null) || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseUnitOfMeasurementID == null)
                       || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime == null) || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime == "") || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseTestTime == "Invalid date")
                       || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseValue == null) || ($scope.BiometricDetails.BloodGlucose.BloodGlucoseValue == "")
                       )) ||
                       (($scope.BiometricDetails.BloodPressure.BloodPressureTestPerformed) &&
                       (
                       ($scope.BiometricDetails.BloodPressure.TestPositionFrameID == null) || ($scope.BiometricDetails.BloodPressure.TestPositionFrameID == "")
                       || ($scope.BiometricDetails.BloodPressure.BodyPartSideID == null) || ($scope.BiometricDetails.BloodPressure.BodyPartSideID == "")
                       || ($scope.BiometricDetails.BloodPressure.BloodPresureTestTime == null) || ($scope.BiometricDetails.BloodPressure.BloodPresureTestTime == "") || ($scope.BiometricDetails.BloodPressure.BloodPresureTestTime == "Invalid date")
                       || ($scope.BiometricDetails.BloodPressure.MaximumPresure == null) || ($scope.BiometricDetails.BloodPressure.MaximumPresure == "")
                       || ($scope.BiometricDetails.BloodPressure.PresureUnitOfMeasurementID == null) || ($scope.BiometricDetails.BloodPressure.PresureUnitOfMeasurementID == "")
                       || ($scope.BiometricDetails.BloodPressure.MinimumPresure == null) || ($scope.BiometricDetails.BloodPressure.MinimumPresure == "")
                       || ($scope.BiometricDetails.BloodPressure.MinPresureUnitOfMeasurementID == null) || ($scope.BiometricDetails.BloodPressure.MinPresureUnitOfMeasurementID == "")
                       || ($scope.BiometricDetails.BloodPressure.PulseReading == null) || ($scope.BiometricDetails.BloodPressure.PulseReading == "")
                       || ($scope.BiometricDetails.BloodPressure.PulseReadingUnitOfMeasurementID == null) || ($scope.BiometricDetails.BloodPressure.PulseReadingUnitOfMeasurementID == "")
                       || ($scope.BiometricDetails.BloodPressure.MonitoringTypeID == null) || ($scope.BiometricDetails.BloodPressure.MonitoringTypeID == "")
                       || ($scope.BiometricDetails.BloodPressure.IrregularHeartBeat === null) || ($scope.BiometricDetails.BloodPressure.IrregularHeartBeat === "")
                       )) ||
                       (($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest) &&
                       (
                       ($scope.BiometricDetails.BodyDimensionDetails.BodyHeight == null) || ($scope.BiometricDetails.BodyDimensionDetails.BodyHeight == "")
                       || ($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime == null) || ($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime == "") || ($scope.BiometricDetails.BodyDimensionDetails.BodyDimensionMeasurementTime == "Invalid date")
                       || ($scope.BiometricDetails.BodyDimensionDetails.BodyWeight == null) || ($scope.BiometricDetails.BodyDimensionDetails.BodyWeight == "")
                       || ($scope.BiometricDetails.BodyDimensionDetails.WaistCircumference == null) || ($scope.BiometricDetails.BodyDimensionDetails.WaistCircumference == "")
                       || ($scope.BiometricDetails.BodyDimensionDetails.BMIValue == null)

                       )) ||
                       (($scope.BiometricDetails.LipidProfileTest.PeformLipidProfile) &&
                       (
                       ($scope.BiometricDetails.LipidProfileTest.LowDensityLipoprotein == null) || ($scope.BiometricDetails.LipidProfileTest.LowDensityLipoprotein == "")
                       || ($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime == null) || ($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime == "") || ($scope.BiometricDetails.LipidProfileTest.LipidProfileTestTime == "Invalid date")
                       || ($scope.BiometricDetails.LipidProfileTest.HighDensityLipoprotein == null) || ($scope.BiometricDetails.LipidProfileTest.HighDensityLipoprotein == "")
                       || ($scope.BiometricDetails.LipidProfileTest.TotalCholesterolValue == null) || ($scope.BiometricDetails.LipidProfileTest.TotalCholesterolValue == "")
                       || ($scope.BiometricDetails.LipidProfileTest.TriglycerideValue == null) || ($scope.BiometricDetails.LipidProfileTest.TriglycerideValue == "")

                       ))
                        ) {
                     $scope.savestatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp) {

                     $scope.ValidateSF();
                 }


                 if ($scope.savestatus) {
                     $scope.showLoadingOverlay = true;
                     $scope.loadingAction = true;

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate != null) {
                         $scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate = moment($scope.BiometricDetails.BodyDimensionDetails.GoalTargetDate).format('MMMM DD YYYY');
                     }

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyDimentionMeasurementTest && $scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate != null) {
                         $scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate = moment($scope.BiometricDetails.BodyDimensionDetails.GoalCompletionDate).format('MMMM DD YYYY');
                     }


                     configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/BiometricsService.asmx/SaveBiometricsDetails",
                         data: { biometricsObj: $scope.BiometricDetails, EmployeePK: parseInt(globalobject.employee.ID) }
                     };

                     sharedservices.xhrService(configs)

                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              sharedservices.parseDates(data.d.Object);
                              $scope.BiometricDetails = data.d.Object;
                              globalobject.currentEncounter.ExposureEncounterSummaryID = $scope.BiometricDetails.BiometricTestDetails.BiometricTestID;

                              if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp == false) {

                                  $scope.emptySchedulefollowupObject();

                              }

                              if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp && $scope.scheduleFollowUp.EncounterTypeScheduleFollowUpID == 0) {
                                  $scope.saveScheduleFollowUpDetails();
                              }
                              if ($scope.BiometricDetails.BiometricTestDetails.ScheduleFollowUp == false) {
                                  utilityservices.notify("saved");
                              }
                              $scope.showLoadingOverlay = false;
                              $scope.loadingAction = false;
                              $scope.frmBiometrics.$dirty = false;

                          }
                      })
                      .error(function (data, status, headers, config) {
                          $scope.showLoadingOverlay = false;
                          $scope.loadingAction = false;

                      });
                 }
                 else {
                     $scope.savestatus = true;
                     if ($scope.msg != "") {
                         toastr.warning($scope.msg);
                         $scope.showLoadingOverlay = false;
                         $scope.loadingAction = false;
                     }
                 }
             };


             // To get Incident Look UP
             $scope.getIncidentList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                     data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.IncidentList = data.d.Object;
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }

             //Save Check if BMR submitted for the Employee details
             $scope.checkHBRStatus = function () {

                 if ($scope.BiometricDetails.BiometricTestDetails.IsHBRPerformed) {
                     toastr.warning($filter('translate')('msgBiometricTestDetailsoftheEmployeehavebeenpartofHBRwithinthesamebenefityear'));

                     $('#PartOfHBRYes').attr('checked', false);
                     $('#SubmitedForHBRYes').attr('checked', false);
                     $('#PartOfHBRNo').attr('checked', true);
                     $('#SubmitedForHBRNo').attr('checked', true);
                     $scope.BiometricDetails.BiometricTestDetails.PartOfHBR = false;
                     $scope.BiometricDetails.BiometricTestDetails.SubmitedForHBR = false;
                 }
             };


             //Check Numeric validation
             $scope.checkNum = function (itemID, FieldType) {

                 var value_1 = Number($('#' + itemID).val())
                 if ((isNaN(value_1)) || value_1 < 0) {
                     utilityservices.notify("numbers"); // toastr.warning($filter('translate')('msgPleaseEnteravalidmeasurement'));
                     $('#' + itemID).val('');
                     $('#' + itemID).focus();

                     return false;
                 }
                 else {
                     if (FieldType == "Decimal") {
                         var pieces = value_1.toString().split(".");
                         var beforedecimal = (pieces.length > 0) ? pieces[0].length : [];
                         var afterdecimal = (pieces.length > 1) ? pieces[1].length : [];
                         if (beforedecimal > 3 || afterdecimal > 2) {
                             toastr.warning($filter('translate')('msgPleaseEnterameasurementwithin'));
                             $('#' + itemID).val('');
                             $('#' + itemID).focus();
                         }
                         else if (FieldType == "Integer") {
                             if (value_1.toString().length > 3) {
                                 toastr.warning($filter('translate')('msgPleaseEnterameasurementwithin1000'));
                                 $('#' + itemID).val('');
                                 $('#' + itemID).focus();
                             }
                         }
                     }
                 }
             };



             //Get BMI Calculationh
             $scope.GetValue = function (fieldID) {
                 var BodyHeight = 0.00;
                 var BodyWeight = 0.00;
                 //$scope.checkNum(fieldID);
                 if (($scope.BiometricDetails.BodyDimensionDetails.BodyHeight != "" && $scope.BiometricDetails.BodyDimensionDetails.BodyWeight != "" && $scope.BiometricDetails.BodyDimensionDetails.BodyHeightUnitOfMeasurementID != "" && $scope.BiometricDetails.BodyDimensionDetails.BodyWeightUnitOfMeasurementID != "") && ($scope.BiometricDetails.BodyDimensionDetails.BodyHeight != null && $scope.BiometricDetails.BodyDimensionDetails.BodyWeight != null && $scope.BiometricDetails.BodyDimensionDetails.BodyWeightUnitOfMeasurementID != null && $scope.BiometricDetails.BodyDimensionDetails.BodyWeightUnitOfMeasurementID != null)) {
                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyHeightUnitOfMeasurementID == "1017") {
                         BodyHeight = $scope.BiometricDetails.BodyDimensionDetails.BodyHeight / 39.370;
                     }
                     else
                         BodyHeight = $scope.BiometricDetails.BodyDimensionDetails.BodyHeight / 100;

                     if ($scope.BiometricDetails.BodyDimensionDetails.BodyWeightUnitOfMeasurementID == "1007") {
                         BodyWeight = $scope.BiometricDetails.BodyDimensionDetails.BodyWeight / 2.2046;
                     }
                     else
                         BodyWeight = $scope.BiometricDetails.BodyDimensionDetails.BodyWeight;
                     var BMI = (BodyWeight / (BodyHeight * BodyHeight)).toFixed(2);
                     if (BMI >= 1000) {
                         $scope.BiometricDetails.BodyDimensionDetails.BodyHeight == "";
                         $scope.BiometricDetails.BodyDimensionDetails.BodyWeight == "";
                         utilityservices.notify("numbers"); // toastr.warning($filter('translate')('msgPleaseEnteravalidmeasurement'));

                     }

                     else
                         $scope.BiometricDetails.BodyDimensionDetails.BMIValue = BMI;
                 }
                 else
                     $scope.BiometricDetails.BodyDimensionDetails.BMIValue = null;

             };


             // On click of Cancel
             $scope.cancel = function () {

                 if ($scope.frmBiometrics.$dirty) {

                     var modalInstance = $modal.open({
                         animation: $scope.animationsEnabled,
                         templateUrl: '/OccHealth/modals/confirmation-modal.html',
                         controller: 'CancelModalCtrl',
                         size: 'sm',
                         scope: $scope
                     });
                 }

                 else {
                     if (globalobject.currentEncounter.FromSOAListScreen) {
                         sharedservices.reloadParent();
                     }
                     else {
                         if (globalobject.RedirectFrom == 'Encounter')
                             $location.path("/appointmentcentral");

                         else if (globalobject.RedirectFrom == 'EmployeeMedicalProfile')
                             $location.path("/employeemedicalprofile");

                     }

                 }
             }

             //Change UOM Drop Down Selection
             $scope.setUOM = function (UOMType) {

                 if ($scope.BiometricDetails.LipidProfileTest.DensityUnitOfMeasurementID != null && $scope.BiometricDetails.LipidProfileTest.DensityUnitOfMeasurementID != "") {
                     $scope.BiometricDetails.LipidProfileTest.CholesterolUnitOfMeasurementID = $scope.BiometricDetails.LipidProfileTest.DensityUnitOfMeasurementID;
                     $scope.BiometricDetails.LipidProfileTest.TriglycerideUnitOfMeasurementID = $scope.BiometricDetails.LipidProfileTest.DensityUnitOfMeasurementID;

                 }
             };

             setTimeout(function () { $scope.frmBiometrics.$dirty = false; }, 1000);

             // End
         } ]);
