angular.module("app")
    .controller("MedicalProfileappointmentCtrl", ["$scope",
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

            // ENCOUNTER LIST
            $scope.appointmentListSettings = {
                currentPage: 1,
                pageSize: 10
            };
            $scope.searchappointment = {};

            $scope.appointments = globalobject.appointmentList;

            // $scope.appointments = [];
            //   $scope.appointments = globalobject.appointmentList;


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

            $scope.gotoAppointment = function (item) {
                //send data through factory method
                globalobject.currentEncounter.EmployeePK = item.EmployeePK;
                globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
                globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
                globalobject.currentEncounter.screenType = 'EmployeeMedicalProfile';
                globalobject.currentEncounter.PersonnelTypeID = item.PersonnelTypeID;
                if (item.IsEncounterAvailable) {
                    globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                    globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                    globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                    $location.path("/encounterdetails/");
                }
                else
                    $location.path("/add/3");
            };
            $scope.gotoAppointmentType = function (it, item) {
                //send data through factory method
                globalobject.currentEncounter.EmployeePK = item.EmployeePK;
                globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
                globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
                globalobject.currentEncounter.screenType = 'EmployeeMedicalProfile';
                globalobject.currentEncounter.SelectedEncounterTypeID = it.split("##")[0];
                globalobject.currentEncounter.PersonnelTypeID = item.PersonnelTypeID;
                if (item.IsEncounterAvailable) {
                    globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                    globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                    globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                    $location.path("/encounterdetails/");
                }
                else
                    $location.path("/add/3");
            };

            $scope.getfilteredappointments = function () {
                var start, end, cp, pgs;
                cp = $scope.appointmentListSettings.currentPage;
                pgs = $scope.appointmentListSettings.pageSize;
                start = ((cp - 1) * pgs);
                end = ((cp - 1) * pgs) + pgs

                var filteredArr = $filter('filter')($scope.$parent.appointmentList, $scope.searchappointment);
                return filteredArr != null ? filteredArr.slice(start, end) : [];
            };
            $scope.newGrouping = function (group_list, group_by, index) {
                if (index > 0) {
                    prev = index - 1;
                    if (group_list[prev][group_by] !== group_list[index][group_by]) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            };
            $scope.DuplicateExists = "";
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


            $scope.openAppointmentActionModal = function (obj) {
                //$scope.currentObject=obj;
                //sharedservices.parseDates(obj);
                globalobject.currentObject = angular.copy(obj);
                sharedservices.parseDates(globalobject.currentObject);
                globalobject.AppointmentDate = globalobject.currentObject.AppointmentDate;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/appointment-actions-modal.html',
                    controller: 'AppointmentActionModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            };


            $scope.currentListIndex = null;
            $scope.updateListIndex = function (index) {
                $scope.currentListIndex = index;
            };

        } ]
	);
