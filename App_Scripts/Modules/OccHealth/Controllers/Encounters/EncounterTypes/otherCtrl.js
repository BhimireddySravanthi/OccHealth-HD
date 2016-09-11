(function() {
    angular.module("app")
        .controller("otherCtrl", otherCtrl);

    function otherCtrl( $scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: 1030,
            resultsFormId: undefined,
            investigationFormId: undefined
        };
    };

})();

