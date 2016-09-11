angular.module("app")
        .controller('lookupscreensCtrl',
        function ($scope, $modalInstance) {         
            $scope.StatusList = [{ id: 1000, Text: "Active" }, { id: 1001, Text: "InActive"}];

            $scope.modalOk = function () {
                if ($scope.params.onSuccessCall) {
                    $scope.params.onSuccessCall();
                }
                $modalInstance.close('');

            };
            $scope.cancel = function () {
                $modalInstance.close('Cancel');

            };

        }
    )