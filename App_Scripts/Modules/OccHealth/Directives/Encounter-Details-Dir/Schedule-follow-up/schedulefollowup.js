(function () {
    angular.module("app")

        .directive("scheduleFollowUp", scheduleFollowUp);

    function scheduleFollowUp() {
        return {

            restrict: "A",
            templateUrl: "/App_Scripts/Modules/OccHealth/Directives/Encounter-Details-Dir/schedule-follow-up/schedulefollowup.html",

            controller: function ($scope, $filter, $location, $modal, $log, $http, $window, sharedservices, utilityservices, globalobject, toastr) {

                $scope.scheduleFollowUp = {

                    ReasonForFollowUp: ""
                    , EncounterTypeScheduleFollowUpID: 0
                    , FollowUpTypeID: null
                    , AppointmentDate: ""
                    , AppointmentTime: ""
                    , hourStep: ""
                    , minuteStep: ""
                    , HealthCareProviderID: null
                    , AppointmentScheduledName: globalobject.currentSession.username
                    , EmployeePK: 0
                };

                //Global Object

                $scope.HealthcareProviderList = globalobject.HealthcareProviderList;
                $scope.FollowUpTypeList = globalobject.FollowUpTypeList;

                //Ends Here
                // globalobject.DuplicateAppointmentfromScreen = "SchedulefollowUp";
                $scope.AppointmentTime = new Date();




                //Get Schedule Follow-Up
                $scope.getScheduleFollowUpDetails = function () {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/ScheduleFollowUpService.asmx/GetScheduleFollowUpDetails",
                        data: { ExposureEncounterSummaryID: globalobject.currentEncounter.ExposureEncounterSummaryID, EncounterDetailID: globalobject.currentEncounter.EncounterTypeID }
                    };

                    sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            if (data.d.IsOK) {
                                sharedservices.parseDates(data.d.Object);
                                $scope.scheduleFollowUp = data.d.Object;
                                $scope.FieldDisabled = true;

                                if ($scope.scheduleFollowUp.AppointmentDate == null) {
                                    $scope.FieldDisabled = false;
                                    $scope.resetSchedulefollwupdetails();
                                } else {

                                    if ($scope.scheduleFollowUp.EncounterTypeScheduleFollowUpID == 0) {

                                        $scope.scheduleFollowUp.AppointmentScheduledName = globalobject.currentSession.username;
                                        $scope.scheduleFollowUp.AppointmentScheduledBy = globalobject.currentSession.userid;
                                    }
                                    else {

                                        $scope.scheduleFollowUp.AppointmentScheduledName = data.d.Object.AppointmentScheduledName;
                                        $scope.scheduleFollowUp.AppointmentScheduledBy = data.d.Object.AppointmentScheduledBy;
                                    }

                                    if ($scope.scheduleFollowUp.AppointmentTime != null && $scope.scheduleFollowUp.AppointmentTime != undefined) {
                                        var d = new Date();
                                        d.setHours($scope.scheduleFollowUp.AppointmentTime.substr(0, 2));
                                        d.setMinutes($scope.scheduleFollowUp.AppointmentTime.substr(3, 2));
                                        $scope.AppointmentTime = d;
                                    }
                                }

                            }
                        })
                    .error(function (data, status, headers, config) { });
                }

                //Ends Here

                // Save Schedule Follow-Up

                $scope.saveScheduleFollowUpDetails = function () {

                    $scope.status = true;
                    var configs = {
                        url: "/WebServices/OccupationalHealth/ScheduleFollowUpService.asmx/CheckDuplicateAppointments",
                        data: { ScheduleFollowUpObj: $scope.scheduleFollowUp }
                    };

                    $scope.scheduleFollowUp.AppointmentTime = $('#hdnTime').val();
                    $scope.scheduleFollowUp.EncounterTypeReference = globalobject.currentEncounter.ExposureEncounterSummaryID;
                    $scope.scheduleFollowUp.EncounterTypeID = globalobject.currentEncounter.EncounterTypeID;
                    $scope.scheduleFollowUp.AppointmentScheduledBy = globalobject.currentSession.userid;
                    $scope.scheduleFollowUp.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                    $scope.scheduleFollowUp.EmployeePK = globalobject.currentEncounter.EmployeePK;


                    $scope.scheduleFollowUp.AppointmentDate = new Date($scope.scheduleFollowUp.AppointmentDate).toDateString();
                    $scope.scheduleFollowUp.AppointmentDate = $scope.scheduleFollowUp.AppointmentDate.substring(3, $scope.scheduleFollowUp.AppointmentDate.length)

                    if ($scope.status) {
                        sharedservices.xhrService(configs)
                            .success(function (data, status, headers, config) {
                                if (data.d.IsOK) {



                                    if (data.d.Message == "Duplicatetime") {
                                        var message = $filter('translate')('msgscheduledfolloup') + $scope.scheduleFollowUp.AppointmentDate + $filter('translate')('msgat') + $scope.scheduleFollowUp.AppointmentTime + ".";
                                        toastr.success(message);
                                        $scope.FieldDisabled = false;
                                        $scope.scheduleFollowUp.ReasonForFollowUp = "";
                                        $scope.scheduleFollowUp.FollowUpTypeID = null;
                                        $scope.scheduleFollowUp.AppointmentDate = "";
                                        $scope.scheduleFollowUp.HealthCareProviderID = null;
                                        $scope.AppointmentTime = "";
                                        $scope.scheduleFollowUp.AppointmentTime = "";
                                        $scope.resetSchedulefollwupdetails();
                                    }
                                    else {
                                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                                        $scope.FieldDisabled = true;
                                    }


                                    $scope.showLoadingOverlay = false;
                                    $scope.loadingAction = false;
                                }
                            })
                            .error(function (data, status, headers, config) {
                                $scope.showLoadingOverlay = false;
                                $scope.loadingAction = false;
                            });

                    }

                }

                //Ends Here

                //Validation

                $scope.ValidateSF = function () {

                    $scope.scheduleFollowUp.AppointmentTime = $('#hdnTime').val();

                    if (!((moment($scope.scheduleFollowUp.AppointmentDate).startOf('day')).isAfter(moment().startOf('day')))) {
                        $scope.saveStatus = false;
                        $scope.msg = $filter('translate')('msgappointmentdateshouldbegreaterthancurrentdate');
                    }

                    if ($scope.scheduleFollowUp.ReasonForFollowUp == null
                            || $scope.scheduleFollowUp.ReasonForFollowUp == ''
                            || $scope.scheduleFollowUp.AppointmentDate == null
                            || $scope.scheduleFollowUp.AppointmentDate == ''
                            || $scope.scheduleFollowUp.AppointmentTime == null
                            || $scope.scheduleFollowUp.AppointmentTime == ''
                            || $scope.scheduleFollowUp.HealthCareProviderID == null
                            || $scope.scheduleFollowUp.HealthCareProviderID == undefined
                            || $scope.scheduleFollowUp.HealthCareProviderID == ""

                        ) {

                        $scope.saveStatus = false;

                        $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                    }
                }

                $scope.emptySchedulefollowupObject = function () {

                    $scope.scheduleFollowUp.ReasonForFollowUp = "";
                    $scope.scheduleFollowUp.FollowUpTypeID = null;
                    $scope.scheduleFollowUp.AppointmentDate = "";
                    $scope.scheduleFollowUp.AppointmentTime = "";
                    $scope.scheduleFollowUp.hourStep = "";
                    $scope.scheduleFollowUp.minuteStep = "";
                    $scope.scheduleFollowUp.HealthCareProviderID = null;

                }
                //Ends

            }
        }
    }

})();
