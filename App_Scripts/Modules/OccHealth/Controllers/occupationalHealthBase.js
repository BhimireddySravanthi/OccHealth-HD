angular.module("app")
    .config(function (tmhDynamicLocaleProvider) {
        //Specify the path where our language js files are
        tmhDynamicLocaleProvider.localeLocationPattern("/App_Scripts/Angular/angular-locales-i18n/angular-locale_{{locale}}.js")

    })
    .controller("occHealthBase", ["$log", "$scope", "$location", "sharedservices", "translations", "globalobject", "tmhDynamicLocale", function ($log, $scope, $location, sharedservices, translations, globalobject, tmhDynamicLocale) {
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
            'FromAccordion': false,
            'IsResult': true,
            'IsInvestigation': true,
            'EncounterTypeID': 0
        };
        globalobject.SupervisorPermission = 0;
        globalobject.employee = {};
        globalobject.employeesSelectedList = [];
        globalobject.AppointmentDate = "";
        globalobject.currentPage = 'Appointment Central';

        globalobject.RedirectFrom = '';        
        globalobject.selectEmployeeStatus = { EmployeeStatus: "" };


        globalobject.PersonnelTypeID = 0;

        globalobject.PersonnelTypeName = '';

        globalobject.encounterTypes = {
            encounterDetails: {
                detailsFormId: null,
                resultsFormId: null,
                investigationFormId: null,
                recordkeepingFormId: null,
                nextStepsFormId: null,
                showDetailsForm: true,
                showResultsForm: false,
                showInvestigationForm: false,
                showDetailsButton: true,
                showResultsButton: false,
                showInvestigationButton: false,
                contentUrl: "",
                encounterTypeActionTitle: "",
                hearingResultsHistoryFormId: null,
                showHearingResultsHistoryForm: false,
                showRecordkeepingForm: false,
                showNextStepsForm: false,
                showResultsHistoryForm: false,
                // Method is used to reset navbar to default whenever a new encounter type is selected.
                resetNavBar: function () {
                    this.showDetailsForm = true;
                    this.showResultsForm = false;
                    this.showInvestigationForm = false;
                    this.showHearingResultsHistoryForm = false;
                    this.showRecordkeepingForm = false;
                    this.showNextStepsForm = false;
                    this.showResultsHistoryForm = false;
                },
                currentAccordionViewId: ''
            },
            medicalProfile: {
                currentAccordionViewId: ''
            }
        };

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
                        $scope.GetTranslations();
                    }
                })
                .error(function () {
                    $scope.GetTranslations();
                })
        }
        $scope.GetUserSession();

        // Translation service
        $scope.GetTranslations = function () {
            configs = {
                url: "/WebServices/Common/UtilityService.asmx/GetTranslations",
                data: { ScreenID: '450045' }
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {

                translations.tags = data.d.Object;
                // Assigning localization.
                var locale = globalobject.currentSession.languageCode;

                tmhDynamicLocale.set(locale);

                $scope.loadScreenViews();

            })
            .error(function () {
                $scope.GetLookUpLists();
            })

        }

        // Get Screen Views
        $scope.loadScreenViews = function () {
            configs = {
                url: "/WebServices/Common/ScreenService.asmx/GetScreenViews"
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        globalobject.ScreenViewsList = data.d.Object;
                        $scope.GetLookUpLists();
                    }
                })
                .error(function () {
                    $scope.GetLookUpLists();
                })
        }


        // Set LookUp values
        $scope.GetLookUpLists = function () {
            configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetLookUpLists",
                data: { IsMobile: false }
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);
                    globalobject.AppointmentStatusList = data.d.Object.AppointmentStatusList;
                    globalobject.EncounterTypeList = data.d.Object.EncounterTypeList;
                    globalobject.HealthCareEntityList = data.d.Object.HealthCareEntityList;
                    globalobject.PersonnelTypeList = data.d.Object.PersonnelTypeList;
                    globalobject.VisitReasonList = data.d.Object.VisitReasonList;
                    globalobject.HealthcareProviderList = data.d.Object.HealthcareProviderList;
                    globalobject.VisiteTypeList = data.d.Object.VisiteTypeList;
                    globalobject.ContactMethodList = data.d.Object.ContactMethodList;
                    globalobject.ReasonCancellationList = data.d.Object.ReasonCancellationList;
                    globalobject.RemarksCodeList = data.d.Object.RemarksCodeList;
                    globalobject.LabList = data.d.Object.LabList;
                    globalobject.WorkShiftList = data.d.Object.WorkShiftList;
                    globalobject.SampleStatusList = data.d.Object.SampleStatusList;
                    globalobject.AnalysisMethodList = data.d.Object.AnalysisMethodList;
                    globalobject.UomtypeList = data.d.Object.UomtypeList;
                    globalobject.ResultPermissibleRangeList = data.d.Object.ResultPermissibleRangeList;
                    globalobject.TestTypeList = data.d.Object.TestTypeList;
                    globalobject.DispositionTypeList = data.d.Object.DispositionTypeList;
                    globalobject.EthnicityList = data.d.Object.EthnicityList;
                    globalobject.MedicationFrequencyList = data.d.Object.MedicationFrequencyList;
                    globalobject.MedicationRouteList = data.d.Object.MedicationRouteList;
                    globalobject.ActivityStatusList = data.d.Object.ActivityStatusList;
                    globalobject.DiagnosticMethodList = data.d.Object.DiagnosticMethodList;
                    globalobject.ImmunizationTypeList = data.d.Object.ImmunizationTypeList;
                    globalobject.InjectionSiteList = data.d.Object.InjectionSiteList;
                    globalobject.ExerciseDetailList = data.d.Object.ExerciseDetailList;
                    globalobject.ManufactureDetailList = data.d.Object.ManufactureDetailList;
                    globalobject.EquipmentTypeList = data.d.Object.EquipmentTypeList;
                    globalobject.EquipmentModelList = data.d.Object.EquipmentModelList;
                    globalobject.LiquidUOMList = data.d.Object.LiquidUOMList;
                    globalobject.TestPositionFrameList = data.d.Object.TestPositionFrameList;
                    globalobject.BodyPartSideList = data.d.Object.BodyPartSideList;
                    globalobject.PressureUOMList = data.d.Object.PressureUOMList;
                    globalobject.SpeedUOMList = data.d.Object.SpeedUOMList;
                    globalobject.HeightUOMList = data.d.Object.HeightUOMList;
                    globalobject.DensityUOMList = data.d.Object.DensityUOMList;
                    globalobject.FollowUpTypeList = data.d.Object.FollowUpTypeList;
                    globalobject.ExposureTypeList = data.d.Object.ExposureTypeList;
                    globalobject.FacilityAdminList = data.d.Object.FacilityAdminList;
                    globalobject.ProtectorDetailList = data.d.Object.ProtectorDetailList;
                    globalobject.TestReasonList = data.d.Object.TestReasonList;
                    globalobject.DeclinedReasonList = data.d.Object.DeclinedReasonList;
                    globalobject.TestResultList = data.d.Object.TestResultList;
                    globalobject.WeightUOMList = data.d.Object.WeightUOMList;
                    globalobject.EquipmentSizeList = data.d.Object.EquipmentSizeList;
                    globalobject.VisitCategoryList = data.d.Object.VisitCategoryList;
                    globalobject.CharacteristicsList = data.d.Object.CharacteristicsList;
                    globalobject.MonitoringTypeList = data.d.Object.MonitoringTypeList;
                    globalobject.RecordTypeList = data.d.Object.RecordTypeList;
                    globalobject.MachiningPositionList = data.d.Object.MachiningPositionList;
                    globalobject.ActivityPriorityList = data.d.Object.ActivityPriorityList;
                    globalobject.ExposureTypeAudiometricTestingList = data.d.Object.ExposureTypeAudiometricTestingList;
                    globalobject.ExposureTypeDrugAlcoholTestingList = data.d.Object.ExposureTypeDrugAlcoholTestingList;
                    globalobject.RouteAdministerImmunizationList = data.d.Object.RouteAdministerImmunizationList;
                    globalobject.RouteAdministerMedicationList = data.d.Object.RouteAdministerMedicationList;
                    globalobject.TestTypeSpirometryList = data.d.Object.TestTypeSpirometryList;
                    globalobject.TestTypeDrugAlcoholTestingList = data.d.Object.TestTypeDrugAlcoholTestingList;
                    globalobject.MonitoringTypeWorkSimulationList = data.d.Object.MonitoringTypeWorkSimulationList;
                    globalobject.MonitoringTypeBiometricsList = data.d.Object.MonitoringTypeBiometricsList;
                    globalobject.CommonUnitsOfMeasurementList = data.d.Object.CommonUnitsOfMeasurementList;
                    globalobject.TestTypeExtermalMedicalRecordsList = data.d.Object.TestTypeExtermalMedicalRecordsList;
                    globalobject.AttachmentTypeList = data.d.Object.AttachmentTypeList;
                    globalobject.WithoutFollowUpVisitReasonList = data.d.Object.WithoutFollowUpVisitReasonList;
                    globalobject.RescheduleReasonList = data.d.Object.RescheduleReasonList;
                    $scope.GetUserNamesList();
                })
                .error(function () {
                    $scope.GetUserNamesList();
                })
        }

        // Set LookUp values
        $scope.GetUserNamesList = function () {
            configs = {
                url: "/WebServices/Foundation/UserService.asmx/GetUserNamesList"
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);
                    globalobject.UserList = data.d.Object;
                    $scope.GetUserPermissionData();
                })
                .error(function () {
                    $scope.GetUserPermissionData();
                })
        }

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
                    changeScreen();

                })
                .error(function () {
                    changeScreen();
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
                if (qsParams == "SOAappointmentEdit") {
                    globalobject.currentEncounter.AppointmentDetailID = sharedservices.getURLParameter().appointmentDetailID;
                    globalobject.currentEncounter.screenType = 'appointment';
                    globalobject.currentEncounter.FromSOAListScreen = true;
                    $location.path("add/3");
                }
            }
            else {
                var qsParams = sharedservices.getURLParameter("screen");
                (qsParams.screen != null && qsParams.screen != undefined) ? screenPath = "/" + qsParams.screen : screenPath = "/appointmentcentral"
                if (qsParams.screen == "add") {
                    globalobject.currentEncounter.AppointmentDetailID = 0;
                    if (qsParams.screenType == "appointment") {
                        globalobject.currentEncounter.screenType = "appointment";
                    } else {
                        globalobject.currentEncounter.screenType = "encounter";
                    }
                }
                $location.path(screenPath);

            }
        };



    } ])
