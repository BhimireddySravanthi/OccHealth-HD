angular.module("app")
       .controller("SupplierDetailsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.SupplierDetails = {

                SupplierDetailID: 0
                , SupplierName: null
                , SupplierDetailDescription: null
                , StatusTypeId: 1000

            };

            $scope.SupplierDetailObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;

            $scope.StatusTypeList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: 'Inactive'}];

            $scope.saveSupplyDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                    $scope.SupplierDetails.SupplierName == ''
                    || $scope.SupplierDetails.SupplierName == null
                    || $scope.SupplierDetails.StatusTypeId == ''
                    || $scope.SupplierDetails.StatusTypeId == null
                ) {

                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveSupplier",
                        data: { SupplierDetail: $scope.SupplierDetails }
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
                    if (data.d.Object.SupplierDetailID == 0) {
                        toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {

                        $scope.SupplierDetails = data.d.Object;

                        $scope.SupplierDetailObj.ID = data.d.Object.SupplierDetailID;
                        $scope.SupplierDetailObj.Text = data.d.Object.SupplierName;

                        globalobject.SupplierDetailList.push($scope.SupplierDetailObj);
                        globalobject.SupplierDetailID = data.d.Object.SupplierDetailID;

                        toastr.success($filter('translate')('msgSavedSuccessfully'));

                        globalobject.redirected = true;

                        if (globalobject.fromScreen == 'Equipment')
                            $location.path("/Equipment");
                        if (globalobject.fromScreen == 'Medication')
                            $location.path("/Medication");

                    } 
                }

            };
            function saveDataError(data, status, headers, config) {
                toastr.warning($filter('translate')('msgSeriveerror'));
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
            };

            $scope.cancelSupplyDetails = function () {

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
                if (globalobject.fromScreen == 'Equipment')
                    $location.path("/Equipment");
                if (globalobject.fromScreen == 'Medication')
                    $location.path("/Medication");
            }

        } ]);