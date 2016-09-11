angular.module("Calendar").controller('confirmationCtrl', function ($scope, ngDialog, $location, toast, sharedUses, $injector) {
    /**
    *PARAMS{
    * continueFunction:     [Optional | String] String representation of function name, will be executed if defined & clicked
    * continueCtrl:         [Options | String] String representation of controller name, will be exectured if defined & clicked
    *   continueFactory:    [Required when using continueCtrl & continueParams | Object]: property to set in globalFactory
    * continueService:      [Optional | Object of 2 String {service, method}] Calls angular service when clicked, "service" property is string representation of service as "method" for method in service
    * continueParams:       [Required when continueFunction is defined | Object] If continueFunction is defined and parameters need to be passed to the function when called define you set your object of properties to this property
    * cancelFunction        [Optional | String] String representation of function name, will be executed if defined & clicked
    * cancelCtrl:           [Options | String] String representation of controller name, will be exectured if defined & clicked
    *   cancelFactory:      [Required when using cancelCtrl & cancelParams | Object]: property to set in globalFactory
    * cancelService:        [Optional | Object of 2 String {service, method}] Calls angular service when clicked, "service" property is string representation of service as "method" for method in service
    * cancelParams:         [Required when cancelFunction is defined | Object] If cancelFunction is defined and parameters need to be passed to the function when called define you set your object of properties to this property
    * iconImage:            [Optional(recommended) | String] class name that will define the icon at the top of the callout.
    * bodyTxt:              [Optional(recommended) | String] The body message of callout
    * cancelTxt:            [Optional(recommended) | String] Label of the cancel button
    * continueTxt:          [Optional(recommended) | String] Label of the continue button
    * Permissions{          [All optional but if used some rules apply]
    *      canCreate:       [boolean] true, false, or undefined
    *      canRead:         [boolean] true, false, or undefined
    *      canUpdate:       [boolean] true, false, or undefined
    *      canDelete:       [boolean] true, false, or undefined
    *      continueNeeded[]:[Array of String] needs to be defined to disable continue button, ex: continueNeeded['canCreate', 'canDelete'] will check these 2 properties
    *      cancelNeeded[]:  [Array of String] needs to be defined to disable cancel button, ex: cancelNeeded['canCreate', 'canDelete'] will check these 2 properties
    * }
    * }
    * */

    var params = $scope.params;
    params.iconImage = params.iconImage || "fa fa-info-circle fa-2x";
    params.bodyTxt = params.bodyTxt || "Continue?";
    params.cancelTxt = params.cancelTxt || "Cancel";
    params.continueTxt = params.continueTxt || "Continue";

    /*    angular.element(document).ready(function () {
    centerViewBySelector("#pmapConfirmationCalloutID");
    //TODO: Not have callout visible till now
    });*/

    /**
    * Based on permissions, if save button should be enabled or disabled
    * continueNeeded is an array of strings with the properties to check for within permissions
    * See components/confirmation.js for documentation
    */
    $scope.isButtonEnabled = function (list, propArr) {
        return sharedUses.permissionIsEnabled(list, propArr);
    };

    /**
    * When cancel is pressed and user has the permission to press cancel.
    * Will close the callout first
    * Will then do 1 of 4 things:
    *  1. Call the function the user defined in cancelFunction as a string & pass the params passed as well.
    *  2. Call the controller in cancelCtrl the user defined as a string
    *  3. Call the service & method in cancelService the user defined as an object of 2 strings, 1 service name 1 method name
    *  4. Nothing. The callout will just close
    *  NOTE: Can not have both function & ctrl properties defined as only 1 will be called
    */
    $scope.cancelBtn = function () {
        ngDialog.closeAll();
        if (typeof this.params.cancelFunction != 'undefined') {//if cancelFunction property is set when cancel is pressed the function defined as a string will be called
            var fn = window[params.cancelFunction];
            if (typeof fn === 'function') {
                fn(params.cancelParams);
            }
        }
        else if (typeof this.params.cancelCtrl != 'undefined') {//if cancelCtrl property is set when cancel is called the controller will be called: need to have the path defined on the homeApp config
            if ((typeof params.cancelFactory !== 'undefined') && (typeof params.cancelParams !== 'undefined')) {
                globalFactory[params.cancelFactory] = params.cancelParams; //used for if any data need to be transferred to the new controller
            }
            $location.path(this.params.cancelCtrl);
        }
        else if (typeof this.params.cancelService != 'undefined') {
            $injector.get(this.params.cancelService.service)[this.params.cancelService.method](this.params.cancelParams);
        }
    };

    /**
    * When continue is pressed and user has the permission to press continue.
    * Will close the callout first
    * Will then do 1 of 4 things:
    *  1. Call the function the user defined in continueFunction as a string & pass the params passed as well.
    *  2. Call the controller the user defined in continueCtrl as a string
    *  3. Call the service & method in continueService the user defined as an object of 2 strings, 1 service name 1 method name
    *  4. Nothing. The callout will just close
    *  NOTE: Can not have both function & ctrl properties defined as only 1 will be called
    */
    $scope.continueBtn = function () {
        ngDialog.closeAll();
        if (typeof params.continueFunction != 'undefined') {//if continueFunction property is set when continue is pressed the function defined as a string will be called
            var fn = window[params.continueFunction];
            if (typeof fn === 'function') {
                fn(params.continueParams);
            }
        }
        else if (typeof this.params.continueCtrl != 'undefined') {//if continueCtrl property is set when continue is called the controller will be called: need to have the path defined on the homeApp config
            if ((typeof params.continueFactory !== 'undefined') && (typeof params.continueParams !== 'undefined')) {
                globalFactory[params.continueFactory] = params.continueParams; //used for if any data need to be transferred to the new controller
            }
            $location.path(this.params.continueCtrl);
        }
        else if (typeof this.params.continueService != 'undefined') {
            $injector.get(this.params.continueService.service)[this.params.continueService.method](this.params.continueParams);
        }
        else if (typeof this.params.continueBack != 'undefined') {
            //routeBack(this.params.continueBack);
            console.log('undefined');
        }
    };

    /**
    * Function that will be called that will show the user a message when he/she does not have permission
    * to press a specific button
    */
    $scope.permissionDenied = function () {
        toast.preset("permission-denied");
    };
});