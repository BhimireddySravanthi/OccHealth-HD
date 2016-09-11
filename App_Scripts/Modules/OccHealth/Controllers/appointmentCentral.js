angular.module("app")

.controller("ohAppointmentCentral", ["$scope",
        "$filter",
        "$location",
        "$modal",
        "$log",
        "sharedservices",
        "utilityservices",
        "toastr",
        "$http",
        "globalobject",
        function ($scope, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {

            globalobject.currentPage = "Appointment Central";

            globalobject.employeesSelectedList = [];

            globalobject.employee = {};

            globalobject.RedirectFrom = '';

            globalobject.currentEncounter.PersonnelTypeID = 0;

            globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;

            globalobject.RedirectFrom = '';
            globalobject.initalreDirection = "";
            //pagination  
            $scope.appointmentListSettings = {
                currentPage: 1,
                pageSize: 10
            };
            $scope.encounterListSettings = {
                currentPage: 1,
                pageSize: 10
            };
            $scope.DuplicateExists = "";
            $scope.allowDuplicate = false;
            globalobject.DuplicateAppointmentfromScreen = "AppCentral";

            $scope.appointments = [];
            $scope.searchappointment = {};
            $scope.encounters = [];
            $scope.searchencounter = {};
            var configs;
            // ENABLE MODAL ANIMATION
            $scope.animationsEnabled = true;
            $scope.showLoadingOverlay = false;


            //****************************SCOPE VAVIABLE USED IN CURRENT CONTROLLER START************************************************//
            $scope.filterData = {
                AppointmentStatusList: [],
                EncounterTypeList: [],
                HealthCareEntityList: [],
                PersonnelTypeList: [],
                VisitReasonList: [],
                HealthcareProviderList: [],
                UserList: [],

                AppointmentStatusIDs: null,
                EncounterTypeIDs: null,
                HealthCareEntityIDs: null,
                PersonnelTypeIDs: null,
                VisitReasonIDs: null,
                HealthCareProviderIDs: null,
                FromDate: new Date(),
                ToDate: new Date(),
                AppointmentScheduleByIDs: null,
                EmployeeIDs: null,
                EmployeeStatus: []
            };
            $scope.appointmentSearch = {
                PersonnelTypeIDs: null
                   , AppointmentStatusIDs: null
                   , VisitReasonIDs: null
                   , EncounterTypeIDs: null
                   , HealthCareEntityIDs: null
                   , HealthCareProviderIDs: null
                   , AppointmentScheduleByIDs: null
            };

            //Date filter
            $scope.resetDates = function () {

                $scope.startDate = new Date();
                $scope.endDate = $scope.startDate;
                $scope.filterStartDate = $scope.startDate;
                $scope.filterEndDate = $scope.startDate;
                $scope.innerFilterStartDate = $scope.startDate;
                $scope.innerFilterEndDate = $scope.startDate;
                $scope.innerFilterStartDateDisplay = $scope.startDate;
                $scope.innerFilterEndDateDisplay = $scope.startDate;

            };
            $scope.resetDates();

            //****************************SCOPE VAVIABLE USED IN CURRENT CONTROLLER END************************************************//

            $scope.getfilteredappointments = function () {
                var start, end, cp, pgs;
                cp = $scope.appointmentListSettings.currentPage;
                pgs = $scope.appointmentListSettings.pageSize;
                start = ((cp - 1) * pgs);
                end = ((cp - 1) * pgs) + pgs

                var filteredArr = $filter('filter')($scope.appointments, $scope.searchappointment);
                return filteredArr != null ? filteredArr.slice(start, end) : [];
            };
            $scope.getfilteredencounters = function () {
                var start, end, cp, pgs;
                cp = $scope.encounterListSettings.currentPage;
                pgs = $scope.encounterListSettings.pageSize;
                start = ((cp - 1) * pgs);
                end = ((cp - 1) * pgs) + pgs
                var filteredArr = $filter('filter')($scope.encounters, $scope.searchencounter);
                return filteredArr != null ? filteredArr.slice(start, end) : [];
            };
            //get session filter
            $scope.IsApplyedFilter = false;
            $scope.getSetAppointmentFilterSession = function (SetGet) {
                $scope.appointmentSessionSearch = {};
                $scope.appointmentSessionSearch.AppointmentStatusIDs = $scope.appointmentSearch.AppointmentStatusIDs;
                $scope.appointmentSessionSearch.PersonnelTypeIDs = $scope.appointmentSearch.PersonnelTypeIDs;
                $scope.appointmentSessionSearch.EncounterTypeIDs = $scope.appointmentSearch.EncounterTypeIDs;
                $scope.appointmentSessionSearch.VisitReasonIDs = $scope.appointmentSearch.VisitReasonIDs;
                $scope.appointmentSessionSearch.HealthCareEntityIDs = $scope.appointmentSearch.HealthCareEntityIDs;
                $scope.appointmentSessionSearch.HealthCareProviderIDs = $scope.appointmentSearch.HealthCareProviderIDs;
                $scope.appointmentSessionSearch.AppointmentScheduleByIDs = (($scope.filterData.AppointmentScheduleByIDs == '' || $scope.filterData.AppointmentScheduleByIDs == null) ? null : $scope.filterData.AppointmentScheduleByIDs.toString());
                $scope.appointmentSessionSearch.fromDate = $scope.filterData.FromDate;
                $scope.appointmentSessionSearch.toDate = $scope.filterData.ToDate;
                $scope.IsApplyedFilter = false;
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/GetSetAppointmentFilterSession",
                    data: { appointmentFilterObj: $scope.appointmentSessionSearch, SetReset: SetGet }
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        if (data.d.Object != null) {
                            $scope.IsApplyedFilter = true;
                            sharedservices.parseDates(data.d.Object);
                            $scope.appointmentSearch.AppointmentStatusIDs = data.d.Object.AppointmentStatusIDs;
                            $scope.appointmentSearch.PersonnelTypeIDs = data.d.Object.PersonnelTypeIDs;
                            $scope.appointmentSearch.EncounterTypeIDs = data.d.Object.EncounterTypeIDs;
                            $scope.appointmentSearch.VisitReasonIDs = data.d.Object.VisitReasonIDs;
                            $scope.appointmentSearch.HealthCareEntityIDs = data.d.Object.HealthCareEntityIDs;
                            $scope.appointmentSearch.HealthCareProviderIDs = data.d.Object.HealthCareProviderIDs;
                            $scope.filterData.AppointmentScheduleByIDs = data.d.Object.appointmentScheduleByIDs;
                            $scope.filterData.FromDate = data.d.Object.fromDate;
                            $scope.filterData.ToDate = data.d.Object.toDate;

                            $scope.filterData.AppointmentStatusIDs = _.map((data.d.Object.AppointmentStatusIDs != null ? data.d.Object.AppointmentStatusIDs.split(',') : null), Number);
                            $scope.filterData.PersonnelTypeIDs = _.map((data.d.Object.PersonnelTypeIDs != null ? data.d.Object.PersonnelTypeIDs.split(',') : null), Number);
                            $scope.filterData.EncounterTypeIDs = _.map((data.d.Object.EncounterTypeIDs != null ? data.d.Object.EncounterTypeIDs.split(',') : null), Number);
                            $scope.filterData.VisitReasonIDs = _.map((data.d.Object.VisitReasonIDs != null ? data.d.Object.VisitReasonIDs.split(',') : null), Number);
                            $scope.filterData.HealthCareEntityIDs = _.map((data.d.Object.HealthCareEntityIDs != null ? data.d.Object.HealthCareEntityIDs.split(',') : null), Number);
                            $scope.filterData.HealthCareProviderIDs = _.map((data.d.Object.HealthCareProviderIDs != null ? data.d.Object.HealthCareProviderIDs.split(',') : null), Number);
                            $scope.filterData.AppointmentScheduleByIDs = _.map((data.d.Object.appointmentScheduleByIDs != null ? data.d.Object.appointmentScheduleByIDs.split(',') : null), Number);

                            $scope.filterStartDate = data.d.Object.fromDate;
                            $scope.filterEndDate = data.d.Object.toDate;

                            $scope.innerFilterStartDate = data.d.Object.fromDate;
                            $scope.innerFilterEndDate = data.d.Object.toDate;
                            $scope.innerFilterStartDateDisplay = data.d.Object.fromDate;
                            $scope.innerFilterEndDateDisplay = data.d.Object.toDate;
                            $scope.startDate = data.d.Object.fromDate;
                            $scope.endDate = data.d.Object.toDate;

                            if (($scope.filterData.AppointmentStatusIDs == null || $scope.filterData.AppointmentStatusIDs == '') &&
                                ($scope.filterData.PersonnelTypeIDs == null || $scope.filterData.PersonnelTypeIDs == '') &&
                                ($scope.filterData.EncounterTypeIDs == null || $scope.filterData.EncounterTypeIDs == '') &&
                                ($scope.filterData.VisitReasonIDs == null || $scope.filterData.VisitReasonIDs == '') &&
                                ($scope.filterData.HealthCareEntityIDs == null || $scope.filterData.HealthCareEntityIDs == '') &&
                                ($scope.filterData.HealthCareProviderIDs == null || $scope.filterData.HealthCareProviderIDs == '') &&
                                ($scope.filterData.AppointmentScheduleByIDs == null || $scope.filterData.AppointmentScheduleByIDs == '')) {
                                $('#appointmentCentralFilterWrapper').slideUp(350);
                                $('#filterSummary').slideUp(350);
                                $('html, body').animate({
                                    scrollTop: 0
                                }, 800);
                                $scope.IsApplyedFilter = false;

                            }
                            else {
                                $('#filterSummary').slideDown(350);

                            }

                        }
                        setTimeout(function () {
                            $scope.getAppointments();
                            $scope.getEncounters();
                        }, 2000);

                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
            }


            //get appointments
            $scope.AppointmentLoading = false;
            $scope.EncounterLoading = false;

            $scope.getAppointments = function () {
                $scope.showLoadingOverlay = true;
                $scope.AppointmentLoading = true;
                var AppointmentScheduleByIDs = $scope.filterData.AppointmentScheduleByIDs != null ? $scope.filterData.AppointmentScheduleByIDs.toString() : null;
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAppointmentList",
                    data: { appointmentObj: $scope.appointmentSearch, fromDate: new Date($scope.filterData.FromDate).toDateString(), toDate: new Date($scope.filterData.ToDate).toDateString(), appointmentScheduleByIDs: AppointmentScheduleByIDs, employeeIDs: $scope.filterData.EmployeeIDs, pageIndex: 1, pageSize: 10, SupervisorPermission: globalobject.SupervisorPermission }
                };

                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.appointments = data.d.Object == null ? [] : data.d.Object;
                        $scope.AppointmentLoading = false;
                        if ($scope.IsAppEncLoaded()) {
                            $scope.showLoadingOverlay = false;
                        }
                    }
                    else {
                        $scope.appointments = [];
                        $scope.AppointmentLoading = false;
                        if ($scope.IsAppEncLoaded()) {
                            $scope.showLoadingOverlay = false;
                        }

                    }
                })
                .error(function () {
                    $scope.AppointmentLoading = false;
                    if ($scope.IsAppEncLoaded()) {
                        $scope.showLoadingOverlay = false;
                    }
                    utilityservices.notify("error");
                })
            }
            // get encounters

            $scope.getEncounters = function () {
                $scope.showLoadingOverlay = true;
                $scope.EncounterLoading = true;

                var AppointmentScheduleByIDs = $scope.filterData.AppointmentScheduleByIDs != null ? $scope.filterData.AppointmentScheduleByIDs.toString() : null;
                configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectEncounterswithFilters",
                    data: { Encounterobj: $scope.appointmentSearch, EncounterFromDate: new Date($scope.filterData.FromDate).toDateString(), EncounterToDate: new Date($scope.filterData.ToDate).toDateString(), appointmentScheduleByIDs: AppointmentScheduleByIDs, employeeIDs: $scope.filterData.EmployeeIDs, PageIndex: 1, PageSize: 10, SupervisorPermission: globalobject.SupervisorPermission }
                };
                sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            if (data.d.IsOK) {
                                sharedservices.parseDates(data.d.Object);
                                $scope.encounters = data.d.Object == null ? [] : data.d.Object;
                                $scope.EncounterLoading = false;
                                if ($scope.IsAppEncLoaded()) {
                                    $scope.showLoadingOverlay = false;
                                }

                            }
                            else {
                                $scope.encounters = [];
                                $scope.EncounterLoading = false;
                                if ($scope.IsAppEncLoaded()) {
                                    $scope.showLoadingOverlay = false;
                                }

                            }
                        })
                        .error(function () {
                            $scope.EncounterLoading = false;
                            if ($scope.IsAppEncLoaded()) {
                                $scope.showLoadingOverlay = false;
                            }

                            utilityservices.notify("error");
                        })


            }
            $scope.IsAppEncLoaded = function () {
                if (!$scope.AppointmentLoading && !$scope.EncounterLoading) {
                    return true;
                }
                else {
                    return false;
                }
            };
            //User List
            $scope.getUserList = function () {
                configs = {
                    url: "/WebServices/Foundation/UserService.asmx/GetUserNamesList"
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        globalobject.UserList = data.d.Object;
                        $scope.filterData.UserList = data.d.Object;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
            }

            $scope.initiateFilters = function () {
                $scope.getUserList();
                configs = {
                    url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetLookUpLists",
                    data: { IsMobile: false }
                };

                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.filterData.AppointmentStatusList = data.d.Object.AppointmentStatusList;
                        $scope.filterData.EncounterTypeList = data.d.Object.EncounterTypeList;
                        $scope.filterData.HealthCareEntityList = data.d.Object.HealthCareEntityList;
                        $scope.filterData.PersonnelTypeList = data.d.Object.PersonnelTypeList;
                        $scope.filterData.VisitReasonList = data.d.Object.VisitReasonList;
                        $scope.filterData.HealthcareProviderList = data.d.Object.HealthcareProviderList;
                        $scope.getSetAppointmentFilterSession("");
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })

            }
            //GET EMPLOYEE LIST

            //            setTimeout(function () {
            //                $scope.getAppointments();
            //                $scope.getEncounters();
            //            }, 3000);


            //MEDICAL PROFILE CHANGES
            $scope.findEmployeeList = [];
            $scope.PersonnelTypeID = 0;
            function loadEmployeeList() {
                // Show loader
                $scope.employeeLoader = true;

                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                    data: { personnelTypeId: $scope.PersonnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: $scope.filterData.EmployeeStatus.toString() }
                };
                sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.findEmployeeList = data.d.Object;
            }).error(function () {
                utilityservices.notify("error");
            })
            }
            // loadEmployeeList();

            //Employee Status List start
            $scope.findEmployeeStatusList = [];
            function loadEmployeeStatusList() {
                // Show loader
                $scope.employeeLoader = true;

                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeStatusList"
                };
                sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.findEmployeeStatusList = data.d.Object;
                $scope.filterData.EmployeeStatus.push('Active');
                loadEmployeeList();
            }).error(function () {
                utilityservices.notify("error");
            })
            }
            loadEmployeeStatusList();


            $scope.$watch('filterData.EmployeeStatus', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    loadEmployeeList();
                }
            });
            /////Employee Status List End

            // EMPLOYEE SEARCH LIST
            $scope.findEmployeeList = [];
            $scope.goToEmployeeProfile = function (employee) {
                globalobject.employee = employee;
                globalobject.currentEncounter.EmployeePK = employee.ID;
                globalobject.currentEncounter.screenType = "appointment";
                globalobject.selectEmployeeStatus.EmployeeStatus = $scope.filterData.EmployeeStatus;
                $location.path("/employeemedicalprofile");

            }

            //END CHANGES
            // HEADER DROPDOWN MENU ITEMS .This Menu items used in Future releases
            //            $scope.menuItems = [
            //            {
            //                'label': 'lblAppointmentCentral',
            //                'link': '#appointmentcentral'
            //            },
            //            {
            //                'label': 'lblInventory',
            //                'link': '#'
            //            },
            //            {
            //                'label': 'lblMedicalForms',
            //                'link': '#'
            //            }
            //            ];       

            //            $scope.currentMenuItem = $scope.menuItems[0];
            //            $scope.status = {
            //                isopen: false
            //            };
            //            $scope.toggled = function (open) {
            //                $log.log('Dropdown is now: ', open);
            //            };
            //            $scope.toggleDropdown = function ($event) {
            //                $event.preventDefault();
            //                $event.stopPropagation();
            //                $scope.status.isopen = !$scope.status.isopen;
            //            };


            $scope.Medicalprofile = function () {
                globalobject.selectEmployeeStatus.EmployeeStatus = $scope.filterData.EmployeeStatus;
                $location.path("/employeemedicalprofile");
            }



            $scope.DuplicateAppointments = function () {
                if ($scope.DuplicateExists == "Duplicatetime") {

                    $scope.AppointmentDate = globalobject.currentObject.AppointmentDate;
                    $scope.AppTimein = globalobject.currentObject.AppointmentTimeIn;

                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/duplicate-app-time-confirmation-modal.html',
                        controller: 'duplicatetimeAppointmentCtrl',
                        size: 'sm',
                        scope: $scope
                    });

                } else {

                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/duplicate-app-confirmation-modal.html',
                        controller: 'duplicateAppointmentCtrl',
                        size: 'sm',
                        scope: $scope
                    });

                }

            }
            $scope.onlyReschedule = false;
            $scope.CancelDuplicateAppointments = function () {

                $scope.onlyReschedule = true;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/reshedule-confirmation-modal.html',
                    controller: 'RescheduleActionModalCtrl',
                    size: 'sm',
                    scope: $scope
                });

            }

            // OPEN MODALS
            $scope.openAppointmentActionModal = function (obj) {
                globalobject.AppointmentDate = obj.AppointmentDate;
                //$scope.currentObject=obj;
                globalobject.currentEncounter.screenType = "appointment";
                globalobject.DuplicateAppointmentfromScreen = "AppCentral";
                globalobject.currentObject = angular.copy(obj);
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/appointment-actions-modal.html',
                    controller: 'AppointmentActionModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            };



            $scope.add = function (data) {
                //put the path for encounter type details screen
                globalobject.currentEncounter.SelectedEncounterTypeID = 0;
                if (data == "appointment") {
                    globalobject.currentEncounter.AppointmentDetailID = 0;
                    globalobject.currentEncounter.screenType = 'appointment';

                    $location.path("/add");
                }
                else {
                    globalobject.currentEncounter.AppointmentDetailID = 0;
                    globalobject.currentEncounter.screenType = 'encounter';
                    $location.path("/add");
                }
            }
            // Calendar popup options and functions.
            $scope.status = {
                opened: false
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.open = function ($event) {
                $scope.status.opened = true;
            };
            $scope.goToEncounterTypeDetails = function (detailScreen, EncounterID, Encounter) {

                globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
                globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;

                globalobject.currentEncounter.ExposureEncounterSummaryID = detailScreen.split(':')[2];
                globalobject.currentEncounter.EncounterDetailID = EncounterID;
                globalobject.currentEncounter.SelectedEncounterTypeID = detailScreen.split(':')[4];
                globalobject.currentEncounter.AppointmentDetailID = Encounter.AppointmentDetailID;
                globalobject.currentEncounter.EmployeePK = Encounter.EmployeePK == null ? 0 : Encounter.EmployeePK;
                $location.path("/encounterdetails");
            }

            //goto AppointmentDetails
            $scope.gotoAppointment = function (item) {
                //send data through factory method
                globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
                globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;

                globalobject.currentEncounter.EmployeePK = item.EmployeePK == null ? 0 : item.EmployeePK;
                globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
                globalobject.currentEncounter.SelectedEncounterTypeID = 0;
                globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
                globalobject.currentEncounter.screenType = 'appointment';
                globalobject.currentEncounter.PersonnelTypeID = item.PersonnelTypeID;
                if (item.IsEncounterAvailable) {

                    $location.path("/encounterdetails/");
                }
                else
                    $location.path("/add/3");
            };
            //goto EncounterDetails
            $scope.gotoEncounter = function (item) {
                globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
                globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;

                //send data through factory method
                globalobject.currentEncounter.EmployeePK = item.EmployeePK == null ? 0 : item.EmployeePK;
                globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
                globalobject.currentEncounter.SelectedEncounterTypeID = 0;
                globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
                globalobject.currentEncounter.PersonnelTypeID = item.PersonnelTypeID;
                $location.path("/encounterdetails/");
            };
            // JQUERY:
            $(function () {

                var setListGroupWrapperHeight;
                (setListGroupWrapperHeight = function () {
                    // LIST GROUP MAX-HEIGHT BASED ON BROWSER WINDOW HEIGHT
                    var listGroupHeight = Math.floor($(window).height() - 245); // Estimated height of header and action bar
                    // console.log(listGroupHeight);
                    $('.list-group-height-wrapper').css({
                        'height': listGroupHeight,
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto'
                    });
                })()

                $(window).resize(function () {
                    setListGroupWrapperHeight();
                });

            });


            // FILTERS

            $scope.openFilter = function () {
                $('#appointmentCentralFilterWrapper').slideToggle(350);
                $('#filterSummary').slideUp(350);
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
            };

            $scope.applyFilters = function () {
                $scope.showLoadingOverlay = true;
                $scope.startDate = $scope.innerFilterStartDate;
                $scope.endDate = $scope.innerFilterEndDate;
                $scope.filterStartDate = $scope.innerFilterStartDate;
                $scope.filterEndDate = $scope.innerFilterEndDate;
                $('#appointmentCentralFilterWrapper').slideUp(350);
                $('html, body').animate({ scrollTop: 0 }, 800);

                $scope.appointmentSearch.AppointmentStatusIDs = (($scope.filterData.AppointmentStatusIDs == '' || $scope.filterData.AppointmentStatusIDs == null) ? null : $scope.filterData.AppointmentStatusIDs.toString());
                $scope.appointmentSearch.EncounterTypeIDs = (($scope.filterData.EncounterTypeIDs == '' || $scope.filterData.EncounterTypeIDs == null) ? null : $scope.filterData.EncounterTypeIDs.toString());
                $scope.appointmentSearch.HealthCareEntityIDs = (($scope.filterData.HealthCareEntityIDs == '' || $scope.filterData.HealthCareEntityIDs == null) ? null : $scope.filterData.HealthCareEntityIDs.toString());
                $scope.appointmentSearch.PersonnelTypeIDs = (($scope.filterData.PersonnelTypeIDs == '' || $scope.filterData.PersonnelTypeIDs == null) ? null : $scope.filterData.PersonnelTypeIDs.toString());
                $scope.appointmentSearch.VisitReasonIDs = (($scope.filterData.VisitReasonIDs == '' || $scope.filterData.VisitReasonIDs == null) ? null : $scope.filterData.VisitReasonIDs.toString());
                $scope.appointmentSearch.HealthCareProviderIDs = (($scope.filterData.HealthCareProviderIDs == '' || $scope.filterData.HealthCareProviderIDs == null) ? null : $scope.filterData.HealthCareProviderIDs.toString());
                $scope.filterData.AppointmentScheduleByIDs = (($scope.filterData.AppointmentScheduleByIDs == '' || $scope.filterData.AppointmentScheduleByIDs == null) ? null : $scope.filterData.AppointmentScheduleByIDs);
                $scope.filterData.EmployeeIDs = (($scope.filterData.EmployeeIDs == '' || $scope.filterData.EmployeeIDs == null) ? null : $scope.filterData.EmployeeIDs.toString());
                $scope.filterData.FromDate = $scope.innerFilterStartDate;
                $scope.filterData.ToDate = $scope.innerFilterEndDate;

                if (!($scope.appointmentSearch.AppointmentStatusIDs == null && $scope.appointmentSearch.EncounterTypeIDs == null &&
                     $scope.appointmentSearch.HealthCareEntityIDs == null && $scope.appointmentSearch.PersonnelTypeIDs == null &&
                     $scope.appointmentSearch.VisitReasonIDs == null && $scope.appointmentSearch.HealthCareProviderIDs == null &&
                     $scope.filterData.AppointmentScheduleByIDs == null)) {
                    $('#filterSummary').slideDown(350);
                }
                $scope.getSetAppointmentFilterSession("set");
                $scope.getAppointments();
                $scope.getEncounters();
                toastr.success($filter('translate')('msgFiltershavebeenapplied'), $filter('translate')('lblFilter'));
            };

            $scope.CloseAllFilters = function (param) {
                $('#appointmentCentralFilterWrapper').slideUp(350);
                $('#filterSummary').slideUp(350);
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
                if ($scope.IsApplyedFilter == false || param == "reset") {
                    $scope.appointmentSearch.AppointmentStatusIDs = null;
                    $scope.appointmentSearch.PersonnelTypeIDs = null;
                    $scope.appointmentSearch.EncounterTypeIDs = null;
                    $scope.appointmentSearch.VisitReasonIDs = null;
                    $scope.appointmentSearch.HealthCareEntityIDs = null;
                    $scope.appointmentSearch.HealthCareProviderIDs = null;
                    $scope.appointmentSearch.AppointmentScheduleByIDs = null;

                    $scope.filterData.AppointmentStatusIDs = null;
                    $scope.filterData.PersonnelTypeIDs = null;
                    $scope.filterData.EncounterTypeIDs = null;
                    $scope.filterData.VisitReasonIDs = null;
                    $scope.filterData.HealthCareEntityIDs = null;
                    $scope.filterData.HealthCareProviderIDs = null;
                    $scope.filterData.AppointmentScheduleByIDs = null;
                    if ($scope.IsDateFilter == false || param == "reset") {
                        $scope.setToday("global");
                    }
                }
                if (param == "reset") {
                    $scope.getSetAppointmentFilterSession(param);
                }
                if ($scope.IsApplyedFilter == true) {
                    $('#filterSummary').slideDown(350);

                }

            };

            $scope.CheckClearFilters = function () {
                if (($scope.filterData.AppointmentStatusIDs == null || $scope.filterData.AppointmentStatusIDs == '') &&
                ($scope.filterData.PersonnelTypeIDs == null || $scope.filterData.PersonnelTypeIDs == '') &&
                ($scope.filterData.EncounterTypeIDs == null || $scope.filterData.EncounterTypeIDs == '') &&
                ($scope.filterData.VisitReasonIDs == null || $scope.filterData.VisitReasonIDs == '') &&
                ($scope.filterData.HealthCareEntityIDs == null || $scope.filterData.HealthCareEntityIDs == '') &&
                ($scope.filterData.HealthCareProviderIDs == null || $scope.filterData.HealthCareProviderIDs == '') &&
                ($scope.filterData.AppointmentScheduleByIDs == null || $scope.filterData.AppointmentScheduleByIDs == '')) {
                    $('#appointmentCentralFilterWrapper').slideUp(350);
                    $('#filterSummary').slideUp(350);
                    $('html, body').animate({
                        scrollTop: 0
                    }, 800);
                }
                $scope.getSetAppointmentFilterSession("set");

            };

            $scope.clearFilters = function (filterName) {

                switch (filterName) {
                    case 'Appointment Status':
                        $scope.filterData.AppointmentStatusIDs = null;
                        $scope.appointmentSearch.AppointmentStatusIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Encounter Type':
                        $scope.filterData.EncounterTypeIDs = null;
                        $scope.appointmentSearch.EncounterTypeIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Health Care Entity':
                        $scope.filterData.HealthCareEntityIDs = null;
                        $scope.appointmentSearch.HealthCareEntityIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Personnel Type':
                        $scope.filterData.PersonnelTypeIDs = null;
                        $scope.appointmentSearch.PersonnelTypeIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Visit Reason':
                        $scope.filterData.VisitReasonIDs = null;
                        $scope.appointmentSearch.VisitReasonIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Health Care Provider':
                        $scope.filterData.HealthCareProviderIDs = null;
                        $scope.appointmentSearch.HealthCareProviderIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    case 'Appointment Scheduled By':
                        $scope.filterData.AppointmentScheduleByIDs = null;
                        $scope.appointmentSearch.AppointmentScheduleByIDs = null;
                        $scope.CheckClearFilters();
                        break;
                    default:
                        break;
                }
            };



            $scope.toggleFilter = function (option) {
                $scope.resettoPrevious();
                $scope.innerFilterStartDate = $scope.filterStartDate;
                $scope.innerFilterEndDate = $scope.filterEndDate;
                $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
                $scope.innerFilterEndDateDisplay = $scope.filterEndDate;

                if (option == "close") {
                    $('#appointmentCentralFilterWrapper').slideUp(350);
                } else {

                    if ($('#appointmentCentralFilterWrapper').css('display') == 'block') {
                        $('#filterSummary').slideDown(100);
                    }
                    else {
                        $('#filterSummary').slideUp(100);

                    }
                    $('#appointmentCentralFilterWrapper').slideToggle(350);
                    //$('#filterSummary').slideToggle(350);
                    //  $('#filterSummary').slideUp(100);

                    if (($scope.filterData.AppointmentStatusIDs == null || $scope.filterData.AppointmentStatusIDs == '') &&
                        ($scope.filterData.PersonnelTypeIDs == null || $scope.filterData.PersonnelTypeIDs == '') &&
                        ($scope.filterData.EncounterTypeIDs == null || $scope.filterData.EncounterTypeIDs == '') &&
                        ($scope.filterData.VisitReasonIDs == null || $scope.filterData.VisitReasonIDs == '') &&
                        ($scope.filterData.HealthCareEntityIDs == null || $scope.filterData.HealthCareEntityIDs == '') &&
                        ($scope.filterData.HealthCareProviderIDs == null || $scope.filterData.HealthCareProviderIDs == '') &&
                        ($scope.filterData.AppointmentScheduleByIDs == null || $scope.filterData.AppointmentScheduleByIDs == '')) {
                        $('#filterSummary').slideUp(350);
                    }

                }
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
            };
            $scope.isSame = function (dt1, dt2) {
                return moment(dt1).isSame(dt2, 'day');
            };
            $scope.setToday = function (picker) {
                if (picker == "inner") {
                    $scope.innerFilterStartDate = new Date();
                    $scope.innerFilterEndDate = new Date();
                }
                else if (picker == "global") {
                    $scope.filterStartDate = new Date();
                    $scope.filterEndDate = new Date();
                    $scope.startDate = new Date();
                    $scope.endDate = new Date();
                    $scope.filterData.FromDate = new Date();
                    $scope.filterData.ToDate = new Date();
                }
            };
            $scope.resettoPrevious = function () {
                if ($scope.startDate != "" && $scope.endDate != "") {
                    $scope.filterStartDate = $scope.startDate;
                    $scope.filterEndDate = $scope.endDate;
                }
            };
            $scope.IsDateFilter = false;
            $scope.applyDateFilter = function () {
                $scope.showLoadingOverlay = true;
                $scope.startDate = $scope.filterStartDate;
                $scope.endDate = $scope.filterEndDate;
                $scope.innerFilterStartDate = $scope.filterStartDate;
                $scope.innerFilterEndDate = $scope.filterEndDate;
                $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
                $scope.innerFilterEndDateDisplay = $scope.filterEndDate;
                $scope.filterData.FromDate = $scope.innerFilterStartDate;
                $scope.filterData.ToDate = $scope.innerFilterEndDate;
                $scope.IsDateFilter = true;
                $scope.getSetAppointmentFilterSession("set");

            };

            $scope.cancelInnerDateFilter = function () {
                $scope.innerFilterStartDate = $scope.filterStartDate;
                $scope.innerFilterEndDate = $scope.filterEndDate;
                $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
                $scope.innerFilterEndDateDisplay = $scope.filterEndDate;
            };

            $scope.applyInnerDateFilter = function (option) {
                $scope.innerFilterStartDateDisplay = $scope.innerFilterStartDate;
                $scope.innerFilterEndDateDisplay = $scope.innerFilterEndDate;
            };

            $scope.clearMultiSelectField = function () {
                console.log('test');
                $('input.ui-select-search').val('');
            };

        }
    ])
