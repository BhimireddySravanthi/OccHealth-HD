/*
* This directive will be used as a loading overlay while the app renders.
* */

(function(){
    angular.module("app")
        .directive("loadingOverlay", loadingOverlay);

    function loadingOverlay(){
        return{
            restrict: "E",
            templateUrl: "/App_Scripts/Angular/loading-overlay-directive/loading-overlay-dir.html",
            scope:{
                showLoadingOverlay:"="
            },
            link: function(scope, ele, attr){

                //$("body").addClass("preventScrolling");
            }
        }
    }
})();