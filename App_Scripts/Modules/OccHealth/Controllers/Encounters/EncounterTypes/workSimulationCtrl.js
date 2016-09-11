
angular.module("app")
       .controller("workSimulationCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.changeSubView = sharedservices.changeSubView;
            $scope.showSubNavbars = true;
            //Object Initialization 

            // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
            $scope.navBarOptions = {
                detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/WSDetails" : 1010,
                resultsFormId: undefined,
                investigationFormId: undefined
            };

            // TIME
            /* 
            * sharedservices.setTime( hour, minutes) function
            * hour and minute arguments can be integer or string
            */
            // TIME STEPS

            //Work Simulation Object
            $scope.WorkSimulation =
            {
                WorkSimulationTestID: null
			   , AppointmentEncounterTypeID: null
			   , SampleID: null
			   , WorkRelated: null
			   , IncidentID: null
               , MachiningPositionID: null
			   , EEAwarded: null
			   , MoveDate: null
			   , NumberOfVisits: null
			   , ActivityPriorityID: null
			   , MonitoringTypeID: null
			   , DispositionTypeID: null
			   , WorkSimulationTestNote: null
			   , EncounterStatus: null
			   , ReasonEncounterIncomplete: null
			   , DiagnosticMethodID: null
			   , ScheduleFollowUp: null
            };

            var date = new Date();

            //$scope.WorkSimulation.DateOfProcedure = date;

            $scope.BindDefaultDateTime = (function () {
                var date = new Date();

                var timeNow = date.getHours() + ":" + date.getMinutes()
                $scope.Hour = timeNow.substring(0, 2);
                $scope.Minut = timeNow.substr(3, 2);

                $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
                $scope.hourStep = sharedservices.hourStep;
                $scope.minuteStep = sharedservices.minuteStep;
                $scope.WorkSimulation.MoveDate = date;
            })();

            // Function to Get the Details ******************
            $scope.getEncounterDetails = function () {
                globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ?
                                                            parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ?
                                                            parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

                globalobject.employee.EmployeeType = (sharedservices.getURLParameter().EmployeeType != undefined && sharedservices.getURLParameter().EmployeeType != null) ?
                                                            parseInt(sharedservices.getURLParameter().EmployeeType) : parseInt(globalobject.employee.EmployeeType);

                globalobject.employee.ID = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ?
                                                            parseInt(sharedservices.getURLParameter().EmployeePK) : parseInt(globalobject.employee.ID);

                globalobject.employee.LocationId = (sharedservices.getURLParameter().LocationID != undefined && sharedservices.getURLParameter().LocationID != null) ?
                                                            parseInt(sharedservices.getURLParameter().LocationID) : parseInt(globalobject.employee.LocationId);


                var configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                    data: { EncounterDetailID: parseInt(globalobject.currentEncounter.EncounterDetailID), AppointmentEncounterTypeID: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID) }
                };
                sharedservices.xhrService(configs)
                .then(function (response) {
                    globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                    globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                    globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                    globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                    globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);

                    $scope.getIncidentList();
                    $scope.getWSDetails();
                });

            };


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
            //$scope.AppointmentDate = globalobject.currentEncounter.EncounterDetailDate;

            $scope.RefferedForList = globalobject.DiagnosticMethodList;
            $scope.MachiningPositionList = globalobject.MachiningPositionList;
            $scope.ActivityPriorityList = globalobject.ActivityPriorityList;
            $scope.MonitoringTypeWorkSimulationList = globalobject.MonitoringTypeWorkSimulationList;
            $scope.DispositionTypeList = globalobject.DispositionTypeList;

            $scope.getWSDetails = function () {

                $scope.WorkSimulation.WorkSimulationTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                $scope.WorkSimulation.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/WorkSimulationService.asmx/SelectWorkSimulationDetails",
                    data: { WSID: $scope.WorkSimulation.WorkSimulationTestID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       $scope.WorkSimulation = data.d.Object;
                       $scope.WorkSimulation.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                       $scope.myDate = data.d.Object.MoveDate;

                       if ($scope.WorkSimulation.ScheduleFollowUp) {
                           $scope.getScheduleFollowUpDetails();
                       }
                   }

               })
            };

            $scope.resetSchedulefollwupdetails = function () {
                $scope.WorkSimulation.ScheduleFollowUp = false;
            }

            $scope.saveWSDetails = function () {
                $scope.saveStatus = true;
                $scope.msg = '';
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;

                $scope.WorkSimulation.MoveDate = new Date($scope.myDate).toDateString();

                //                if (!((moment($scope.WorkSimulation.MoveDate)).isAfter(moment()))) {
                if ((new Date($scope.WorkSimulation.MoveDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
                    $scope.saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    $scope.msg = $filter('translate')('msgMoveDateValidation');

                }

                if (
                        $scope.WorkSimulation.WorkRelated === '' || $scope.WorkSimulation.WorkRelated === null
                        || ($scope.WorkSimulation.WorkRelated === true && ($scope.WorkSimulation.IncidentID == '' || $scope.WorkSimulation.IncidentID == null))
                        || $scope.WorkSimulation.MachiningPositionID == ''
                        || $scope.WorkSimulation.MachiningPositionID == null
                        || $scope.WorkSimulation.EEAwarded === '' || $scope.WorkSimulation.EEAwarded === null
                        || $scope.WorkSimulation.MoveDate == '' || $scope.WorkSimulation.MoveDate == null
                        || $scope.WorkSimulation.NumberOfVisits == '' || $scope.WorkSimulation.NumberOfVisits == null
                        || $scope.WorkSimulation.ActivityPriorityID == '' || $scope.WorkSimulation.ActivityPriorityID == null
                        || $scope.WorkSimulation.MonitoringTypeID == '' || $scope.WorkSimulation.MonitoringTypeID == null
                        || $scope.WorkSimulation.EncounterStatus == '' || $scope.WorkSimulation.EncounterStatus == null
                        || ($scope.WorkSimulation.EncounterStatus == 1003 && ($scope.WorkSimulation.ReasonEncounterIncomplete == '' || $scope.WorkSimulation.ReasonEncounterIncomplete == null))

                //Ends Here
                 ) {
                    $scope.saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if ($scope.WorkSimulation.ScheduleFollowUp == true) {
                    $scope.ValidateSF();
                }

                if (!($scope.WorkSimulation.WorkRelated))
                    $scope.WorkSimulation.IncidentID = null;

                if ($scope.WorkSimulation.EncounterStatus == 1002)
                    $scope.WorkSimulation.ReasonEncounterIncomplete = '';

                if ($scope.saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/WorkSimulationService.asmx/SaveWorkSimulationDetails",
                        data: { WSDetailsObj: $scope.WorkSimulation }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }

                else
                    if ($scope.msg != '') {
                        toastr.warning($scope.msg);
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
            };

            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.WorkSimulationTestID;
                    $scope.WorkSimulation.WorkSimulationTestID = data.d.Object.WorkSimulationTestID;

                    if ($scope.WorkSimulation.ScheduleFollowUp == false) {
                        $scope.emptySchedulefollowupObject();
                    }

                    if ($scope.WorkSimulation.ScheduleFollowUp == true) {
                        $scope.saveScheduleFollowUpDetails();
                    }
                    $scope.frmWorkSimulation.$dirty = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    if ($scope.WorkSimulation.ScheduleFollowUp == false) {
                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                    }

                }

            };
            function saveDataError(data, status, headers, config) {
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
                toastr.warning($filter('translate')('msgSeriveerror'));
            };

            $scope.cancelWS = function () {

                if ($scope.frmWorkSimulation.$dirty) {

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

            $scope.checkNum = function (itemID) {

                if (itemID != '') {
                    var stringText = $('#' + itemID).val();
                    var value_1 = Number(stringText);
                    if ((isNaN(value_1)) || value_1 < 0 || stringText.indexOf('.') !== -1) {
                        toastr.warning("Please Enter a valid number");
                        $('#' + itemID).val('');
                        $('#' + itemID).focus();

                        return false;
                    }
                }
            }

        } ]);


