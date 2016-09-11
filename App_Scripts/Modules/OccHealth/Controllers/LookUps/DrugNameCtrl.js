
angular.module("app")
       .controller("DrugDetailCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            $scope.DrugDetail = {
                DrugDetailID: 0
                , DrugName: null
                , DrugDetailDescription: null
                , StatusTypeId: 1000
            };
            $scope.StatusList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: "InActive"}];
            $scope.DrugDetailObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;
            $scope.saveDrugDetailDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.DrugDetail.DrugName == ''
                    || $scope.DrugDetail.DrugName == null
                    || $scope.DrugDetail.StatusTypeId == ''
                    || $scope.DrugDetail.StatusTypeId == null
                ) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    utilityservices.notify("required");
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveDrug",
                        data: { DrugDetail: $scope.DrugDetail }
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
                    if (data.d.Object.DrugDetailID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {
                        $scope.DrugDetail = data.d.Object;
                        $scope.DrugDetailObj.ID = $scope.DrugDetail.DrugDetailID;
                        $scope.DrugDetailObj.Text = $scope.DrugDetail.DrugName;
                        globalobject.DrugDetailList.push($scope.DrugDetailObj);
                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                        globalobject.DrugDetailID = $scope.DrugDetail.DrugDetailID;
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