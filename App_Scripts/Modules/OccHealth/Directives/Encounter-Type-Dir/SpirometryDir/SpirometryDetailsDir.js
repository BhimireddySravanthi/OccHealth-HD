(function () {
    angular.module("app")
        .directive("numberOnlyDir", ['toastr', '$filter', numberOnlyDir]);
    function numberOnlyDir(toastr, $filter) {
        return {
            restrict: "A",
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, attrs, controller) {
                var msg = $filter('translate')('msgPleaseEnterOnlyNumber');
                scope.$watch("model", function (newVal, oldVal) {
                    if (isNaN(newVal))
                        scope.model = oldVal;
                });
                element.keypress(function (e) {
                    if (element[0].value != undefined && element[0].value != null && element[0].value.length >= 9)
                        return false;
                    if ((e.which >= 48 && e.which <= 57)) {
                        return true;
                    }
                    else {
                        toastr.error(msg);
                        return false;
                    }
                });
            }
        };
    }


    angular.module("app")
        .directive("decimalNumberOnlyDir", ['toastr', '$filter', decimalNumberOnlyDir]);
    function decimalNumberOnlyDir(toastr, $filter) {
        return {
            restrict: "A",
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, attrs, controller) {
                var msg = $filter('translate')('msgPleaseEnterOnlyNumber');
                scope.$watch("model", function (newVal, oldVal) {
                    if (isNaN(newVal)) {
                        toastr.error(msg);
                        scope.model = oldVal;
                    }
                    else if (parseFloat(newVal) > 999.99) {
                        scope.model = oldVal;
                    }
                });
                //                element.keypress(function (e) {
                //                    //console.log(e);
                //                    if (element[0].value.indexOf('.') != -1) {
                //                        var decimal = element[0].value.split('.');
                //                        if (decimal[1].length > 2)
                //                            return false;
                //                    }
                //                    else if (e.which != 46) {
                //                        if (element[0].value.length >= 3)
                //                            return false;
                //                    }



                //                    if ((e.which >= 48 && e.which <= 57))
                //                        return true;
                //                    else if ((e.which == 46)) {
                //                        if (element[0].value.indexOf('.') == -1)
                //                            return true;
                //                        else {
                //                            toastr.warning(msg);
                //                            return false;
                //                        }
                //                    }
                //                    else {
                //                        toastr.warning(msg);
                //                        return false;
                //                    }
                //                });

            }
        };
    }


})();