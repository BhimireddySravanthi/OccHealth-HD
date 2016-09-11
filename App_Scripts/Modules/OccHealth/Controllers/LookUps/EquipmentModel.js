angular.module("app")
       .controller("EquipmentModelCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.EquipmentModel = {

                EquipmentModelID: 0
                , ModelName: null
                , EquipmentModelDescription: null
                , StatusTypeId: 1000

            };

            $scope.EquipmentModelObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;

            $scope.StatusTypeList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: 'Inactive'}];

            $scope.saveEquipmentModelDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.EquipmentModel.ModelName == ''
                    || $scope.EquipmentModel.ModelName == null
                    || $scope.EquipmentModel.StatusTypeId == ''
                    || $scope.EquipmentModel.StatusTypeId == null
                ) {

                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveEquipmentModel",
                        data: { EquipmentModel: $scope.EquipmentModel }
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
                    if (data.d.Object.EquipmentModelID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {

                        $scope.EquipmentModel = data.d.Object;

                        $scope.EquipmentModelObj.ID = data.d.Object.EquipmentModelID;
                        $scope.EquipmentModelObj.Text = data.d.Object.ModelName;

                        globalobject.EquipmentModelList.push($scope.EquipmentModelObj);
                        globalobject.EquipmentModelID = data.d.Object.EquipmentModelID;

                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        globalobject.redirected = true;
                        $location.path("/Equipment");
                    }
                }

            };
            function saveDataError(data, status, headers, config) {
                toastr.warning($filter('translate')('msgSeriveerror'));
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
            };

            $scope.cancelEquipmentModel = function () {

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