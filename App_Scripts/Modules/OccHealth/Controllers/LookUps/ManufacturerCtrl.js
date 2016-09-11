
angular.module("app")
       .controller("ManufacturerDetailCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            $scope.ManufacturerDetail = {
                ManufacturerDetaillD: 0
                , ManufacturerName: null
                , ManufacturerCategory: null
                , ManufacturerDetailDescription: null
                , ManufacturerPhoneNumber: null
                , StatusTypeId: 1000
            };
            $scope.fromLookup = true;
            $scope.StatusList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: "InActive"}];
            $scope.CategoryList = [{ ID: 1000, Text: "Medication" }, { ID: 1001, Text: "Vaccine" }, { ID: 1003, Text: "Equipment" }, { ID: 1004, Text: "Supply"}];
            $scope.ManufactureObj = { ID: 0, Text: "" };

            $scope.saveManufacturerDetail = function () {

                var saveStatus = true;
                var msg = '';

                if (
                     $scope.ManufacturerDetail.ManufacturerName == ''
                    || $scope.ManufacturerDetail.ManufacturerName == null

                    || $scope.ManufacturerDetail.StatusTypeId == ''
                    || $scope.ManufacturerDetail.StatusTypeId == null
                ) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    utilityservices.notify("required");
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveManufacturer",
                        data: { ManufacturerDetail: $scope.ManufacturerDetail }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }
            }
            $scope.back = function () {

                if (globalobject.fromScreen == "Equipment") {
                    $location.path("/Equipment");
                }
                else
                    $location.path("/Medication");

            }
            $scope.cancel = function () {
                //                if (globalobject.Fromscreen == "equipment") {
                //                     globalobject.fromScreen = "Equipment"; 
                //                }
                //                else
                //                    globalobject.fromScreen= "Medication";

                $scope.fromLookup = true;

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
                    if (data.d.Object.ManufacturerDetaillD == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {
                        $scope.ManufacturerDetail = data.d.Object;
                        $scope.ManufactureObj.ID = $scope.ManufacturerDetail.ManufacturerDetaillD;
                        $scope.ManufactureObj.Text = $scope.ManufacturerDetail.ManufacturerName;
                        globalobject.ManufactureDetailList.push($scope.ManufactureObj);

                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                        globalobject.ManufacturerDetaillD = $scope.ManufacturerDetail.ManufacturerDetaillD;

                        if (globalobject.fromScreen == "Equipment") {
                            $location.path("/Equipment");
                        }
                        else
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