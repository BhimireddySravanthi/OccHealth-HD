
angular.module("app")
       .controller("BrandNameCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            $scope.BrandNameList = {
                BrandDetailID: 0
                , BrandName: null
                , BrandDetailDescription: null
                , StatusTypeId: 1000
            };
            $scope.StatusList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: "InActive"}];
            $scope.BrandNameObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;

            $scope.saveBrandNameDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                     $scope.BrandNameList.BrandName == ''
                    || $scope.BrandNameList.BrandName == null
                    || $scope.BrandNameList.StatusTypeId == ''
                    || $scope.BrandNameList.StatusTypeId == null
                ) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    utilityservices.notify("required");
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveBrand",
                        data: { BrandDetail: $scope.BrandNameList }
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

                    if (data.d.Object.BrandDetailID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {
                        $scope.BrandNameList = data.d.Object;
                        $scope.BrandNameObj.ID = $scope.BrandNameList.BrandDetailID;
                        $scope.BrandNameObj.Text = $scope.BrandNameList.BrandName;
                        globalobject.BrandDetailList.push($scope.BrandNameObj);
                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        globalobject.BrandDetailID = $scope.BrandNameList.BrandDetailID;
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