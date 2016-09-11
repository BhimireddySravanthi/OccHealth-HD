
angular.module("app")
       .controller("SupplyItemCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            $scope.SupplyItem = {
                SupplyItemID: 0
                , ItemName: null
                , SupplyItemDescription: null
                , StatusTypeId: 1000
            };
            $scope.StatusList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: "InActive"}];
            $scope.SupplyItemObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;
            $scope.saveSupplyItemDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.SupplyItem.ItemName == ''
                    || $scope.SupplyItem.ItemName == null
                    || $scope.SupplyItem.StatusTypeId == ''
                    || $scope.SupplyItem.StatusTypeId == null
                ) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    utilityservices.notify("required");
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveSupplyItem",
                        data: { SupplyItem: $scope.SupplyItem }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }
            }
            $scope.back = function () {

                $location.path("/Medication");

            }
            $scope.cancel = function () {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'CancelModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            };
            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {
                    if (data.d.Object.SupplyItemID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 
                    } else {
                        $scope.SupplyItem = data.d.Object;

                        $scope.SupplyItemObj.ID = $scope.SupplyItem.SupplyItemID;
                        $scope.SupplyItemObj.Text = $scope.SupplyItem.ItemName;
                        globalobject.SupplyItemList.push($scope.SupplyItemObj);

                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;

                        $location.path("/Medication");
                    }
                }
            };
            function saveDataError(data, status, headers, config) {
                toastr.warning($filter('translate')('msgSeriveerror'));
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
            };



        } ]);