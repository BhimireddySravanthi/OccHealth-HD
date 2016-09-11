angular.module("app")
       .controller("EquipmentCategoryCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "$rootScope",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, $rootScope) {

            $scope.EquipmentCategory = {

                EquipmentCategoryID: 0
                , EquipmentCategoryName: null
                , EquipmentCategoryDescription: null
                , StatusTypeId: 1000

            };

            $scope.EquipmentCategoryObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;

            $scope.StatusTypeList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: 'Inactive'}];

            $rootScope.saveEquipmentCategoryDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.EquipmentCategory.EquipmentCategoryName == ''
                    || $scope.EquipmentCategory.EquipmentCategoryName == null
                    || $scope.EquipmentCategory.StatusTypeId == ''
                    || $scope.EquipmentCategory.StatusTypeId == null
                ) {

                    saveStatus = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveEquipmentCategory",
                        data: { EquipmentCategory: $scope.EquipmentCategory }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }

                else
                    if (msg != '') {
                        toastr.warning(msg);
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
            }

            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {
                    if (data.d.Object.EquipmentCategoryID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {

                        $scope.EquipmentCategory = data.d.Object;

                        $scope.EquipmentCategoryObj.ID = data.d.Object.EquipmentCategoryID;
                        $scope.EquipmentCategoryObj.Text = data.d.Object.EquipmentCategoryName;

                        globalobject.EquipmentCategoryList.push($scope.EquipmentCategoryObj);
                        globalobject.EquipmentCategoryID = data.d.Object.EquipmentCategoryID;
                        globalobject.redirected = true;

                        toastr.success($filter('translate')('msgSavedSuccessfully'));

                        $location.path("/Equipment");
                    }
                }

            };
            function saveDataError(data, status, headers, config) {
                toastr.warning($filter('translate')('msgSeriveerror'));
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
            };


            $scope.cancelEquipmentCategory = function () {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'CancelModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }

            $scope.back = function () {
                globalobject.redirected = true;
                $location.path("/Equipment");
            }

        } ]);