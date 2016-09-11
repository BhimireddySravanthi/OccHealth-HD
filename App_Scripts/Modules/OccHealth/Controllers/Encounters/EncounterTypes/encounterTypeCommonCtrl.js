(function () {
    angular.module("app")
        .controller("encounterTypeCommonCtrl", encounterTypeCommonCtrl);

    function encounterTypeCommonCtrl($scope, sharedservices, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.contentUrl = globalobject.contentUrl;

        $scope.$watch(function(){
            return globalobject.encounterTypes.encounterDetails.contentUrl
        }, function(newVal, oldVal){

            $scope.contentUrl = globalobject.encounterTypes.encounterDetails.contentUrl;
            $scope.title = globalobject.encounterTypes.encounterDetails.encounterTypeActionTitle;

        });

    };

})();