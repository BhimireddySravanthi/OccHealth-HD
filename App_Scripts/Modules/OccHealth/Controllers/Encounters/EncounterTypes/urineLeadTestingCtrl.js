(function() {
    angular.module("app")
        .controller("urineLeadTestingCtrl", urineLeadTestingCtrl);

    function urineLeadTestingCtrl( $scope, sharedservices, globalobject ) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        $scope.navBarOptions = {
            detailsFormId: 1001,
            resultsFormId: 1011,
            investigationFormId: 1012
        };

        $scope.myDate=new Date();

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