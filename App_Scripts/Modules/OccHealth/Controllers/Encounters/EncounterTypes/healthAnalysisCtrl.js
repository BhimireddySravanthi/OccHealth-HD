
angular.module("app")
        .controller("healthAnalysisCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {
             $scope.changeSubView = sharedservices.changeSubView;
             $scope.navBarOptions = {
                 detailsFormId: 1031,
                 resultsFormId: undefined,
                 investigationFormId: undefined
             };
             $scope.showField = false;
             $scope.toggleQuestionComment = function (question) {
                 question.commentStatus = !question.commentStatus;
             };
             var strGlobalHealthAnalysisDetailID = globalobject.currentEncounter.ExposureEncounterSummaryID;
             var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
             var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;

             $scope.UomtypeList = globalobject.UomtypeList;
             $scope.DispositionTypeList = globalobject.DispositionTypeList;
             $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
             $scope.EncounterTypeList = globalobject.EncounterTypeList;
             $scope.BodyHeightUOMList = globalobject.HeightUOMList;
             $scope.WaistCircumferenceUOMList = globalobject.HeightUOMList;
             $scope.BodyWeightUOMList = globalobject.WeightUOMList;
             $scope.DLUOMList = globalobject.DensityUOMList;
             $scope.TotalCholesterolUOMList = globalobject.DensityUOMList;
             $scope.TriglycerideUnitUOMList = globalobject.DensityUOMList;
             if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "yes") {
                 $scope.AllowPastAppointmentandEncounters = true;
             }
             else {
                 $scope.AllowPastAppointmentandEncounters = false;
             }

             $scope.IsDisable = false;
             $scope.myDate = new Date();

             $scope.hourStep = sharedservices.hourStep;
             $scope.hourBtStep = sharedservices.minuteStep;
             $scope.hourLtStep = sharedservices.hourStep;
             $scope.hourEtStep = sharedservices.hourStep;

             $scope.minuteStep = sharedservices.minuteStep;
             $scope.minuteBtStep = sharedservices.minuteStep;
             $scope.minuteLtStep = sharedservices.minuteStep;
             $scope.minuteEtStep = sharedservices.minuteStep;


             $scope.DrawTimet = new Date();
             $scope.DrawTimeBt = new Date();
             $scope.DrawTimeLt = new Date();
             $scope.DrawTimeEt = new Date();
             $scope.saveStatus = true;
             $scope.loadingAction = false;
             $scope.FieldDisabled = false;
             $scope.validData = true;

             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.HealthAnalysis = {
                 HealthAnalysisDetailID: strGlobalHealthAnalysisDetailID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , WorkRelated: null
            , IncidentID: null
            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: null
            , ScheduleFollowUp: false
            , hourStep: ""
            , minuteStep: ""
            , CreatedBy: 0
             };

             $scope.BodyDimensionMeasurement = {
                 BodyDimentionMeasurementTest: false
            , BodyDimensionMeasurementTime: ""
            , BodyHeight: null
            , BodyHeightUnitOfMeasurementID: null
            , BodyWeight: null
            , BodyWeightUnitOfMeasurementID: null
            , WaistCircumference: null
            , WaistCircumferenceUnitOfMeasurementID: null
            , WeightPercentageChange: null
            , BMIValue: null
            , GoalWeight: null
            , GoalTargetDate: ""
            , GoalCompletionDate: ""
            , BodyDimensionMeasurementNote: ""
             };

             $scope.LipidProfileTest = {
                 PeformLipidProfile: false
            , LipidProfileTestTime: ""
            , HighDensityLipoprotein: null
            , DensityUnitOfMeasurementID: null
            , LowDensityLipoprotein: null
            , LowDensityUnitOfMeasurementID: null
            , TotalCholesterolValue: null
            , CholesterolUnitOfMeasurementID: null
            , TriglycerideValue: null
            , TriglycerideUnitOfMeasurementID: null
            , LipidProfileTestNote: ""
             };

             $scope.EyeTest = {
                 PerformVision: false
            , EyeTestTime: ""
            , VisionAcuity: ""
            , LeftEye: null
            , RightEye: null
            , BothEyes: null
            , EyeTestNote: ""
             };


             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.SetRangeType = function () {
                 if ($scope.LipidProfileTest.DensityUnitOfMeasurementID != null && $scope.LipidProfileTest.DensityUnitOfMeasurementID != "") {
                     $scope.LipidProfileTest.CholesterolUnitOfMeasurementID = $scope.LipidProfileTest.DensityUnitOfMeasurementID;
                     $scope.LipidProfileTest.TriglycerideUnitOfMeasurementID = $scope.LipidProfileTest.DensityUnitOfMeasurementID;
                     setTimeout(function () { $('#TotalCholesterolUOMList').val($scope.LipidProfileTest.CholesterolUnitOfMeasurementID); }, 50);
                     setTimeout(function () { $('#TriglycerideUnitUOMList').val($scope.LipidProfileTest.TriglycerideUnitOfMeasurementID); }, 100);
                     setTimeout(function () { $('#DensityUnitOfMeasurementID').val($scope.LipidProfileTest.TriglycerideUnitOfMeasurementID); }, 200);


                     setTimeout(function () { $('#TotalCholesterolUOMList').focus(); }, 500);
                     setTimeout(function () { $('#TotalCholesterolUOMList').blur(); }, 500);
                     setTimeout(function () { $('#TriglycerideUnitUOMList').focus(); }, 500);
                     setTimeout(function () { $('#TriglycerideUnitUOMList').blur(); }, 500);
                     setTimeout(function () { $('#DensityUnitOfMeasurementID').focus(); }, 500);
                     setTimeout(function () { $('#DensityUnitOfMeasurementID').blur(); }, 500);
                 }
             };
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.keyPressWithDot = function (obj) {

                 if (obj != '' && obj != null) {
                     var value_1 = Number($('#' + obj).val());
                     if ((isNaN(value_1)) || value_1 < 0) {
                         toastr.warning("Please Enter a valid measurement");
                         $('#' + obj).val('');
                         $('#' + obj).focus();

                         return false;
                     }
                     else {
                         var pieces = Number($('#' + obj).val()).toString().split(".");
                         var beforedecimal = (pieces.length > 0) ? pieces[0].length : [];
                         var afterdecimal = (pieces.length > 1) ? pieces[1].length : [];
                         if (beforedecimal > 3 || afterdecimal > 2) {
                             toastr.warning("Please Enter a  measurement within (0.00 - 999.99)");
                             $('#' + obj).val('');
                             $('#' + obj).focus();
                         }
                     }

                 }

             };




             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.checkNum = function (e, obj) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     utilityservices.notify("numbers");
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
             };

             $scope.CheckRange = function (obj) {
                 var msg1;
                 if ($('#' + obj).val() != null && $('#' + obj).val() != '') {
                     switch (obj) {
                         case 'LeftEye':
                             if ($('#' + obj).val() != null && ($('#' + obj).val() > 201 || $('#' + obj).val() < -1)) {
                                 msg1 = $filter('translate')('msgValueShouldBeBetween0To200');
                                 $('#' + obj).val('');
                                 toastr.warning(msg1);
                                 $scope.EyeTest.LeftEye = null;
                             }
                             break;
                         case 'RightEye':
                             if ($('#' + obj).val() != null && ($('#' + obj).val() > 201 || $('#' + obj).val() < -1)) {
                                 msg1 = $filter('translate')('msgValueShouldBeBetween0To200');
                                 $('#' + obj).val('');
                                 toastr.warning(msg1);
                                 $scope.EyeTest.RightEye = null;
                             }
                             break;
                         case 'BothEyes':
                             if ($('#' + obj).val() != null && ($('#' + obj).val() > 201 || $('#' + obj).val() < -1)) {
                                 msg1 = $filter('translate')('msgValueShouldBeBetween0To200');
                                 $('#' + obj).val('');
                                 toastr.warning(msg1);
                                 $scope.validData = false;
                                 $scope.EyeTest.BothEyes = null;
                             }

                             break;
                         default:
                             break;
                     }
                 }
             };


             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.GetValue = function () {
                 var BodyHeight = 0.00;
                 var BodyWeight = 0.00;
                 if (($scope.BodyDimensionMeasurement.BodyHeight != "" && $scope.BodyDimensionMeasurement.BodyWeight != "" && $scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID != "" && $scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID != "") && ($scope.BodyDimensionMeasurement.BodyHeight != null && $scope.BodyDimensionMeasurement.BodyWeight != null && $scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID != null && $scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID != null)) {
                     if ($scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID == "1017") {
                         BodyHeight = $scope.BodyDimensionMeasurement.BodyHeight / 39.370;
                     }
                     else
                         BodyHeight = $scope.BodyDimensionMeasurement.BodyHeight / 100;

                     if ($scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID == "1007") {
                         BodyWeight = $scope.BodyDimensionMeasurement.BodyWeight / 2.2046;
                     }
                     else
                         BodyWeight = $scope.BodyDimensionMeasurement.BodyWeight;
                     var BMI = (BodyWeight / (BodyHeight * BodyHeight)).toFixed(2);
                     if (BMI >= 1000) {
                         $scope.BodyDimensionMeasurement.BodyHeight == "";
                         $scope.BodyDimensionMeasurement.BodyWeight == "";
                         toastr.warning("BMI value should be within (0.00 - 999.99)");
                         $scope.BodyDimensionMeasurement.BMIValue = "";

                     }

                     else
                         $scope.BodyDimensionMeasurement.BMIValue = BMI;
                 }

                 else
                     $scope.BodyDimensionMeasurement.BMIValue = null;

             };
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             // Function to Get the Details ******************
             $scope.getEncounterDetails = function () {
                 globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);
                 var configs = {
                     url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                     data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
                 };
                 sharedservices.xhrService(configs)
                    .then(function (response) {
                        globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                        globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                        globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        strGlobalHealthAnalysisDetailID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        $scope.EncounterTypeList = globalobject.EncounterTypeList;

                        if (strGlobalHealthAnalysisDetailID > 0) {
                            $scope.getHealthAnalysisDetails();
                        }

                    });

             };
             $scope.getEncounterDetails();

             ////////////////////////////////////////////////////////////////////////////////////////////////////


             $scope.cancel = function () {

                 if ($scope.frmHealthAnalysis.$dirty) {

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

             $scope.resetSchedulefollwupdetails = function () {
                 $scope.HealthAnalysis.ScheduleFollowUp = false;
             }

             ////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.getHealthAnalysisDetails = function () {
                 var configs = {};
                 sharedservices.parseDates(globalobject.currentEncounter);
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/HealthAnalysisDetailService.asmx/getHealthAnalysisDetails",
                     data: { HealthAnalysisDetailID: globalobject.currentEncounter.ExposureEncounterSummaryID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };


             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.HealthAnalysis = data.d.Object.HealthAnalysis;
                     $scope.BodyDimensionMeasurement = data.d.Object.BodyDimensionMeasurement;
                     $scope.LipidProfileTest = data.d.Object.LipidProfileTest;
                     $scope.EyeTest = data.d.Object.EyeTest;
                     strGlobalHealthAnalysisDetailID = $scope.HealthAnalysis.HealthAnalysisDetailID;


                     setTimeout(function () { $('#BodyHeightUOMList').val($scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID); }, 500);
                     setTimeout(function () { $('#WaistCircumferenceUOMList').val($scope.BodyDimensionMeasurement.WaistCircumferenceUnitOfMeasurementID); }, 500);
                     setTimeout(function () { $('#BodyWeightUOMList').val($scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID); }, 500);
                     setTimeout(function () { $('#BodyWeightUnitOfMeasurementID').val($scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID); }, 500);
                     setTimeout(function () { $('#DLUOMList').val($scope.LipidProfileTest.DensityUnitOfMeasurementID); }, 500);
                     //  setTimeout(function () { $('#DensityUnitOfMeasurementID').val($scope.LipidProfileTest.DensityUnitOfMeasurementID); }, 500);

                     setTimeout(function () { $('#TotalCholesterolUOMList').val($scope.LipidProfileTest.CholesterolUnitOfMeasurementID); }, 500);
                     setTimeout(function () { $('#TriglycerideUnitUOMList').val($scope.LipidProfileTest.TriglycerideUnitOfMeasurementID); }, 500);

                     if ($scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime != null && $scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime.substr(0, 2));
                         d.setMinutes($scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime.substr(3, 2));
                         $scope.DrawTimeBt = d;
                     }
                     if ($scope.LipidProfileTest.LipidProfileTestTime != null && $scope.LipidProfileTest.LipidProfileTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.LipidProfileTest.LipidProfileTestTime.substr(0, 2));
                         d.setMinutes($scope.LipidProfileTest.LipidProfileTestTime.substr(3, 2));
                         $scope.DrawTimeLt = d;
                     }
                     if ($scope.EyeTest.EyeTestTime != null && $scope.EyeTest.EyeTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.EyeTest.EyeTestTime.substr(0, 2));
                         d.setMinutes($scope.EyeTest.EyeTestTime.substr(3, 2));
                         $scope.DrawTimeEt = d;
                     }

                     if ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest && $scope.BodyDimensionMeasurement.GoalTargetDate != null && $scope.BodyDimensionMeasurement.GoalTargetDate != '') {
                         $scope.BodyDimensionMeasurement.GoalTargetDate = moment($scope.BodyDimensionMeasurement.GoalTargetDate).format('MMMM DD YYYY');
                     }

                     if ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest && $scope.BodyDimensionMeasurement.GoalCompletionDate != null && $scope.BodyDimensionMeasurement.GoalCompletionDate != '') {
                         $scope.BodyDimensionMeasurement.GoalCompletionDate = moment($scope.BodyDimensionMeasurement.GoalCompletionDate).format('MMMM DD YYYY');
                     }

                     if ($scope.HealthAnalysis.ScheduleFollowUp) {

                         $scope.getScheduleFollowUpDetails();
                     }

                 }

             };

             function getDetailDataError(data, status, headers, config) {

             };

             ////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.getIncidentList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                     data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.incidentList = data.d.Object;
                              setTimeout(function () { $('#ddlIncidentList').val($scope.HealthAnalysis.IncidentID); }, 500);
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }
             $scope.getIncidentList();

             ////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.saveHealthAnalysis = function () {

                 $scope.msg = '';
                 $scope.saveStatus = true;
                 $scope.showLoadingOverlay = true;
                 $scope.HealthAnalysis.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                 if ($scope.HealthAnalysis.EncounterStatus == 1002) {
                     $scope.HealthAnalysis.ReasonEncounterIncomplete = null;
                 }
                 if ($scope.HealthAnalysis.WorkRelated == false) {
                     $scope.HealthAnalysis.IncidentID = null;
                 }
                 if ($scope.HealthAnalysis.WorkRelated == true && ($scope.HealthAnalysis.IncidentID==""||$scope.HealthAnalysis.IncidentID==null)) {
                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                  if ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest) {
                     $scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime = $('#hdnTimeB').val();
                     if ($scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime == null || $scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime == ''
                       || $scope.BodyDimensionMeasurement.BodyHeight == null || $scope.BodyDimensionMeasurement.BodyHeight == ''
                       || $scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID == null || $scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID == ''
                       || $scope.BodyDimensionMeasurement.BodyWeight == null || $scope.BodyDimensionMeasurement.BodyWeight == ''
                       || $scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID == null || $scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID == ''
                       || $scope.BodyDimensionMeasurement.WaistCircumference == null || $scope.BodyDimensionMeasurement.WaistCircumference == ''
                       || $scope.BodyDimensionMeasurement.WaistCircumferenceUnitOfMeasurementID == null || $scope.BodyDimensionMeasurement.WaistCircumferenceUnitOfMeasurementID == ''
                       || $scope.BodyDimensionMeasurement.BMIValue == null || $scope.BodyDimensionMeasurement.BMIValue == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.BodyDimensionMeasurement.BodyDimensionMeasurementTime = '';
                     $scope.BodyDimensionMeasurement.BodyHeight = null;
                     $scope.BodyDimensionMeasurement.BodyHeightUnitOfMeasurementID = '';
                     $scope.BodyDimensionMeasurement.BodyWeight = null;
                     $scope.BodyDimensionMeasurement.BodyWeightUnitOfMeasurementID = null
                     $scope.BodyDimensionMeasurement.WaistCircumference = null;
                     $scope.BodyDimensionMeasurement.BMIValue == null;
                     $scope.BodyDimensionMeasurement.WaistCircumferenceUnitOfMeasurementID = null;
                     $scope.BodyDimensionMeasurement.WeightPercentageChange = null;
                     $scope.BodyDimensionMeasurement.GoalWeight = null;
                     $scope.BodyDimensionMeasurement.GoalTargetDate = '';
                     $scope.BodyDimensionMeasurement.GoalCompletionDate = '';
                     $scope.BodyDimensionMeasurement.BodyDimensionMeasurementNote = '';
                 }


                 if ($scope.LipidProfileTest.PeformLipidProfile) {
                     $scope.LipidProfileTest.LipidProfileTestTime = $('#hdnTimeL').val();
                     if ($scope.LipidProfileTest.LipidProfileTestTime == null || $scope.LipidProfileTest.LipidProfileTestTime == ''
                       || $scope.LipidProfileTest.HighDensityLipoprotein == null || $scope.LipidProfileTest.HighDensityLipoprotein == ''
                       || $scope.LipidProfileTest.DensityUnitOfMeasurementID == null || $scope.LipidProfileTest.DensityUnitOfMeasurementID == ''
                         || $scope.LipidProfileTest.LowDensityUnitOfMeasurementID == null || $scope.LipidProfileTest.LowDensityUnitOfMeasurementID == ''
                       || $scope.LipidProfileTest.LowDensityLipoprotein == null || $scope.LipidProfileTest.LowDensityLipoprotein == ''
                       || $scope.LipidProfileTest.TotalCholesterolValue == null || $scope.LipidProfileTest.TotalCholesterolValue == ''
                       || $scope.LipidProfileTest.CholesterolUnitOfMeasurementID == null || $scope.LipidProfileTest.CholesterolUnitOfMeasurementID == ''
                       || $scope.LipidProfileTest.TriglycerideValue == null || $scope.LipidProfileTest.TriglycerideValue == ''
                       || $scope.LipidProfileTest.TriglycerideUnitOfMeasurementID == null || $scope.LipidProfileTest.TriglycerideUnitOfMeasurementID == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }

                 else {
                     $scope.LipidProfileTest.LipidProfileTestTime = '';
                     $scope.LipidProfileTest.LowDensityLipoprotein = null;
                     $scope.LipidProfileTest.HighDensityLipoprotein = '';
                     $scope.LipidProfileTest.DensityUnitOfMeasurementID = null;
                     $scope.LipidProfileTest.LowDensityUnitOfMeasurementID = null;
                     $scope.LipidProfileTest.TotalCholesterolValue = null
                     $scope.LipidProfileTest.CholesterolUnitOfMeasurementID = null;
                     $scope.LipidProfileTest.TriglycerideValue = null;
                     $scope.LipidProfileTest.TriglycerideUnitOfMeasurementID = null;
                 }


                 if ($scope.EyeTest.PerformVision) {
                     $scope.EyeTest.EyeTestTime = $('#hdnTimeE').val();
                     if ($scope.EyeTest.EyeTestTime == null || $scope.EyeTest.EyeTestTime == '') {
                         $scope.saveStatus = false;
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }

                 else {
                     $scope.EyeTest.EyeTestTime = '';
                     $scope.EyeTest.VisionAcuity = '';
                     $scope.EyeTest.LeftEye = null;
                     $scope.EyeTest.RightEye = null;
                     $scope.EyeTest.BothEyes = null;
                     $scope.EyeTest.EyeTestNote = '';
                 }


                 if ($scope.HealthAnalysis.WorkRelated == null
                || ($scope.HealthAnalysis.EncounterStatus == null || $scope.HealthAnalysis.EncounterStatus == '')
                || ($scope.HealthAnalysis.EncounterStatus == 1003 && ($scope.HealthAnalysis.ReasonEncounterIncomplete == null || $scope.HealthAnalysis.ReasonEncounterIncomplete == ""))) {

                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                 }

                 if (!$scope.AllowPastAppointmentandEncounters && ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest == true && $scope.BodyDimensionMeasurement.GoalTargetDate != '' && $scope.BodyDimensionMeasurement.GoalTargetDate != null) && (new Date($scope.BodyDimensionMeasurement.GoalTargetDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0))) {

                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgTargetDateShouldBeGreaterThanCurrentDate');
                 }


                 if (!$scope.AllowPastAppointmentandEncounters && ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest == true && $scope.BodyDimensionMeasurement.GoalCompletionDate != '' && $scope.BodyDimensionMeasurement.GoalCompletionDate != null) && (new Date($scope.BodyDimensionMeasurement.GoalCompletionDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0))) {

                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgCompletionDateShouldBeGreaterThanCurrentDate');
                 }




                 if ($scope.HealthAnalysis.ScheduleFollowUp == true) {

                     $scope.ValidateSF();
                 }

                 if ($scope.saveStatus && !$scope.loadingAction) {

                     if ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest && $scope.BodyDimensionMeasurement.GoalTargetDate != null && $scope.BodyDimensionMeasurement.GoalTargetDate != '') {
                         $scope.BodyDimensionMeasurement.GoalTargetDate = moment($scope.BodyDimensionMeasurement.GoalTargetDate).format('MMMM DD YYYY');
                     }

                     if ($scope.BodyDimensionMeasurement.BodyDimentionMeasurementTest && $scope.BodyDimensionMeasurement.GoalCompletionDate != null && $scope.BodyDimensionMeasurement.GoalCompletionDate != '') {
                         $scope.BodyDimensionMeasurement.GoalCompletionDate = new Date($scope.BodyDimensionMeasurement.GoalCompletionDate).toDateString();
                         $scope.BodyDimensionMeasurement.GoalCompletionDate = moment($scope.BodyDimensionMeasurement.GoalCompletionDate).format('MMMM DD YYYY');
                     }

                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/HealthAnalysisDetailService.asmx/SaveHealthAnalysisDetails",
                         data: { HealthAnalysisDetailObj: $scope.HealthAnalysis, BodyDimensionMeasurementObj: $scope.BodyDimensionMeasurement, LipidProfileTestObj: $scope.LipidProfileTest, EyeTestObj: $scope.EyeTest }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                 }
                 else {
                     $scope.saveStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if ($scope.msg != "") {
                         toastr.warning($scope.msg);
                     }
                 }

             };


             function saveDetailDataSuccess(data, status, headers, config) {

                 sharedservices.parseDates(data.d.Object);
                 $scope.HealthAnalysis.HealthAnalysisDetailID = data.d;
                 globalobject.currentEncounter.ExposureEncounterSummaryID = data.d;
                 globalobject.currentEncounter.SelectedEncounterTypeID = globalobject.currentEncounter.EncounterTypeID;
                 setTimeout(function () { $scope.frmHealthAnalysis.$dirty = false; }, 1000);

                 if ($scope.HealthAnalysis.ScheduleFollowUp == false) {
                     $scope.emptySchedulefollowupObject();
                 }

                 if ($scope.HealthAnalysis.ScheduleFollowUp == true) {
                     $scope.saveScheduleFollowUpDetails();
                 }

                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;

                 if ($scope.HealthAnalysis.ScheduleFollowUp == false) {
                     toastr.success($filter('translate')('msgSavedSuccessfully'));
                 }


             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };

             setTimeout(function () { $scope.frmHealthAnalysis.$dirty = false; }, 1000);

         } ]);



       
