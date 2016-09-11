angular.module("app")

    .controller("audiometricTestingCtrl", ["$scope", "$timeout", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "$window", "utilityservices",

         function ($scope, $timeout, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.changeSubView = sharedservices.changeSubView
             $scope.globalobject = globalobject;
             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricDetails" : 1020,
                 resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricResults" : 2020,
                 hearingResultsHistoryFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/ResultsHistory" : 2024,
                 recordkeepingFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/Recordkeeping" : 2022,
                 nextStepsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/NextSteps" : 2023,
                 investigationFormId: undefined
             };
             if (globalobject.currentEncounter.PersonnelTypeID == 1003) {
                 globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = false;
                 globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;

             }
             else {
                 globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;

             }
             $scope.showSubNavbars = true;


             $scope.myDate = new Date();
             // globalobject.resultsSaved = false;
             $scope.hourStep = sharedservices.hourStep;
             $scope.minuteStep = sharedservices.minuteStep;

             $scope.audiometricEarTesting = {
                 RightEarSymptomtype: [],
                 LeftEarSymptomtype: []
             };
             $scope.leftEarRevised = false;
             $scope.rightEarRevised = false;

             $scope.DrawTimet = new Date();
             $scope.loadingAction = false;
             $scope.audiometricTesting = {
                 ExposureEncounterSummaryID: globalobject.currentEncounter.ExposureEncounterSummaryID
            , AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID
            , WorkRelated: null
            , IncidentID: 0
            , LeftEarSymptom: ""
            , RightEarSymptom: ""
            , VisitCategoryID: 0
            , AudiometricBoothSerial: ""
            , LastCalibrationDate: ""
            , ExposureLevel: ""
            , NoiseLevel: ""
            , RetestDate: ""
            , ReviewedDate: ""
            , ReviewedBy: 0
            , ProtectorDetailID: 0
            , QuietRoom: false
            , EncounterStatus: 0
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: 0
            , ScheduleFollowUp: false
           // , CreatedBy: globalobject.currentSession.userid
            , SampleID: ""
            , LaboratorylID: 0
            , EncounterDetailID: 0
            , EmployeeName: ""
            , EncounterTypeID: ""
             };



             $scope.audiometricResults = {
                 AudiometricTestID: 0
            , LeftEarBodyPartSideID: 0
            , RightEarBodyPartSideID: 0
            , LeftEarFrequency500: null
            , LeftEarFrequency1000: null
            , LeftEarFrequency2000: null
            , LeftEarFrequency3000: null
            , LeftEarFrequency4000: null
            , LeftEarFrequency6000: null
            , LeftEarFrequency8000: null
            , RightEarFrequency500: null
            , RightEarFrequency1000: null
            , RightEarFrequency2000: null
            , RightEarFrequency3000: null
            , RightEarFrequency4000: null
            , RightEarFrequency6000: null
            , RightEarFrequency8000: null
         //   , CreatedBy: globalobject.currentSession.userid
             , EmployeePK: 0
            , AppointmentDate: null
            , AudiometricLeftTestresultID: 0
            , AudiometricRightTestresultID: 0
             };

             $scope.ExposureTypeList = globalobject.ExposureTypeAudiometricTestingList;
             $scope.ProtectorList = globalobject.ProtectorDetailList;
             $scope.DiagnosticTypeList = globalobject.DiagnosticMethodList;
             $scope.BodyPartSideList = globalobject.BodyPartSideList;

             //globalobject.IsSTSVisible = true;

             $scope.GoToPreviousPage = function () {
                 $window.history.back();
             }

             $scope.FieldDisabled = false;

             $scope.GetUserNamesList = function () {
                 if ($scope.showLoadingOverlay == false) {
                     $scope.loadingAction = true;
                     $scope.showLoadingOverlay = true;
                 }
                 var configs = {
                     url: "/WebServices/Foundation/UserService.asmx/GetUserNamesList"
                 };
                 sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);
                   $scope.UserList = data.d.Object;
                   $timeout(function () {
                       $('#ddlRespiratorType').val($scope.audiometricTesting.ReviewedBy);
                       $scope.loadingAction = false;
                       $scope.showLoadingOverlay = false;
                   }, 3000);

               })
                .error(function () {
                })
             }

             $scope.getAudiometricDetails = function () {
                 globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);
                 globalobject.currentEncounter.EmployeePK = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ? parseInt(sharedservices.getURLParameter().EmployeePK) : parseInt(globalobject.currentEncounter.EmployeePK);
                 var configs = {
                     url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                     data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
                 };

                 sharedservices.xhrService(configs)
                    .then(function (response) {
                        if (response.data.d.IsOK) {
                            sharedservices.parseDates(response.data.d.Object[0]);
                            globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                            globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                            globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            $scope.audiometricTesting.ExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;

                            if (globalobject.currentEncounter.FromSOAListScreen) {
                                globalobject.currentEncounter.EncounterDetailDate = response.data.d.Object[0].EncounterDate;
                            }
                        }
                        else {
                            $scope.audiometricTesting.ExposureEncounterSummaryID = 0;
                        }
                        $scope.audiometricTesting.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.getIncidentList();

                        if (globalobject.currentEncounter.FromSOAListScreen)
                            $scope.GetUserNamesList();
                        else
                            $scope.UserList = globalobject.UserList;
                        $scope.getEquipmentSerialList();
                        $scope.getexposureAudiometric();
                        $scope.getAudiometricResults();
                    });

             };
             //setTimeout(function () { $scope.getAudiometricDetails(); }, 200);
             //$scope.getAudiometricDetails(); 

             $scope.getIncidentList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                     data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.IncidentIdList = data.d.Object;
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }

             $scope.resetSchedulefollwupdetails = function () {
                 $scope.audiometricTesting.ScheduleFollowUp = false;
             }

             $scope.getEquipmentSerialList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/Inventory/EquipmentService.asmx/GetEquipmentDetails",
                     data: { EquipmentCategoryID: 1000 }
                 };
                 sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.AudiometricBoothSerialList = data.d.Object;
                    }
                })
                .error(function (data, status, headers, config) {

                });
             }

             $scope.charlimit = function (itemID, val) {

                 if (val.length > 3) {
                     $('#' + itemID).val('');
                     $('#' + itemID).focus();
                     toastr.warning('Please enter 3 charcters only.');
                 }
             };

             $scope.getTestTypeList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetAudiometricTestTypeExists",
                     data: { EmployeePK: globalobject.currentEncounter.EmployeePK, AudiometricTestID: globalobject.currentEncounter.ExposureEncounterSummaryID }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.TestTypeList = data.d.Object;
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }
             $scope.getTestTypeList();

             $scope.onSelected = function (selectedItem) {
                 sharedservices.parseDates(selectedItem);
                 $scope.audiometricTesting.LastCalibrationDate = selectedItem.CalibrationDate;
             }

             $scope.cancelAudiometric = function (fromPage) {

                 if (fromPage == 'Details')
                     $scope.Dirty = $scope.frmAudiometricsDetails.$dirty;

                 if (fromPage == 'Results')
                     $scope.Dirty = $scope.frmAudiometricsResults.$dirty;

                 if (fromPage == 'NextStep')
                     $scope.Dirty = $scope.frmAudiometricsNextStep.$dirty;

                 if ($scope.Dirty) {

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

             $scope.getexposureAudiometric = function () {

                 $scope.loadingAction = true;
                 $scope.showLoadingOverlay = true;

                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetAudiometricDetails",
                     data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, ExposureEncounterSummaryID: $scope.audiometricTesting.ExposureEncounterSummaryID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };

             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);

                     $scope.audiometricTesting = data.d.Object;

                     if ($scope.audiometricTesting.ExposureEncounterSummaryID == 0) {
                         $scope.audiometricTesting.WorkRelated = null;
                         $scope.audiometricTesting.QuietRoom = '1';
                         $scope.audiometricTesting.EncounterStatus = '1002';
                     }

                     else {

                         $scope.audiometricEarTesting.LeftEarSymptomtype = JSON.parse("[" + data.d.Object.LeftEarSymptom.replace(/^,|,$/g, '') + "]");
                         $scope.audiometricEarTesting.RightEarSymptomtype = JSON.parse("[" + data.d.Object.RightEarSymptom.replace(/^,|,$/g, '') + "]");
                     }

                     if ($scope.audiometricTesting.AudiometricTestResultID > 0) {
                         globalobject.resultsSaved = true;
                         globalobject.IsSTSVisible = data.d.Object.IsSTSVisible;

                     }
                     else {
                         globalobject.resultsSaved = false;
                     }

                     $scope.audiometricTesting.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                     $scope.audiometricTesting.EncounterTypeID = globalobject.currentEncounter.SelectedEncounterTypeID;

                     if (globalobject.currentEncounter.FromSOAListScreen == false) {
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                     }

                 }

                 else {

                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                 }
             };



             $scope.getnextStepsAudiometric = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetNextStepsAudiometric",
                     data: { AppointmentEncounterTypeID: $scope.audiometricTesting.AppointmentEncounterTypeID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getNextstepsDataSuccess)
                  .error(getDetailDataError);
             };

             function getNextstepsDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.audiometricTesting = data.d.Object;
                     if ($scope.audiometricTesting.ExposureEncounterSummaryID == 0) {
                         $scope.audiometricTesting.WorkRelated = null;
                         $scope.audiometricTesting.QuietRoom = '1';
                         $scope.audiometricTesting.EncounterStatus = '1002';
                     }

                     $scope.audiometricTesting.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                     $scope.audiometricTesting.EncounterTypeID = globalobject.currentEncounter.SelectedEncounterTypeID;

                     if ($scope.audiometricTesting.ScheduleFollowUp) {
                         $scope.getScheduleFollowUpDetails();
                     }

                 }
             };




             function getDetailDataError(data, status, headers, config) {

                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };





             $scope.saveAudiometricDetails = function () {
                 $scope.audiometricTesting.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                 $scope.audiometricTesting.EncounterTypeID = globalobject.currentEncounter.SelectedEncounterTypeID;
                 $scope.saveStatus = true;
                 $scope.msg = '';

                 $scope.audiometricTesting.LeftEarSymptom = (angular.isArray($scope.audiometricEarTesting.LeftEarSymptomtype)) ? $scope.audiometricEarTesting.LeftEarSymptomtype.join() : $scope.audiometricEarTesting.LeftEarSymptomtype;
                 $scope.audiometricTesting.RightEarSymptom = (angular.isArray($scope.audiometricEarTesting.RightEarSymptomtype)) ? $scope.audiometricEarTesting.RightEarSymptomtype.join() : $scope.audiometricEarTesting.RightEarSymptomtype;

                 if ($scope.audiometricTesting.WorkRelated == null) {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.audiometricTesting.LeftEarSymptom == null || $scope.audiometricTesting.LeftEarSymptom == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if ($scope.audiometricTesting.RightEarSymptom == null || $scope.audiometricTesting.RightEarSymptom == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 //                 if ($scope.audiometricTesting.VisitCategoryID == null || $scope.audiometricTesting.VisitCategoryID == '') {
                 //                     $scope.saveStatus = false;
                 //                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 //                 }
                 if ($scope.audiometricTesting.AudiometricBoothSerial == null || $scope.audiometricTesting.AudiometricBoothSerial == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if ($scope.audiometricTesting.ExposureLevel == null || $scope.audiometricTesting.ExposureLevel == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if ($scope.audiometricTesting.NoiseLevel == null || $scope.audiometricTesting.NoiseLevel == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if ($scope.audiometricTesting.ReviewedDate == null || $scope.audiometricTesting.ReviewedDate == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if ($scope.audiometricTesting.ProtectorDetailID == null || $scope.audiometricTesting.ProtectorDetailID == '') {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }





                 if ($scope.saveStatus) {
                     $scope.showLoadingOverlay = true;
                     $scope.loadingAction = true;
                     if ($scope.audiometricTesting.WorkRelated == 0) {
                         $scope.audiometricTesting.IncidentID = 0;
                         $scope.audiometricTesting.WorkRelated = false;
                     }
                     else {
                         $scope.audiometricTesting.WorkRelated = true;
                     }

                     if ($scope.audiometricTesting.QuietRoom == 0) {
                         $scope.audiometricTesting.QuietRoom = false;
                     }
                     else {
                         $scope.audiometricTesting.QuietRoom = true;
                     }

                     if ($scope.audiometricTesting.EncounterStatus == "1002") {
                         $scope.audiometricTesting.ReasonEncounterIncomplete = "";
                     }

                     $scope.audiometricTesting.EncounterDetailID = 0;
                     $scope.audiometricTesting.LaboratorylID = 0;

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/SaveAudiometricDetails",
                         data: { AudiometricDetailsObj: $scope.audiometricTesting }
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

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.audiometricTesting.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;

                     globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;

                     //                     if ($scope.audiometricTesting.ScheduleFollowUp == false) {
                     //                         $scope.emptySchedulefollowupObject();
                     //                     }


                     //                     if ($scope.audiometricTesting.ScheduleFollowUp) {
                     //                         $scope.saveScheduleFollowUpDetails();
                     //                     }
                     utilityservices.notify("saved");
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.frmAudiometricsDetails.$dirty = false;
                 }
             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };

             //************************************************************//
             /*  Start:   -   All Functionalities for Audimetric Results   */
             //************************************************************//


             // Get Audiometric Results manipulation
             $scope.getAudiometricResults = function () {

                 $scope.loadingAction = true;
                 $scope.showLoadingOverlay = true;

                 $scope.audiometricResults.AudiometricTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                 $scope.audiometricResults.LeftEarBodyPartSideID = $scope.BodyPartSideList[0].ID;
                 $scope.audiometricResults.RightEarBodyPartSideID = $scope.BodyPartSideList[1].ID;
                 $scope.audiometricResults.EmployeePK = globalobject.currentEncounter.EmployeePK;
                 //   $scope.getTestTypeList();
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetAudiometricResults",
                     data: { AudiometricResultsObj: $scope.audiometricResults }
                 };
                 sharedservices.xhrService(configs)
                    .success(getResultsDataSuccess)
                    .error(getResultsDataError);
             };

             function getResultsDataSuccess(data, status, headers, config) {
                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.audiometricResults = data.d.Object;
                     globalobject.resultsSaved = true;

                     globalobject.IsSTSVisible = data.d.Object.IsSTSVisible;

                     if (globalobject.currentEncounter.PersonnelTypeID != 1003) {
                         if ($scope.audiometricResults.LeftTestTypeID == 1003) {
                             $scope.leftEarRevised = true;
                         }
                         if ($scope.audiometricResults.RightTestTypeID == 1003) {
                             $scope.rightEarRevised = true;
                         }
                     }

                     if (globalobject.currentEncounter.FromSOAListScreen == false) {
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                     }
                 }

                 else {

                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                 }

             };

             function getResultsDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };

             // Save Audiometric Results manipulation
             $scope.saveAudiometricResults = function () {
                 $scope.audiometricResults.AudiometricTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                 $scope.audiometricResults.LeftEarBodyPartSideID = $scope.BodyPartSideList[0].ID;
                 $scope.audiometricResults.RightEarBodyPartSideID = $scope.BodyPartSideList[1].ID;

                 $scope.audiometricResults.EmployeePK = globalobject.currentEncounter.EmployeePK;
                 $scope.audiometricResults.AppointmentDate = globalobject.currentEncounter.EncounterDetailDate;

                 $scope.audiometricResults.LeftEarFrequency500 = $('#LeftEarFrequency500').val();
                 $scope.audiometricResults.LeftEarFrequency1000 = $('#LeftEarFrequency1000').val();
                 $scope.audiometricResults.LeftEarFrequency2000 = $('#LeftEarFrequency2000').val();
                 $scope.audiometricResults.LeftEarFrequency3000 = $('#LeftEarFrequency3000').val();
                 $scope.audiometricResults.LeftEarFrequency4000 = $('#LeftEarFrequency4000').val();
                 $scope.audiometricResults.LeftEarFrequency6000 = $('#LeftEarFrequency6000').val();
                 $scope.audiometricResults.LeftEarFrequency8000 = $('#LeftEarFrequency8000').val();

                 $scope.audiometricResults.RightEarFrequency500 = $('#RightEarFrequency500').val();
                 $scope.audiometricResults.RightEarFrequency1000 = $('#RightEarFrequency1000').val();
                 $scope.audiometricResults.RightEarFrequency2000 = $('#RightEarFrequency2000').val();
                 $scope.audiometricResults.RightEarFrequency3000 = $('#RightEarFrequency3000').val();
                 $scope.audiometricResults.RightEarFrequency4000 = $('#RightEarFrequency4000').val();
                 $scope.audiometricResults.RightEarFrequency6000 = $('#RightEarFrequency6000').val();
                 $scope.audiometricResults.RightEarFrequency8000 = $('#RightEarFrequency8000').val();

                 $scope.audiometricResults.RightEarFrequency6000 = $('#RightEarFrequency6000').val();
                 $scope.audiometricResults.RightEarFrequency8000 = $('#RightEarFrequency8000').val();
                 var saveResultStatus = true;
                 var resultMsg = 'Please enter numbers only';

                 if ($scope.audiometricResults.LeftEarFrequency2000 == '' ||
                     $scope.audiometricResults.LeftEarFrequency3000 == '' ||
                     $scope.audiometricResults.LeftEarFrequency4000 == '' ||
                     $scope.audiometricResults.RightEarFrequency2000 == '' ||
                     $scope.audiometricResults.RightEarFrequency3000 == '' ||
                     $scope.audiometricResults.RightEarFrequency4000 == '') {

                     saveResultStatus = false;
                     resultMsg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.audiometricResults.LeftTestTypeID == '' || $scope.audiometricResults.LeftTestTypeID == null ||
                     $scope.audiometricResults.RightTestTypeID == '' || $scope.audiometricResults.RightTestTypeID == null) {

                     saveResultStatus = false;
                     resultMsg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if (saveResultStatus) {
                     $scope.showLoadingOverlay = true;
                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/SaveAudiometricResults",
                         data: { AudiometricResultsObj: $scope.audiometricResults }
                     };
                     sharedservices.xhrService(configs)
                        .success(saveResultsDataSuccess)
                        .error(saveResultsDataError);
                 }
                 else {
                     saveResultStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if (resultMsg != "") {
                         toastr.warning(resultMsg);
                     }
                 }
             };

             function saveResultsDataSuccess(data, status, headers, config) {
                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.audiometricResults = data.d.Object;
                     if (globalobject.currentEncounter.PersonnelTypeID != 1003) {
                         if ($scope.audiometricResults.LeftTestTypeID == 1003) {
                             $scope.leftEarRevised = true;
                         }
                         if ($scope.audiometricResults.RightTestTypeID == 1003) {
                             $scope.rightEarRevised = true;
                         }
                     }
                     utilityservices.notify("saved");
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     globalobject.resultsSaved = true;

                     $scope.frmAudiometricsResults.$dirty = false;

                     if (($scope.audiometricResults.LeftTestTypeID == 1002 || $scope.audiometricResults.LeftTestTypeID == 1003) && ($scope.audiometricResults.RightTestTypeID == 1002 || $scope.audiometricResults.RightTestTypeID == 1003)) {

                         globalobject.IsSTSVisible = false;
                     }
                     else
                         globalobject.IsSTSVisible = true;
                 }
             };

             function saveResultsDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };

             $scope.saveNextsteps = function () {
                 $scope.msg = "";
                 $scope.audiometricTesting.EncounterDetailID = 0;
                 $scope.audiometricTesting.LaboratorylID = 0;

                 if ($scope.audiometricTesting.EncounterStatus == 1003 && ($scope.audiometricTesting.ReasonEncounterIncomplete == null || $scope.audiometricTesting.ReasonEncounterIncomplete == '')) {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 else if ($scope.audiometricTesting.ScheduleFollowUp) {

                     $scope.ValidateSF();
                 }

                 if ($scope.msg != "") {
                     toastr.warning($scope.msg);
                 }
                 else {
                     //SaveAudiometricNextsteps
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/SaveAudiometricNextsteps",
                         data: { AudiometricDetailsObj: $scope.audiometricTesting }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveNextStepsSuccess)
                  .error(saveDetailDataError);

                 }

             }

             function saveNextStepsSuccess(data, status, headers, config) {
                 if (data.d.IsOK) {
                     if ($scope.audiometricTesting.ScheduleFollowUp) {
                         $scope.saveScheduleFollowUpDetails();
                     }
                     if ($scope.audiometricTesting.ScheduleFollowUp == false) {
                         utilityservices.notify("saved");
                     }
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     globalobject.resultsSaved = true;

                     $scope.frmAudiometricsNextStep.$dirty = false;
                 }
             };

             //************************************************************//
             /* End:   -   All Functionalities for Audimetric Results */
             //************************************************************//

             $scope.fileUploadAlert = function () {
                 toastr.warning('Please Select .txt format files only');
             };

         } ]);


function $id(id) {
    return document.getElementById(id);
}

//
// output information
// function Output(msg) {
// 	var m = $id("messages");
// 	m.innerHTML = msg + m.innerHTML;
// }

//
// initialize
function Init() {

    var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";

        // remove submit button
        submitbutton.style.display = "none";
    }

}

// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++) {
        ReadFile(f);
    }

}

function ReadFile(file) {
    // display text
    if (file.type.indexOf("text/plain") == 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var result = ParseData(e.target.result);
            $id("LeftEarFrequency500").value = result.left.f500;
            // $id("LeftEarFrequency500").className = 'filled';
            $id("LeftEarFrequency1000").value = result.left.f1k;
            // $id("LeftEarFrequency1000").className = 'filled';
            $id("LeftEarFrequency2000").value = result.left.f2k;
            // $id("LeftEarFrequency2000").className = 'filled';
            $id("LeftEarFrequency3000").value = result.left.f3k;
            //  $id("LeftEarFrequency3000").className = 'filled';
            $id("LeftEarFrequency4000").value = result.left.f4k;
            // $id("LeftEarFrequency4000").className = 'filled';
            $id("LeftEarFrequency6000").value = result.left.f6k;
            // $id("LeftEarFrequency6000").className = 'filled';
            $id("LeftEarFrequency8000").value = result.left.f8k;
            // $id("LeftEarFrequency8000").className = 'filled';
            $id("RightEarFrequency500").value = result.right.f500;
            // $id("RightEarFrequency500").className = 'filled';
            $id("RightEarFrequency1000").value = result.right.f1k;
            // $id("RightEarFrequency1000").className = 'filled';
            $id("RightEarFrequency2000").value = result.right.f2k;
            // $id("RightEarFrequency2000").className = 'filled';
            $id("RightEarFrequency3000").value = result.right.f3k;
            // $id("RightEarFrequency3000").className = 'filled';
            $id("RightEarFrequency4000").value = result.right.f4k;
            //  $id("RightEarFrequency4000").className = 'filled';
            $id("RightEarFrequency6000").value = result.right.f6k;
            //  $id("RightEarFrequency6000").className = 'filled';
            $id("RightEarFrequency8000").value = result.right.f8k;
            //  $id("RightEarFrequency8000").className = 'filled';

            // Output(
            // 	"<p><strong>" + file.name + ":</strong></p><pre>" +
            // 	e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
            // 	"</pre>"
            // );
        }
        reader.readAsText(file);
    }
    else {

        document.getElementById("fileselect").value = ""
        angular.element(document.getElementById('span')).scope().fileUploadAlert();
    }
    // Output(
    // 	"<p>File information: <strong>" + file.name +
    // 	"</strong> type: <strong>" + file.type +
    // 	"</strong> size: <strong>" + file.size +
    // 	"</strong> bytes</p>"
    // );
}

function ParseData(data) {
    var result = {};
    result.patientId = data.substring(3, 17);
    result.testType = data.substring(18, 19);
    result.testId = data.substring(19, 35);
    result.testDate = data.substring(35, 43);
    result.testTime = data.substring(43, 51);
    result.calibrationDate = data.substring(51, 59);
    result.examinerId = data.substring(59, 74);
    var left = data.substring(74, 106).split('/');
    result.left = {};
    result.left.f1kt = left[0];
    result.left.f500 = left[1];
    result.left.f1k = left[2];
    result.left.f2k = left[3];
    result.left.f3k = left[4];
    result.left.f4k = left[5];
    result.left.f6k = left[6];
    result.left.f8k = left[7];
    var right = data.substring(106, 138).split('/');
    result.right = {};
    result.right.f1kt = right[0];
    result.right.f500 = right[1];
    result.right.f1k = right[2];
    result.right.f2k = right[3];
    result.right.f3k = right[4];
    result.right.f4k = right[5];
    result.right.f6k = right[6];
    result.right.f8k = right[7];

    return result;
}
