(function () {
    angular.module("app")
        .controller("bloodLeadInvestigationCtrl", bloodLeadInvestigationCtrl);

    function bloodLeadInvestigationCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        $scope.navBarOptions = {

            detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLDetails" : 1000,
            resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLResults" : 2004,
            investigationFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLInvestigation" : 2005
        };
        $scope.showSubNavbars = true;

        $scope.investigationCollection = {};
        $scope.InvestigationStatusList = []
        $scope.InvestigationReasonList = []

        var configs = undefined;
        //get Investigation Status and Investigatio Reason Start
        $scope.getInvestigationStatus = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetActivityStatusByModuleID",
                data: { ModuleID: 45 }
            };

            sharedservices.xhrService(configs)

                .success(function (data, status, headers, config) {
                    //  $scope.investigationCollection = data.sections;
                    // $log.log($scope.appointments)
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.InvestigationStatusList = data.d.Object;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
        };
        $scope.getInvestigationStatus()

        $scope.getInvestigationReason = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetInvestigationReason"
            };

            sharedservices.xhrService(configs)

                .success(function (data, status, headers, config) {
                    //  $scope.investigationCollection = data.sections;
                    // $log.log($scope.appointments)
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.InvestigationReasonList = data.d.Object;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
        };
        $scope.getInvestigationReason()
        //get Investigation Status and Investigatio Reason End

        //get investigationCollection
        $scope.getInvestigationCollection = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/GetInvestigationQuestion",
                data: { AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID, InvestigationDetailID: 0, EncounterTypeID: globalobject.currentEncounter.EncounterTypeID }
            };

            sharedservices.xhrService(configs)

                .success(function (data, status, headers, config) {
                    //  $scope.investigationCollection = data.sections;
                    // $log.log($scope.appointments)
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.investigationCollection = data.d.Object;
                        if ($scope.investigationCollection.InvestigationDetailID == null) {
                            $scope.investigationCollection.InvestigationConducted = true;
                        }
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
        };

        $scope.getInvestigationCollection();

        $scope.save = function () {
            if (validatefields()) {
                $scope.investigationCollection.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                $scope.investigationCollection.EncounterTypeID = globalobject.currentEncounter.EncounterTypeID;
                configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveInvestigationDeatils",
                    data: { objInvestigation: $scope.investigationCollection }
                };

                sharedservices.xhrService(configs)

                .success(function (data, status, headers, config) {
                    //  $scope.investigationCollection = data.sections;
                    // $log.log($scope.appointments)
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.investigationCollection = data.d.Object;
                        setTimeout(function () { $scope.frmBllInvestigation.$dirty = false; }, 100);
                        utilityservices.notify("saved");
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
            }
            else {
                utilityservices.notify("required");
            }
        };

        $scope.toggleQuestionComment = function (question) {
            question.commentStatus = !question.commentStatus;
        };

        /* ---------------------------------------------
        ------------------------------------------------
        CANCEL FUNCTION
        ------------------------------------------------
        --------------------------------------------- */
        $scope.cancel = function () {

            if ($scope.frmBllInvestigation.$dirty) {

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

        };

        // TIME
        /* 
        * sharedservices.setTime( hour, minutes) function
        * hour and minute arguments can be integer or string
        */
        // TIME STEPS
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;


        function validatefields() {
            var isValid = true;
            if ($scope.investigationCollection.InvestigationConducted) {
                if ($scope.investigationCollection.InvestigationDescription == null || $scope.investigationCollection.InvestigationDescription == "" || $scope.investigationCollection.InvestigationReasonID == null
        || $scope.investigationCollection.InvestigationReasonID == "") {
                    isValid = false;
                }
                else if ($scope.investigationCollection.InvestigationReasonID == 1003) {
                    if ($scope.investigationCollection.Explaination == null || $scope.investigationCollection.Explaination == "") {
                        isValid = false;
                    }
                }
                else {
                    $scope.investigationCollection.Explaination = null;
                }
            }
            else {
                $scope.investigationCollection.InvestigationDescription = null;
                $scope.investigationCollection.InvestigationReasonID = null;
                $scope.investigationCollection.Explaination = null
            }
            return isValid;
        }

        setTimeout(function () { $scope.frmBllInvestigation.$dirty = false; }, 2500);
    };

})();

