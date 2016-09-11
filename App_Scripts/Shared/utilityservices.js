angular.module("app")
    .service("utilityservices", ["$modal", "$filter", "toastr",
    function ($modal, $filter, toastr) {
        //confirm 
        this.confirm = function (scope) {

            $modal.open({
                animation: true,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'confirmationCtrl',
                size: 'sm',
                scope: scope
            });
        }

        this.notify = function (type, msg, notificheader) {
            var header = notificheader || "";
            switch (type) {
                case "success":
                    toastr.success(msg, header);
                    break;

                //                case "error":      
                //                    toastr.error(msg, header);      
                //                    break;      

                case "warning":
                    toastr.warning(msg, header);
                    break;

                case "info":
                    toastr.info(msg, header);
                    break;

                case "network-error":
                    toastr.error("Network Error.", header);
                    break;

                case "required":
                    toastr.warning($filter('translate')('msgRequiredfieldmustbecompleted'));
                    break;

                case "saved":
                    toastr.success($filter('translate')('msgSavedSuccessfully'));
                    break;

                case "Delete":
                    toastr.success($filter('translate')('msgDeletedSuccessfully'));
                    break;

                case "error":
                    toastr.error($filter('translate')('msgSeriveerror'));
                    break;

                case "numbers":
                    toastr.error($filter('translate')('msgPleaseEnterOnlyNumber'));
                    break;
                case "decimal":
                    toastr.error($filter('translate')('msgPleaseEnterAValidNumber'));
                    break;

                default:
                    toastr.info(msg, header);
                    break;
            }
        }


        this.GetCustomKeyValue = function (moduleID, keyName) {
            var result = "";
            $.ajax
            ({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/WebServices/Common/UtilityService.asmx/GetCustomKeyValue",
                data: "{moduleId: '" + moduleID + "', keyName: '" + keyName + "'}",
                async: false,
                success: function (data) {
                    if (data.d.IsOK) {
                        result = data.d.Object;
                    }
                }
            });

            return result;
        }
        this.ValidateField = function (value) {
            if (value == null || value == '' || value == undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        this.CheckUndefineAndNull = function (value) {
            if (value == null || value == undefined) {
                return true;
            }
            else {
                return false;
            }
        }
    } ]);