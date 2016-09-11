
angular.module("app")
       .controller("ImmunizationTypeCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            $scope.ImmunizationType = {
                ImmunizationTypeID: 0
                , ImmunizationTypeTitle: null
                , ImmunizationTypeDescription: null
                , StatusTypeId: 1000
            };
            $scope.StatusList = [{ ID: 1000, Text: "Active" }, { ID: 1001, Text: "InActive"}];
            $scope.immunizationTypeObj = { ID: 0, Text: "" };
            $scope.fromLookup = true;
            $scope.saveImmunizationDetails = function () {

                var saveStatus = true;
                var msg = '';

                if (
                      $scope.ImmunizationType.ImmunizationTypeTitle == ''
                    || $scope.ImmunizationType.ImmunizationTypeTitle == null
                    || $scope.ImmunizationType.StatusTypeId == ''
                    || $scope.ImmunizationType.StatusTypeId == null
                ) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    utilityservices.notify("required");
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveImmunizationType",
                        data: { ImmunizationType: $scope.ImmunizationType }
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
                    if (data.d.Object.ImmunizationTypeID == 0) {
                       toastr.error($filter('translate')('msgNameAlreadyExists')); 

                    } else {
                        $scope.ImmunizationType = data.d.Object;
                        $scope.immunizationTypeObj.ID = $scope.ImmunizationType.ImmunizationTypeID;
                        $scope.immunizationTypeObj.Text = $scope.ImmunizationType.ImmunizationTypeTitle;
                        globalobject.VaccineTypeList.push($scope.immunizationTypeObj);
                        toastr.success($filter('translate')('msgSavedSuccessfully'));
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                        globalobject.VaccineTypeID = $scope.ImmunizationType.ImmunizationTypeID;
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