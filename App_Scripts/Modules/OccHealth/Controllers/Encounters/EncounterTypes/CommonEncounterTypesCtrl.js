
angular.module("app")
        .controller("CommonEncounterTypesCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {
             $scope.changeSubView = sharedservices.changeSubView;
             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/CommonEncounterTypes" : 1013,
                 resultsFormId: undefined,
                 investigationFormId: undefined
             };
             $scope.showField = false;
             var strGlobalCommonEncounterTypesID = globalobject.currentEncounter.ExposureEncounterSummaryID;
             var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
             var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;


             $scope.DispositionTypeList = globalobject.DispositionTypeList;
             $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
             $scope.EncounterTypeList = globalobject.EncounterTypeList;
             $scope.IsDisable = false;
             $scope.myDate = new Date();

             $scope.hourStep = sharedservices.hourStep;
             $scope.minuteStep = sharedservices.minuteStep;

             $scope.DrawTimet = new Date();
             $scope.FieldDisabled = false;
             $scope.loadingAction = false;

             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.CommonEncounterTypes = {
                 CommonEncounterTypesID: strGlobalCommonEncounterTypesID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , SampleID: ""
            , EncounterReason: ""
            , WorkRelated: null
            , IncidentID: null
            , DispositionTypeID: null
            , TestNotes: ""
            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: null
            , ScheduleFollowUp: false
            , CreatedBy: 0
             };


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
                        strGlobalCommonEncounterTypesID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.EncounterTypeList = globalobject.EncounterTypeList;
                        if (strGlobalCommonEncounterTypesID > 0) {
                            $scope.getCommonEncounterTypesDetails();
                        }

                    });

             };
             $scope.getEncounterDetails();

             $scope.getIncidentList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                     data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.incidentList = data.d.Object;
                              setTimeout(function () { $('#ddlIncidentList').val($scope.CommonEncounterTypes.IncidentID); }, 500);
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }
             $scope.getIncidentList();


             if (globalobject.currentEncounter.EncounterTypeID == "1017") {
                 $scope.showField = true;
             }

             for (var i = 0; i < $scope.EncounterTypeList.length; i++) {
                 if ($scope.EncounterTypeList[i].ID == globalobject.currentEncounter.EncounterTypeID) {
                     $scope.divName = $scope.EncounterTypeList[i].Text;
                 }
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////


             $scope.cancel = function () {

                 if ($scope.frmcommonET.$dirty) {

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

             ////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.getCommonEncounterTypesDetails = function () {
                 var configs = {};
                 sharedservices.parseDates(globalobject.currentEncounter);
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/CommonEncounterTypesService.asmx/getCommonEncounterTypeDetails",
                     data: { EncounterDetailID: strGlobalEncounterDetailID, CommonEncounterTypesID: strGlobalCommonEncounterTypesID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };



             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {


                     sharedservices.parseDates(data.d.Object);
                     $scope.CommonEncounterTypes = data.d.Object;

                     if ($scope.CommonEncounterTypes.ScheduleFollowUp && strGlobalCommonEncounterTypesID != 0) {

                         $scope.getScheduleFollowUpDetails();
                     }
                 }

             };

             function getDetailDataError(data, status, headers, config) {

             };

             $scope.resetSchedulefollwupdetails = function () {
                 $scope.CommonEncounterTypes.ScheduleFollowUp = false;
             }

             ////////////////////////////////////////////////////////////////////////////////////////////////////



             ////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.save = function () {

                 $scope.msg = '';
                 $scope.saveStatus = true;
                 $scope.showLoadingOverlay = true;
                 $scope.CommonEncounterTypes.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;

                 if ($scope.CommonEncounterTypes.EncounterStatus == 1002) {
                     $scope.CommonEncounterTypes.ReasonEncounterIncomplete = null;
                 }

                 if ($scope.CommonEncounterTypes.WorkRelated == false) {
                     $scope.CommonEncounterTypes.IncidentID = null;
                 }

                 if ($scope.CommonEncounterTypes.WorkRelated == null
                   || ($scope.CommonEncounterTypes.EncounterStatus == null || $scope.CommonEncounterTypes.EncounterStatus == '')
                   || ($scope.CommonEncounterTypes.EncounterStatus == 1003 && ($scope.CommonEncounterTypes.ReasonEncounterIncomplete == null || $scope.CommonEncounterTypes.ReasonEncounterIncomplete == ""))) {

                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                 }


                 if (($scope.CommonEncounterTypes.ScheduleFollowUp == true && $scope.scheduleFollowUp.AppointmentDate != '' && $scope.scheduleFollowUp.AppointmentDate != null) && (new Date($scope.scheduleFollowUp.AppointmentDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0))) {

                     $scope.saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.msg = $filter('translate')('msgappointmentdateshouldbegreaterthancurrentdate');
                 }

                 if ($scope.CommonEncounterTypes.ScheduleFollowUp == true) {
                     $scope.ValidateSF();
                 }


                 if ($scope.saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/CommonEncounterTypesService.asmx/SaveCommonEncounterTypeDetails",
                         data: { CommonEncounterTypeObj: $scope.CommonEncounterTypes }
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
                         $scope.loadingAction = false;
                         $scope.showLoadingOverlay = false;
                     }
                 }

             };


             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.CommonEncounterTypes.CommonEncounterTypesID = data.d.Object.CommonEncounterTypesID;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.CommonEncounterTypesID;
                     globalobject.currentEncounter.SelectedEncounterTypeID = globalobject.currentEncounter.EncounterTypeID;

                     $scope.frmcommonET.$dirty = false;

                     if ($scope.CommonEncounterTypes.ScheduleFollowUp == false) {
                         $scope.emptySchedulefollowupObject
                     }

                     if ($scope.CommonEncounterTypes.ScheduleFollowUp && $scope.scheduleFollowUp.EncounterTypeScheduleFollowUpID == 0) {
                         $scope.saveScheduleFollowUpDetails();
                     }

                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if ($scope.CommonEncounterTypes.ScheduleFollowUp == false) {
                         toastr.success($filter('translate')('msgSavedSuccessfully'));
                     }


                 }
             };

             function saveDetailDataError(data, status, headers, config) {

                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };

             ////////////////////////////////////////////////////////////////////////////////////////////////////
             //             $scope.getScheduleFollowUpDetails = function () {

             //                 var configs = {
             //                     url: "/WebServices/OccupationalHealth/ScheduleFollowUpService.asmx/GetScheduleFollowUpDetails",
             //                     data: { ExposureEncounterSummaryID: globalobject.currentEncounter.ExposureEncounterSummaryID, EncounterDetailID: globalobject.currentEncounter.SelectedEncounterTypeID }
             //                 };
             //                 sharedservices.xhrService(configs)
             //                      .success(function (data, status, headers, config) {

             //                          $scope.scheduleFollowUp.AppointmentScheduledByTitle = globalobject.currentSession.username;
             //                          if (data.d.IsOK) {
             //                              sharedservices.parseDates(data.d.Object);
             //                              $scope.scheduleFollowUp = data.d.Object;
             //                              $scope.scheduleFollowUp.AppointmentScheduledByTitle = globalobject.currentSession.username;
             //                              if ($scope.scheduleFollowUp.AppointmentTime != null && $scope.scheduleFollowUp.AppointmentTime != undefined) {
             //                                  var d = new Date();
             //                                  d.setHours($scope.scheduleFollowUp.AppointmentTime.substr(0, 2));
             //                                  d.setMinutes($scope.scheduleFollowUp.AppointmentTime.substr(3, 2));
             //                                  $scope.DrawTimet = d;
             //                                  setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 500);
             //                                  setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 500);
             //                                  setTimeout(function () { $('#ddlFollowType').val($scope.scheduleFollowUp.FollowUpTypeID); }, 500);
             //                              }
             //                          }

             //                      })
             //                      .error(function (data, status, headers, config) {

             //                      });
             //             }

             //             ////////////////////////////////////////////////////////////////////////////////////////////////////
             //             $scope.saveScheduleFollowUpDetails = function () {
             //                 $scope.scheduleFollowUp.EncounterTypeReference = $scope.CommonEncounterTypes.CommonEncounterTypesID;
             //                 var configs = {
             //                     url: "/WebServices/OccupationalHealth/ScheduleFollowUpService.asmx/SaveScheduleFollowUpDetails",
             //                     data: { ScheduleFollowUpObj: $scope.scheduleFollowUp }
             //                 };
             //                 //$scope.scheduleFollowUp.AppointmentTime = $scope.hour + ":" + $scope.minute; // $('#hdnTime').val();
             //                 $scope.scheduleFollowUp.AppointmentTime = $('#hdnTime').val();
             //                 $scope.scheduleFollowUp.EncounterTypeReference = globalobject.currentEncounter.ExposureEncounterSummaryID;
             //                 $scope.scheduleFollowUp.EncounterTypeID = globalobject.currentEncounter.EncounterTypeID;
             //                 $scope.scheduleFollowUp.AppointmentScheduledBy = globalobject.currentSession.userid;
             //                 // $scope.scheduleFollowUp.FollowUpTypeID = globalobject.TestTypeList[0].ID;

             //                 if ((moment($scope.scheduleFollowUp.AppointmentDate)).isBefore(moment())) {
             //                     if (moment($scope.scheduleFollowUp.AppointmentDate).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY")) {
             //                         saveStatus = false;
             //                         msg = $filter('translate')('msgExpectedDateShouldNotBeLessThanCurrentDate');
             //                     }
             //                 }

             //                 if ($scope.scheduleFollowUp.ReasonForFollowUp == null
             //             || $scope.scheduleFollowUp.ReasonForFollowUp == ''
             //             || $scope.scheduleFollowUp.AppointmentDate == null
             //             || $scope.scheduleFollowUp.AppointmentDate == ''
             //             || $scope.scheduleFollowUp.AppointmentTime == null
             //             || $scope.scheduleFollowUp.AppointmentTime == ''
             //             || $scope.scheduleFollowUp.HealthCareProviderID == ''
             //             || $scope.scheduleFollowUp.HealthCareProviderID == null
             //             ) {
             //                     saveStatus = false;
             //                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
             //                 }


             //                 if (saveStatus) {
             //                     sharedservices.xhrService(configs)
             //                      .success(function (data, status, headers, config) {
             //                          if (data.d.IsOK) {

             //                          }

             //                      })
             //                      .error(function (data, status, headers, config) {

             //                      });
             //                 }

             //             }







         } ]);



       
