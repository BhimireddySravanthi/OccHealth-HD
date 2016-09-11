angular.module("app")
       .controller("titersCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {


            var strTiterTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
            var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
            var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //Object for Titer
            $scope.Titer = {
                TiterTestID: strTiterTestID
                , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
                , SampleID: null
                , WorkRelated: null
                , IncidentID: null
                , TiterResult: null
                , EncounterStatus: null
                , ReasonEncounterIncomplete: null
                , DiagnosticMethodID: null
                , ScheduleFollowUp: null
                , UserID: null
                , LocationID: null
            };

            $scope.navBarOptions = {
                detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/TitersDetails" : 1008,
                resultsFormId: undefined,
                investigationFormId: undefined
            };

            //////////////////////////////////////////////////////////////////////////////////////////////////
            $scope.BindDefaultDateTime = (function () {
                var date = new Date();
                var timeNow = date.getHours() + ":" + date.getMinutes()
                $scope.Hour = timeNow.substring(0, 2);
                $scope.Minut = timeNow.substr(3, 2);

                $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
                $scope.hourStep = sharedservices.hourStep;
                $scope.minuteStep = sharedservices.minuteStep;
            })();

            $scope.FieldDisabled = false;

            $scope.getDropDownObject = function (dropdownName, dropdownObjList, requiredValue, requiredObject) {  // Generic function To set the Drop down Model on drop downs init/change and set corresponding action item property to save

                var dropdownObject = null;
                var selectedValue = angular.isString(requiredValue) ? requiredValue.replace(/^\s*/, '').replace(/\s*$/, '') : requiredValue;
                if ((dropdownObjList != undefined) && (dropdownObjList.length != 0)) {
                    var dropdownObject = dropdownObjList[0];
                    if (requiredValue != "" || selectedValue != 0) {
                        angular.forEach(dropdownObjList, function (object, index) {
                            if (selectedValue == object.ID)
                                dropdownObject = object;
                        });

                    }

                    if (requiredObject == 'scheduleFollowUp') {
                        $scope.scheduleFollowUp[dropdownName] = dropdownObject.ID;
                    }

                    else
                        $scope.Titer[dropdownName] = dropdownObject.ID;

                }


                return dropdownObject;
            };

            $scope.getEncounterDetails = function () {
                globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);

                globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

                globalobject.employee.EmployeeType = (sharedservices.getURLParameter().EmployeeType != undefined && sharedservices.getURLParameter().EmployeeType != null) ? parseInt(sharedservices.getURLParameter().EmployeeType) : parseInt(globalobject.employee.EmployeeType);

                globalobject.employee.ID = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ? parseInt(sharedservices.getURLParameter().EmployeePK) : parseInt(globalobject.employee.ID);

                globalobject.employee.LocationId = (sharedservices.getURLParameter().LocationID != undefined && sharedservices.getURLParameter().LocationID != null) ? parseInt(sharedservices.getURLParameter().LocationID) : parseInt(globalobject.employee.LocationId);


                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/TiterService.asmx/SelectTiterDetails",
                    data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
                };
                sharedservices.xhrService(configs)
                    .then(function (response) {
                        globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                        globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                        globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strTiterTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;

                        $scope.getIncidentList();
                        $scope.getTitersDetails();
                    });

            };
            //  $scope.getEncounterDetails();

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
            

            $scope.RefferedForList = globalobject.DiagnosticMethodList;

            $scope.getTitersDetails = function () {

                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/TiterService.asmx/SelectTiterDetails",
                    data: { TiterTestID: strTiterTestID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {
                       $scope.Titer = data.d.Object;
                       $scope.Titer.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                       if ($scope.Titer.ScheduleFollowUp) {

                           $scope.getScheduleFollowUpDetails();
                           $scope.FieldDisabled = true;
                       }
                   }
               })

            }

            $scope.resetSchedulefollwupdetails = function () {
                $scope.Titer.ScheduleFollowUp = false;
            }
            $scope.saveTitersDetails = function () {
                $scope.saveStatus = true;
                $scope.msg = '';
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;


                if (
                        $scope.Titer.WorkRelated === ''
                        || $scope.Titer.WorkRelated === null
                        || $scope.Titer.TiterResult === ''
                        || $scope.Titer.TiterResult === null
                        || $scope.Titer.EncounterStatus == ''
                        || $scope.Titer.EncounterStatus == null
                        || ($scope.Titer.EncounterStatus == 1003 && ($scope.Titer.ReasonEncounterIncomplete == '' || $scope.Titer.ReasonEncounterIncomplete == null))
                //Ends Here
                    ) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                }

                if ($scope.Titer.ScheduleFollowUp) {

                    $scope.ValidateSF();
                }

                if (!($scope.Titer.WorkRelated))
                    $scope.Titer.IncidentID = null;

                if ($scope.Titer.EncounterStatus == 1002)
                    $scope.Titer.ReasonEncounterIncomplete = '';

                if ($scope.saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/TiterService.asmx/SaveTiterDetails",
                        data: { Titerobj: $scope.Titer }
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

                    globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.TiterTestID;
                    $scope.Titer.TiterTestID = data.d.Object.TiterTestID;

                    if ($scope.Titer.ScheduleFollowUp == false) {

                        $scope.emptySchedulefollowupObject();
                    }

                    if ($scope.Titer.ScheduleFollowUp && $scope.scheduleFollowUp.EncounterTypeScheduleFollowUpID == 0) {

                        $scope.saveScheduleFollowUpDetails();
                        $scope.FieldDisabled = true;
                    }

                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    $scope.frmTiters.$dirty = false;
                    toastr.success($filter('translate')('msgSavedSuccessfully'));

                    //**************************** Save schedule follow up record Ends**********************************************//
                }

            };
            function saveDataError(data, status, headers, config) {
                $scope.showLoadingOverlay = false;
                toastr.warning($filter('translate')('msgSeriveerror'));
            };

            $scope.cancelTiter = function () {

                if ($scope.frmTiters.$dirty) {

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

        } ]);

