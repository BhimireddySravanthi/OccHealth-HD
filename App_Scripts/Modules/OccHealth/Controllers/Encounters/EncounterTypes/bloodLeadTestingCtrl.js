(function() {
    angular.module("app")
        .controller("bloodLeadTestingCtrl", bloodLeadTestingCtrl);

    function bloodLeadTestingCtrl( $scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        $scope.navBarOptions = {
            detailsFormId: 1000,
            resultsFormId: 1009,
            investigationFormId: 1010
        };

        $scope.investigationCollection = [];
        var configs = undefined;

        //get investigationCollection
        $scope.getInvestigationCollection = function () {
            configs = {
                method: "GET",
                url: "/Data/investigationDetails.json"
            };

            sharedservices.xhrService(configs)

                .success(function (data, status, headers, config) {
                    $scope.investigationCollection = data.sections;
                    // $log.log($scope.appointments)
                })
                .error(function() {
                    $log.log("error")
                })
        };

        $scope.getInvestigationCollection();

        $scope.toggleQuestionComment = function(question){
            question.commentStatus = !question.commentStatus;
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

