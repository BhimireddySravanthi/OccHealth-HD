(function() {
    angular.module("app")
        .controller("audiometricCtrl", audiometricCtrl);

    function audiometricCtrl( $scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: 1022,
            resultsFormId: 1033,
            investigationFormId: undefined
        };

    };

})();

