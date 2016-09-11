angular.module("app")
.controller("audiometricSTSCtrl", [
    "$scope",
    "$routeParams",
    "$location",
    "sharedservices",
    "$modal",
    "utilityservices",
    "toastr",
    "$timeout",
    "globalobject",
    "$filter",
    function ($scope, $routeParams, $location, sharedservices, $modal, utilityservices, toastr, $timeout, globalobject, $filter) {

        // Get Location Department Loock up

        $scope.STSDetail = {};
        $scope.showLoadingOverlay = true;

        $scope.EmployeePK = globalobject.employee.ID;
        $scope.AudiometricTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;

        $scope.AgeCorrection = true;
        $scope.ShowOSHALENote = false;
        $scope.ShowACOSHALENote = false;
        $scope.showSTSLeftSection = true;
        $scope.showSTSRightSection = true;
        $scope.LetterType = null;
        $scope.showAgeCorrection = function (obj) {

            if (obj.checked)
                $scope.AgeCorrection = true;
        }

        $scope.navBarOptions = {
            detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricDetails" : 1020,
            resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricResults" : 2020,
            hearingResultsHistoryFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/ResultsHistory" : 2024,
            recordkeepingFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/Recordkeeping" : 2022,
            nextStepsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/NextSteps" : 2023,
            investigationFormId: undefined
        };
        $scope.showSubNavbars = true;

        $scope.getSTSDetail = function () {

            var configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetSTSDetail",
                data: { AudiometricTestID: $scope.AudiometricTestID, EmployeePK: $scope.EmployeePK }
                // data: { AudiometricTestID: 1017, EmployeePK: 49301 }

            };
            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.STSDetail = data.d.Object == null ? [] : data.d.Object;

                        $scope.ShowOSHALENote = $scope.STSDetail.OSHALECurrentStatus.contains('STS Identified') || $scope.STSDetail.OSHARECurrentStatus.contains('STS Identified');
                        $scope.ShowACOSHALENote = $scope.STSDetail.ACOSHALECurrentStatus.contains('STS Identified') || $scope.STSDetail.ACOSHARECurrentStatus.contains('STS Identified');

                        $('#OSHARECurrentStatus').html($scope.STSDetail.OSHARECurrentStatus.replace(",", "<br/>"))
                        $('#OSHALECurrentStatus').html($scope.STSDetail.OSHALECurrentStatus.replace(",", "<br/>"))
                        $('#ACOSHALECurrentStatus').html($scope.STSDetail.ACOSHALECurrentStatus.replace(",", "<br/>"))
                        $('#ACOSHARECurrentStatus').html($scope.STSDetail.ACOSHARECurrentStatus.replace(",", "<br/>"))


                        if ($scope.STSDetail.LeftVisitCategoryID == 1002 || $scope.STSDetail.LeftVisitCategoryID == 1003) {

                            $scope.showSTSLeftSection = false;
                        }

                        if ($scope.STSDetail.RightVisitCategoryID == 1002 || $scope.STSDetail.RightVisitCategoryID == 1003) {

                            $scope.showSTSRightSection = false;
                        }
                        $scope.showLoadingOverlay = false;

                    }
                    else {
                        $scope.STSDetail = {};
                        $scope.showLoadingOverlay = false;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                    $scope.showLoadingOverlay = false;
                })
        };
        $scope.getSTSDetail();

        $scope.getNotificationLetterType = function () {
            if ($scope.AgeCorrection) {
                if ($scope.STSDetail.ACOSHALECurrentStatus.contains('STS Identified') &&
                                              $scope.STSDetail.ACOSHARECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL';

                }
                else if ($scope.STSDetail.ACOSHALECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL_Left';
                }
                else if ($scope.STSDetail.ACOSHARECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL_Right';
                }
                else {
                    $scope.LetterType = 'NORMAL';
                }
            }
            else {
                if ($scope.STSDetail.OSHALECurrentStatus.contains('STS Identified') &&
                                              $scope.STSDetail.OSHARECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL'
                }
                else if ($scope.STSDetail.OSHALECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL_Left';
                }
                else if ($scope.STSDetail.OSHARECurrentStatus.contains('STS Identified')) {
                    $scope.LetterType = 'ABNORMAL_Right';
                }
                else {
                    $scope.LetterType = 'NORMAL';
                }
            }
        }

        $scope.getSTSNotfiyLetter = function () {
            $scope.getNotificationLetterType();

            var userParms = {};
            var userUrl = "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRestServiceHeaderDetails";
            var msg = "Unable to Generate Letter.";
            var configs = {
                url: userUrl
            };
            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        var consumerId = data.d.Object[0];
                        var restHostUrl = data.d.Object[1];
                        var stsHeaders = {
                            "ApplicationType": "4",
                            "ConsumerId": consumerId,
                            "Accept": "application/json; charset=utf-8",
                            "Content-Type": "application/json; charset=utf-8"
                        };
                        var stsUrl = restHostUrl + '/papi/v1/oh/GenerateSTSLetter?STSId=' + $scope.AudiometricTestID + "&empPk=" + $scope.EmployeePK + "&lettertype=" + $scope.LetterType + "&lang=" + globalobject.currentSession.language;
                        var stsParms = {};
                        getAjaxResponse("GET", stsHeaders, stsParms, stsUrl, stsSuccess, stsError);

                        function stsSuccess(data, status, xhr) {
                            var docUrl = data;
                            if (docUrl.indexOf("STSLetter_") > 0)
                                window.open(docUrl, 'STS Notification Letter', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
                            else
                                utilityservices.notify("error", docUrl);
                        }

                        function stsError(data, status, xhr) {
                            utilityservices.notify("error", msg);
                        }
                    }
                })
                .error(function () {
                    utilityservices.notify("error", msg);
                })

        };

        function getAjaxResponse(httpType, httpHeaders, httpParms, httpUrl, handleData, handleError) {
            $.ajax({
                type: httpType,
                url: httpUrl,
                data: httpParms,
                headers: httpHeaders,
                dataType: "json",
                success: function (data, status, xhr) {
                    handleData(data, status, xhr);
                },
                error: function (data, status, xhr) {
                    handleError(data, status, xhr);
                }
            });
        };
    } ])