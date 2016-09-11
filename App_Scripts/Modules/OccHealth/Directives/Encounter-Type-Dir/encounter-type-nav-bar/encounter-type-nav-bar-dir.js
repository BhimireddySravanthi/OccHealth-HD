(function () {
    angular.module("app")
        .directive("encounterTypeNavBarDir", encounterTypeNavBarDir);

    function encounterTypeNavBarDir() {
        return {
            restrict: "AE",
            templateUrl: "/App_Scripts/Modules/OccHealth/Directives/Encounter-Type-Dir/encounter-type-nav-bar/encounter-type-nav-bar-template.html",
            scope: {
                encounterTypeNavBarOptions: "="
            },
            controller: function ($scope, sharedservices, globalobject, $filter, translations, $location) {

                //debugger;
                $scope.encounterTypeActions = [
                    {
                        name: $filter('translate')('btnAttachment'),
                        screenId: 2002,
                        url: "/App_Scripts/Shared/FileService/attachment.html"
                    },
                    {
                        name: $filter('translate')('btnActionItem'),
                        screenId: 2001,
                        url: "/OccHealth/Encounters/action-item-form.html"
                    }
                ];

                var updateFormIds = function () {

                    if ($scope.encounterTypeNavBarOptions !== undefined) {

                        globalobject.encounterTypes.encounterDetails.detailsFormId = $scope.encounterTypeNavBarOptions.detailsFormId;
                        globalobject.encounterTypes.encounterDetails.resultsFormId = $scope.encounterTypeNavBarOptions.resultsFormId;
                        globalobject.encounterTypes.encounterDetails.investigationFormId = $scope.encounterTypeNavBarOptions.investigationFormId;
                        globalobject.encounterTypes.encounterDetails.hearingResultsHistoryFormId = $scope.encounterTypeNavBarOptions.hearingResultsHistoryFormId;
                        globalobject.encounterTypes.encounterDetails.recordkeepingFormId = $scope.encounterTypeNavBarOptions.recordkeepingFormId;
                        globalobject.encounterTypes.encounterDetails.nextStepsFormId = $scope.encounterTypeNavBarOptions.nextStepsFormId;
                    }

                };

                $scope.CreatedBy = 0;
                updateFormIds();

                $scope.changeSubView = sharedservices.changeSubView;

                $scope.globalobject = globalobject;
                globalobject.currentPage == "Medical Profile" ? $scope.isMedicalProfile = true : $scope.isMedicalProfile = false;


                $scope.IsVisitorTab = function () {

                    if (globalobject.currentEncounter.EmployeePK == null || globalobject.currentEncounter.EmployeePK == 0 || globalobject.currentEncounter.PersonnelTypeID == 1003)
                        return false;

                    return true;
                }

                $scope.DisableAllForms = function () {

                    $scope.globalobject.encounterTypes.encounterDetails.showDetailsForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;


                }

                $scope.RedirectForm = function (FormID) {

                    if (globalobject.currentEncounter.FromSOAListScreen == true) {
                        $location.path(FormID);
                    }
                    else {
                        $scope.changeSubView(FormID);
                    }
                }

                $scope.showDetails = function () {
                    // get/set data with globalobject
                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.detailsFormId);

                };

                if (globalobject.encounterTypes.encounterDetails.detailsFormId == 1018) {

                    $scope.encounterTypeActions.splice(0, 1);
                }

                if (!($scope.$parent.funPermissionCheck(450018, 'SelfOthers', globalobject.currentSession.userid))) {

                    $scope.encounterTypeActions.splice(1, 1);
                }

                $scope.showResults = function () {
                    // get/set data with globalobject

                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsForm = true;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.resultsFormId);
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                };



                $scope.showInvestigation = function () {
                    // get/set data with globalobject

                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showInvestigationForm = true;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.investigationFormId);


                };

                $scope.showHearingResultsHistory = function () {

                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = true;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.hearingResultsHistoryFormId);
                }

                $scope.showRecordkeeping = function () {

                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.recordkeepingFormId);

                }

                $scope.showNextSteps = function () {

                    $scope.DisableAllForms();
                    $scope.globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showNextStepsForm = true;
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
                    globalobject.resultsSaved = true;
                    $scope.RedirectForm(globalobject.encounterTypes.encounterDetails.nextStepsFormId);


                }

                $scope.IsDetailsSaved = function () {


                    if (globalobject.currentEncounter.EncounterTypeID == "1000" || globalobject.currentEncounter.EncounterTypeID == "1001" || globalobject.currentEncounter.EncounterTypeID == "1020") {

                        if (globalobject.currentEncounter.ExposureEncounterSummaryID == 0) { return false; }
                        else { return true; }
                    }
                    return true;

                }

                $scope.showAddButton = function(){
                    
                        if (globalobject.currentEncounter.ExposureEncounterSummaryID == 0)
                             return false;
                        else
                             return true;
                }

                $scope.IsNotULL = function () {
                    if (globalobject.currentEncounter.EncounterTypeID == "1000") { return true; }
                    else return false;
                }
                $scope.IsResultsSaved = function () {
                    return globalobject.resultsSaved;
                }



                $scope.addItems = function (action) {
                    //                    debugger;
                    var ran = Math.random();
                    if (action.name == $filter('translate')('btnActionItem')) {
                        $scope.globalobject.actionItem.aiID = 0;
                    }
                    if (action.name == $filter('translate')('btnAttachment')) {
                        $scope.attachmentConfig = $scope.$parent.Attachmentconfigs;
                        $scope.attachmentConfig.Attachments = _.where($scope.$parent.EncounterTypeAttachment, { Id: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID) });
                        $scope.attachmentConfig.AttachmentType = 'EncounterType';
                        $scope.attachmentConfig.ID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.attachmentConfig.saveService.data.ID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.attachmentConfig.saveService.data.DocType = 'EncounterType';
                        $scope.attachmentConfig.deleteService.data.ID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.attachmentConfig.deleteService.data.DocType = 'EncounterType';
                        $scope.attachmentConfig.getServiceConfig.data.ID = globalobject.currentEncounter.EncounterDetailID;
                        $scope.attachmentConfig.getServiceConfig.data.DocType = 'EncounterType';

                    }
                    $scope.globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                    $scope.globalobject.encounterTypes.encounterDetails.showDetailsForm = false;

                    globalobject.encounterTypes.encounterDetails.encounterTypeActionTitle = action.name;
                    globalobject.encounterTypes.encounterDetails.contentUrl = action.url + "?r=" + ran;
                    $scope.changeSubView(action.screenId);
                };

                // CLOSE SUBVIEW FUNCTION
                $scope.closeSubView = function () {
                    // console.log( globalobject.encounterTypes.medicalProfile.currentAccordionViewId );
                    $scope.changeSubView(globalobject.encounterTypes.medicalProfile.currentAccordionViewId);
                };


                // Method will determine if the investigation and result button should be displayed on the nav bar.

                $scope.resetForm = function () {
                    $scope.globalobject.ShowBLL = false;
                    $scope.globalobject.ShowULL = false;
                    $scope.globalobject.ShowAudiometric = false;
                    $scope.globalobject.ShowOther = false;
                }
                var setShowNavBarButtons = function () {

                    if (globalobject.currentEncounter.EncounterTypeID != undefined) {
                        switch (globalobject.currentEncounter.EncounterTypeID.toString()) {
                            case '1000':
                                $scope.resetForm();
                                $scope.globalobject.ShowBLL = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showResultsButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showResultsButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showInvestigationButton = true;

                                break;
                            case '1001':
                                $scope.resetForm();
                                $scope.globalobject.ShowULL = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showResultsButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showResultsButton = true;

                                break;
                            case '1020':
                                $scope.resetForm();
                                $scope.globalobject.ShowAudiometric = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showResultsButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showRecordkeepingButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showNextStepsButton = true;
                                $scope.globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryButton = true;

                                break;
                            default:
                                $scope.resetForm();
                                $scope.globalobject.ShowOther = true;
                                break
                        }
                    }

                    else {
                        $scope.resetForm();
                        $scope.globalobject.ShowOther = true;
                    }

                };

                setShowNavBarButtons();



            }
        }
    }
})();
