angular.module("app")
       .controller("EquipmentTypeCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.EquipmentType = {

                EquipmentTypeID: 0
                , EquipmentTypeName: null
                , EquipmentTypeDescription: null
                , StatusTypeId: 1000

            };

            $scope.EquipmentTypeObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;

            $scope.StatusTypeList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: 'Inactive'}];

            $scope.saveEquipmentTypeDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.EquipmentType.EquipmentTypeName == ''
                    || $scope.EquipmentType.EquipmentTypeName == null
                    || $scope.EquipmentType.StatusTypeId == ''
                    || $scope.EquipmentType.StatusTypeId == null
                ) {

                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveEquipmentType",
                        data: { EquipmentType: $scope.EquipmentType }
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
                    if (data.d.Object.EquipmentTypeID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {
                        $scope.EquipmentType = data.d.Object;

                        $scope.EquipmentTypeObj.ID = data.d.Object.EquipmentTypeID;
                        $scope.EquipmentTypeObj.Text = data.d.Object.EquipmentTypeName;

                        globalobject.EquipmentTypeList.push($scope.EquipmentTypeObj);
                        globalobject.EquipmentTypeID = data.d.Object.EquipmentTypeID;

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


            $scope.cancelEquipmentType = function () {

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