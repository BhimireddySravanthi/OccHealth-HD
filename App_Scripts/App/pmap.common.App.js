(function () {
    var app = angular.module("App", ["ngDialog", "ngAnimate", "toaster", "ngProgress", "angular-datepicker"]);

    app.factory("commonService", function ($http) {
        var actionItemFactory = {};
        actionItemFactory.xhrService = function (configs) {
            var config = configs || {};
            config.header = configs.header || "application/json; charset=utf-8";
            config.method = configs.method || "POST";
            config.url = configs.url || null;
            config.data = configs.data || {};

            return $http(config);
        };


        actionItemFactory.getURLParameter = function (name) {// Function to get queryString Params.

            // var match = RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
            // return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            var i = 0, retObj = {}, pair = null, sPageURL = window.location.search.substring(1),
                qArr = sPageURL.split('&');

            for (i = 0; i < qArr.length; i++) {
                pair = qArr[i].split('=');
                retObj[pair[0]] = pair[1];
            };
            return retObj;
        };

        return actionItemFactory;
    });


    //-- custom filets ,need to move these to separate js file as count increases
    app.filter("jsDate", function () {
        return function (x) {
            return new Date(parseInt(x.substr(6))); //creates time interval from /Date(12341234)
        };
    });

    app.filter('translate', function ($log) {
        return function (item, translations) {
            var translation = (_.where(translations, { Field: item })[0]);
            return (translation) != undefined ? (translation.FieldTranslation == "" || translation.FieldTranslation == null) ? "[No Translation]" : translation.FieldTranslation : "[Tag Missing]";
        }
    });



    //    app.directive('pmapCustomValidator', function () {
    //        return {
    //            restrict: 'AE',
    //            scope: {
    //                configurations: '=validate'
    //            },
    //            template: function (scope, element, Attrs) {

    //                var template;
    //                scope.value = 0;
    //                angular.forEach(scope.configurations, function (object, index) {
    //                    if (object.IsMandatory == true) {
    //                     //   element.find(object.ControlName)
    //                        new RequiredFieldValidator("RequiredFieldValidator" + scope.value++, "group" + scope.value++, object.ControlName, "Please enter the Feild Value", "Static", ValidatorArray, false);
    //                    }
    //                });
    //            }

    //        };
    //        
    //    });

} ()
)
