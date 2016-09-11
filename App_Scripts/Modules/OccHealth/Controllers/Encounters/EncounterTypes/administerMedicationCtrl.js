(function() {
    angular.module("app")
        .controller("administerMedicationCtrl", administerMedicationCtrl);

    function administerMedicationCtrl( $scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: 1021,
            resultsFormId: undefined,
            investigationFormId: undefined
        };

        // TIME
        /* 
         * sharedservices.setTime( hour, minutes) function
         * hour and minute arguments can be integer or string
         */
        // TIME STEPS
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

    };

})();

