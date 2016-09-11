//dependent modules to be injected 
angular.module("app",
    [
        "ngRoute",
        "ui.bootstrap",
        "angular.filter",
        "angularUtils.directives.dirPagination",
        "datePicker",
        "ui.select",
        "ngSanitize",
        "ngAnimate",
        "toastr",
        "tmh.dynamicLocale",
        "angularMoment",
        //"toggle-switch"
        "frapontillo.bootstrap-switch"
    ])

    .config(function (uiSelectConfig) {
        // Theme setting for ui.select
        // Theme options: "bootstrap", "select2" or "selectize"
        // https://github.com/angular-ui/ui-select
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.resetSearchInput = true;
        // uiSelectConfig.appendToBody = true;
    });