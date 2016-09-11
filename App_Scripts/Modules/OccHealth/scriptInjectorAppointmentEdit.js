var files = '';



// JQUERY 1.11.3
files = files + ' <script src="/App_Scripts/Bootstrap/js/jquery-1.11.3.min.js"></script>';
// BOOTSTRAP JS
files = files + ' <script src="/App_Scripts/Bootstrap/js/bootstrap.min.js"></script>';
// MOMENTJS
files = files + ' <script src="/App_Scripts/momentjs/moment.min.js"></script>';
//files = files + ' <script src="/App_Scripts/momentjs/moment-timezone.min.js"></script>';
files = files + ' <script src="/App_Scripts/momentjs/moment-timezone.js"></script>';

//Angular files
files = files + ' <script src="/App_Scripts/Angular/v/1.2.28/angular.min.js"></script>';
//files = files + ' <script src="/App_Scripts/Angular/v/1.4.3/angular.js"></script>';
files = files + ' <script src="/App_Scripts/Angular/v/1.2.28/angular-route.min.js"></script>';
files = files + ' <script src="/App_Scripts/Angular/v/1.2.28/angular-animate.min.js"></script>';
files = files + ' <script src="/App_Scripts/Angular/v/1.2.28/angular-sanitize.min.js"></script>';

// UI-SELECT (Picklist plugin, requires ng-sanitize)
files = files + ' <link rel="stylesheet" href="/App_Scripts/Angular/ui-select/select.min.css">';
files = files + ' <script src="/App_Scripts/Angular/ui-select/select.min.js"></script>';

//ANGULAR DATEPICKER
files = files + ' <script src="/App_Scripts/momentjs/angular-moment.js"></script>';
files = files + ' <script src="/App_Scripts/Angular/angular-datepicker/dist/angulardatepicker.js"></script>';
//files = files + ' <link rel="stylesheet" href="/App_Scripts/Angular/angular-datepicker/dist/angulardatepicker.css">';
//files = files + ' <script src="/App_Scripts/Angular/angular-datepicker/dist/index.min.js"></script>';
files = files + ' <link rel="stylesheet" href="/App_Scripts/Angular/angular-datepicker/dist/index.min.css">';

//localization
//files = files + ' <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.4.4/angular-locale_aa-dj.js"></script>';

//ANGULAR LOCALIZATION
files = files + ' <script src="/App_Scripts/Angular/Angular-Dynamic-Locale/tmhDynamicLocale.min.js"></script>';

// IE10 viewport hack for Surface/desktop Windows 8 bug
files = files + ' <script src="/App_Scripts/Bootstrap/js/ie10-viewport-bug-workaround.js"></script>';

// TOASTR
files = files + ' <link rel="stylesheet" href="/App_Scripts/Angular/angular-toastr/angular-toastr.min.css">';
files = files + ' <script src="/App_Scripts/Angular/angular-toastr/angular-toastr.js"></script>';

// ANGULAR BOOTSTRAP UI
files = files + ' <script src="/App_Scripts/Angular/ui-bootstrap/ui-bootstrap-0.12.0.min.js"></script>';
files = files + ' <script src="/App_Scripts/Angular/ui-bootstrap/ui-bootstrap-tpls-0.12.0.min.js"></script>';
//Angular Filter Module
files = files + '<script src="/App_Scripts/Angular/angularfilter/angular-filter.min.js"></script>'
 
//Angular Pagination
files = files + ' <script src="/App_Scripts/Angular/angularpagination/dirPagination.js" ></script>'
//App and Configs
files = files + ' <script src="/App_Scripts/App/pmapApp.js"></script>';
files = files + ' <script src="/App_Scripts/App/pmapAppRoutes.js"></script>';
files = files + ' <script src="/App_Scripts/Shared/sharedservices.js"></script>';
//files = files + ' <script src="/App_Scripts/Shared/employeeSearch.js"></script>';
files = files + ' <script src="/App_Scripts/Shared/controllers.js"></script>';
files = files + ' <script src="/App_Scripts/Shared/filters.js"></script>';
files = files + ' <script src="/App_Scripts/Shared/utilityservices.js"></script>';
//controllers
files = files + ' <script src="/App_Scripts/Modules/OccHealth/Controllers/occupationalHealthBase.js"></script>';
//files = files + ' <script src="/App_Scripts/Modules/OccHealth/Controllers/appointmentCentral.js"></script>';
files = files + ' <script src="/App_Scripts/Modules/OccHealth/Controllers/addWizard.js"></script>';

//files = files + ' <script src="/App_Scripts/Modules/OccHealth/Controllers/employeeDetails.js"></script>';


//Directives
files = files + ' <script src="/App_Scripts/Angular/loading-overlay-directive/loading-overlay-dir.js"></script>';
files = files + ' <script src="/App_Scripts/Modules/OccHealth/Directives/Encounter-Type-Dir/encounter-type-nav-bar/encounter-type-nav-bar-dir.js"></script>';
files = files + '<script type="text/javascript" src="/App_Scripts/jquery.form.js"></script>'
files = files + ' <script src="/App_Scripts/Modules/OccHealth/Directives/Encounter-Details-Dir/encounter-details-attachments/encounter-details-attachments-dir.js"></script>';

//ANGULAR BOOTSTRAP SWITCH
// http://www.bootstrap-switch.org/options.html
files = files + ' <link rel="stylesheet" href="/App_Scripts/Angular/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css">';
files = files + ' <script src="/App_Scripts/Angular/bootstrap-switch/dist/js/bootstrap-switch.js"></script>';
//files = files + ' <script src="/App_Scripts/Angular/bootstrap-switch/dist/js/angular-toggle-switch.min.js"></script>';

// ANGULAR-DIRECTIVE BOOTSTRAP SWITCH
// https://github.com/frapontillo/angular-bootstrap-switch
// scope apply was added to the un-minified version.
files = files + ' <script src="/App_Scripts/Angular/angular-bootstrap-switch/dist/angular-bootstrap-switch.js"></script>';

// OCC HEALTH MAIN JS
files = files + ' <script src="/App_Scripts/Bootstrap/js/occ-health.js"></script>';

document.write(files);
