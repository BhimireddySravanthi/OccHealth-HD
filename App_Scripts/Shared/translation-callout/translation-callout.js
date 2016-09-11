angular.module("Calendar").controller('translationCtrl', function ($scope, ngDialog, $location, toast, sharedUses, $injector, actionItemService) {

    var params = $scope.params;
    params.iconImage = params.iconImage || "fa fa-language fa-2x";  
    params.bodyTxt = params.bodyTxt || "Continue?";
    params.cancelTxt = params.cancelTxt || "Cancel";
    params.continueTxt = params.continueTxt || "Contribute";

    $scope.enableEdit = false;
    $scope.sucessMessage = "";
    $scope.showsucessMessage = false;
    $scope.xhrStartFlag = false;


    $scope.permissionDenied = function () {
        toast.preset("permission-denied");
    };

    $scope.applyTransalation = function () {
        // ngDialog.closeAll();
        $scope.xhrStartFlag = true;
        $scope.sucessMessage = "";
        sharedUses.parseDates(params.object);
        var configs = {
            url: "../WebServices/Calendar/CalendarActionItemService.asmx/ApplyTranslation",
            // dataType: "json",
            data: { translationObject: params.object }
        };
        actionItemService.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
    };

    function saveDataSuccess(data, status, headers, config) {
        if (data.d.IsOK) {
            $scope.sucessMessage = "You have successfully applied the translation";
            $scope.showsucessMessage = true;
            $scope.xhrStartFlag = false;
            $scope.enableEdit = false;
        }

    };


    function saveDataError(data, status, headers, config) {
        console.log("call failed...");
        $scope.xhrStartFlag = false;
    };


});