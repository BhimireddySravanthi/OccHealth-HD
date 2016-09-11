angular.module("app")
    .config(function (tmhDynamicLocaleProvider) {
        //Specify the path where our language js files are
        tmhDynamicLocaleProvider.localeLocationPattern("/App_Scripts/Angular/angular-locales-i18n/angular-locale_{{locale}}.js")

    })
    .controller("LeaveMgmtBase", ["$log", "$scope", "$location", "sharedservices", "translations", "globalobject", "tmhDynamicLocale", function ($log, $scope, $location, sharedservices, translations, globalobject, tmhDynamicLocale) {
        //before screen change we can fetch global settings
        // globalobject.Permissions = {};
        var LocationID = (sharedservices.getURLParameter().LocationId != undefined && sharedservices.getURLParameter().LocationId != null) ? parseInt(sharedservices.getURLParameter().LocationId) : 0;

        globalobject.currentSession = {
            userid: null,
            language: '',
            username: '',
            languageCode: '',
            locationName: ''
            //languageCode: 'es-es'
        };


        globalobject.employee = {};
        globalobject.SupervisorPermission = 0;
        globalobject.currentEncounter = { 'AppointmentDetailID': 0,
            'PersonnelTypeID': 0,
            'screenType': '',
            'EncounterDetailID': 0,
            'EmployeePK': 0,
            'EmployeeID': 0,
            'ExposureEncounterSummaryID': 0,
            'SelectedEncounterTypeID': 0,
            'AppointmentEncounterTypeID': 0,
            'FromSOAListScreen': false,
            'IsResult': true,
            'IsInvestigation': true

        };
        globalobject.selectEmployeeStatus = { EmployeeStatus: "" };

        //        globalobject.encounterTypes = {
        //            encounterDetails: {
        //                detailsFormId: null,
        //                resultsFormId: null,
        //                investigationFormId: null,
        //                showDetailsForm: true,
        //                showResultsForm: false,
        //                showInvestigationForm: false,
        //                showDetailsButton: true,
        //                showResultsButton: false,
        //                showInvestigationButton: false,
        //                contentUrl: "",
        //                encounterTypeActionTitle: "",
        //                // Method is used to reset navbar to default whenever a new encounter type is selected.
        //                resetNavBar: function () {
        //                    this.showDetailsForm = true;
        //                    this.showResultsForm = false;
        //                    this.showInvestigationForm = false;
        //                },
        //                currentAccordionViewId: ''
        //            },
        //            medicalProfile: {
        //                currentAccordionViewId: ''
        //            }
        //        };

        //Get User Session
        $scope.GetUserSession = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetUserSession"
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        globalobject.currentSession.username = data.d.Object.FullName;
                        globalobject.currentSession.userid = data.d.Object.userID;
                        globalobject.currentSession.languageCode = data.d.Object.Language_Code;
                        globalobject.currentSession.locationName = data.d.Object.LocationName;
                        globalobject.currentSession.language = data.d.Object.Language;
                        $scope.GetLeaveLookUpLists();

                    }
                })
                .error(function () {
                    $log.log("error")
                })
        }
        $scope.GetUserSession();

        // Translation service
        $scope.GetTranslations = function () {
            configs = {
                url: "/WebServices/Common/UtilityService.asmx/GetTranslations",
                data: { ScreenID: '450078' }
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {

                translations.tags = data.d.Object;
                // Assigning localization.
                var locale = globalobject.currentSession.languageCode;

                tmhDynamicLocale.set(locale);
                //                $scope.GetUserNamesList();
                $scope.GetUserPermissionData();

                $log.log("success")
            })
            .error(function () {
                $log.log("error")
            })
        }

        // Set LookUp values
        $scope.GetLeaveLookUpLists = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/LeaveManagement/LeaveManagementService.asmx/GetLeaveLookUpLists",
                data: { IsMobile: false }
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);
                    globalobject.LeaveTypes = data.d.Object.LeaveTypes 

                    $scope.GetTranslations();
                    $log.log("success")
                })
                .error(function () {
                    $log.log("error")
                })
        }


        // Set LookUp values
        //            $scope.GetUserNamesList = function () {
        //            configs = {
        //                url: "/WebServices/Foundation/UserService.asmx/GetUserNamesList"
        //            };

        //            sharedservices.xhrService(configs)
        //                .success(function (data, status, headers, config) {
        //                    sharedservices.parseDates(data.d.Object);
        //                    globalobject.UserList = data.d.Object;
        //                    $scope.GetUserPermissionData();
        //                    $log.log("success")
        //                })
        //                .error(function () {
        //                    $log.log("error")
        //                })
        //        }


        // Set Permissions
        $scope.GetUserPermissionData = function () {
            configs = {
                url: "/WebServices/Foundation/FoundationService.asmx/GetUserPermissionData",
                data: { QuerystringLocationID: LocationID }


            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);
                    globalobject.Permissions = data.d.Object;
                    var hasPersonalAccess = (_.where(globalobject.Permissions, { AclID: 450067 })[0]).Any;
                    var hasReporteeAccess = (_.where(globalobject.Permissions, { AclID: 450068 })[0]).Any;
                    globalobject.SupervisorPermission = (hasPersonalAccess) ? (hasReporteeAccess ? 3 : 1) : (hasReporteeAccess ? 2 : 0);

                    // setTimeout(function () { changeScreen(); }, 5000);
                    changeScreen();
                    $log.log("success")
                })
                .error(function () {
                    $log.log("error")
                })

        }
        // Function to return particular Permission
        $scope.funPermissionCheck = function (AclID, PermissionType, CreatedBy) {
            var hasAcess = false;
            if (globalobject.Permissions !== undefined && globalobject.Permissions.length > 0) {
                var Permission = (_.where(globalobject.Permissions, { AclID: AclID })[0]);
                if (PermissionType == 'SelfOthers') {
                    if (CreatedBy == globalobject.currentSession.userid)
                        hasAcess = Permission.Self;
                    else
                        hasAcess = Permission.Others;
                }
                else
                    hasAcess = Permission[PermissionType];
            }

            return hasAcess;

        };


        //a screen changer function to be defined .
        changeScreen = function () {
            var screenPath = "";
            if (sharedservices.getURLParameter().fromscreen != undefined) {

                var qsParams = sharedservices.getURLParameter().fromscreen;
                if (qsParams == '' || qsParams == undefined) {
                    qsParams = null
                }
                globalobject.currentEncounter.FromSOAListScreen = true;
                $location.path(qsParams);
            }
            else {
                var qsParams = sharedservices.getURLParameter("screen");
                (qsParams.screen != null && qsParams.screen != undefined) ? screenPath = "/" + qsParams.screen : screenPath = qsParams
                $location.path(screenPath);

            }
        };
    } ])


   