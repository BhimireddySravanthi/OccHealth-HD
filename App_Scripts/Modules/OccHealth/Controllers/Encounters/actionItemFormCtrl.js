angular.module("app")

        .controller("actionItemFormCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

            var vm = $scope;
            $scope.loadingTitle = "   loading ..";
            $scope.actionItemTitle = " New Action Item";
            $scope.toggleComplete = false;
            $scope.toggleSource = true;
            $scope.toggleCreate = true;
            $scope.toggleReveiw = false;
            $scope.toggleCostSection = false;
            $scope.toggleAttachmentSection = false;
            $scope.translations = [];
            $scope.configurations = [{ ControlID: 0, ControlName: "txtSourceID", IsReadOnly: false, IsMandatory: false, IsVisible: true }, { ControlID: 1, ControlName: "txtSourceTitle", IsReadOnly: false, IsMandatory: true, IsVisible: true}];
            $scope.PriorityOptions = [];
            $scope.StatusOptions = [];
            $scope.VerificationPerformedOptions = [];
            $scope.queryStringObj = {};
            $scope.ScreenID = "6057";
            $scope.locationID = 0;
            $scope.IsdataLoaded = false;

            $scope.UserList = [];
            if (globalobject.currentEncounter.FromAccordion == true || globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                $scope.showSubNavbars = false;
            }
            else
                $scope.showSubNavbars = true;

            $scope.queryStringObj = {
                aiID: "",
                aiSourceID: "",
                aiTaskType: "",
                aiLocationID: "0",
                aiMinDueDate: "",
                aiMaxDueDate: "",
                aiDueDate: ""
            };
            $scope.loadingAction = false;
            globalobject.currentEncounter.FromAccordion = false;
            $scope.IsVerified = function () {
                if ($scope.actionitem.Verified == 'No')
                { return false; }
                else return true;
            }

            $scope.isUpdatedActionItem = function () {
                return (($scope.actionitem.ActionItemID != 0) || ($scope.queryStringObj.aiID != '' && $scope.queryStringObj.aiID != null))
            };

            $scope.IsActionItemClosed = function () {
                return ($scope.actionitem.ActionItemStatus == "Closed")
            };

            $scope.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID

            $scope.title = "Action Items";

            $scope.markActionItemAsClosedForm = function (markAsClosed) {
                $scope.showMarkClosed = markAsClosed;
            };

            $scope.hideActionItem = globalobject.hideActionItem;

            $scope.actionitem = {
                StatusChangePermission: "Yes"
                            , DueDateExtensionPermission: "Yes"
                            , VerificationPermission: "Yes"
                            , AddPermission: "Yes"
                            , EditPermission: "Yes"
                            , DeletePermission: "Yes"
                            , ViewPermission: "Yes"
                            , SourceID: ""
                            , SourceType: ""
                            , SourceTitle: ""
                            , TaskType: ""
                            , RiskAssesment: ""
                            , RiskDescription: ""
                            , Riskfactor: ""
                            , ActionItemID: 0
                            , ActionItemTitle: ""
                            , CalendarCategory: ""
                            , EHSCAPAType: ""
                            , ActionItemDescription: ""
                            , ActionItemPriority: ""
                            , ActionItemDueDate: new Date()
                            , Owners: ""
                            , OwnersName: ""
                            , NotifyOwnersImmediately: ""
                            , AssignedByID: ""
                            , AssignedBy: ""
                            , ActionTaken: ""
                            , ActionItemStatus: ""
                            , CompletedByID: ""
                            , ActionItemCompletedBy: ""
                            , ActionItemCompletionDate: "1900-01-01"
                            , DueDateExtension: ""
                            , RequestedDueDateExtension: ""
                            , ReasonDueDateExtension: ""
                            , DueDateExtensionRequestApproved: ""
                            , ReasonNotDueDateExtension: ""
                            , VerifiedByID: ""
                            , Verified: ""
                            , VerificationPerformed: ""
                            , OnsiteWhen: ""
                            , VerificationComments: ""
                            , VerificationDate: "1900-01-01"
                            , VerifiedBy: ""
                            , ApproximateCost: ""
                            , EstimatedBudget: ""
                            , ActualCost: ""
                            , CreatedByName: ""
                            , CreatedDate: "1900-01-01"
                            , UpdatedByName: ""
                            , UpdatedDate: "1900-01-01"
                            , CreatedBy: 0

            };



            $scope.descripForm = function (strSource, strLength) {

                if ($scope.actionitem[strSource].length > strLength)
                    $scope.actionitem[strSource] = $scope.actionitem[strSource].substr(0, strLength);

            };

            var date = new Date();
            var timeNow = date.getHours() + ":" + date.getMinutes()

            $scope.Hour = timeNow.substring(0, 2);
            $scope.Minut = timeNow.substr(3, 2);
            date.setHours($scope.Hour);
            date.setMinutes($scope.Minut);

            $scope.ActionItemTime = date;
            $scope.actionitem.ActionItemDate = date;
            $scope.OwnerList = [];

            $scope.OwnerList.SelectedOwners = [];


            $scope.saveActionItemDetails = function () {
                var saveStatus = true;
                $scope.showLoadingOverlay = true;
                $scope.actionitem.ActionItemDueDate = new Date($scope.actionitem.ActionItemDueDate).toDateString();

                if ($scope.actionitem.ActionItemCompletionDate != null) {
                    $scope.actionitem.ActionItemCompletionDate = new Date($scope.actionitem.ActionItemCompletionDate).toDateString();
                }

                if ($scope.actionitem.VerificationDate != null) {
                    $scope.actionitem.VerificationDate = new Date($scope.actionitem.VerificationDate).toDateString();
                }
                //$scope.actionitem.RequestedDueDateExtension = new Date($scope.actionitem.RequestedDueDateExtension).toDateString(); // DueDate Extension not Implemented yet.

                $scope.actionitem.LocationID = parseInt($scope.locationID);

                if ($scope.actionitem.ActionItemStatus != "Closed") {
                    $scope.actionitem.ActionItemCompletionDate = null;
                    $scope.actionitem.CompletedByID = "";
                    $scope.actionitem.ActionItemCompletedBy = "";
                }


                if ($scope.actionitem.ActionItemTitle == ''
                || $scope.actionitem.ActionItemTitle == null
                || $scope.actionitem.ActionItemDescription == ''
                || $scope.actionitem.ActionItemDescription == null
                || $scope.actionitem.ActionItemDueDate == ''
                || $scope.actionitem.ActionItemDueDate == null
                || $scope.OwnerList.SelectedOwners == ''
                || ($scope.actionitem.ActionItemStatus == 'Closed' && ($scope.actionitem.ActionTaken == '' || $scope.actionitem.ActionTaken == null))
                || ($scope.actionitem.ActionItemStatus == 'Closed' && $scope.actionitem.CompletedByID == '')
                || ($scope.actionitem.ActionItemStatus == 'Closed' && ($scope.actionitem.ActionItemCompletionDate == '' || $scope.actionitem.ActionItemCompletionDate == null))
                || ($scope.actionitem.Verified == 'Yes' && ($scope.actionitem.VerifiedByID == '' || $scope.actionitem.VerifiedByID == null))
                || ($scope.actionitem.Verified == 'Yes' && ($scope.actionitem.VerificationDate == '' || $scope.actionitem.VerificationDate == null))) {
                    saveStatus = false;
                    $scope.loadingAction = false;
                    $scope.showLoadingOverlay = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if ((moment($scope.actionitem.ActionItemDueDate).isBefore(moment($scope.actionitem.aiMinDueDate)))) {
                    saveStatus = false;
                    $scope.loadingAction = false;
                    $scope.showLoadingOverlay = false;
                    msg = $filter('translate')('msgActionItemDueDateShouldbeGreaterthanAppointmentEncounterDate');

                }
                if ((moment($scope.actionitem.ActionItemCompletionDate).isBefore(moment($scope.actionitem.aiMinDueDate)))) {
                    saveStatus = false;
                    $scope.loadingAction = false;
                    $scope.showLoadingOverlay = false;
                    msg = $filter('translate')('msgActionItemCompletionDateShouldbeGreaterthanAppointmentEncounterDate');

                }


                if ($scope.actionitem.Verified == 'Yes' && ((moment($scope.actionitem.VerificationDate).isBefore(moment($scope.actionitem.aiMinDueDate))))) {
                    saveStatus = false;
                    $scope.loadingAction = false;
                    $scope.showLoadingOverlay = false;
                    msg = $filter('translate')('msgVerificationDateShouldbeGreaterthanAppointmentEncounterDate');

                }

                $scope.initValidator();

                if (saveStatus && !$scope.loadingAction) {
                    $scope.loadingAction = true;
                    $scope.actionitem.Owners = (angular.isArray($scope.OwnerList.SelectedOwners)) ? $scope.OwnerList.SelectedOwners.join() : $scope.OwnerList.SelectedOwners;
                    sharedservices.parseDates($scope.actionitem);

                    var configs = {
                        url: "../WebServices/Calendar/CalendarActionItemService.asmx/SaveCommonActionItemDetails",
                        data: { actionItem: $scope.actionitem }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }
                else {
                    saveStatus = true;
                    $scope.loadingAction = false;
                    $scope.showLoadingOverlay = false;
                    toastr.warning(msg);
                }
            }


            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {
                    $scope.actionitem.ActionItemID = data.d.Object.ActionItemID;
                    $scope.attachmentConfigsInit();
                    $scope.saveAttachments();

                    var configs = {
                        url: "../WebServices/Calendar/CalendarActionItemService.asmx/GetCommonActionItemDetails",
                        data: { EventID: data.d.Object.ActionItemID, ModuleSourceID: $scope.queryStringObj.aiSourceID, TaskType: $scope.queryStringObj.aiTaskType, ScreenID: $scope.ScreenID, QueryStringLocationID: $scope.queryStringObj.aiLocationID }
                    };

                    sharedservices.xhrService(configs)
                  .success(getDataSuccess)
                  .error(getDataError);

                    utilityservices.notify("saved");
                }

                $scope.loadingAction = false;
                $scope.showLoadingOverlay = false;
                $scope.frmActionItem.$dirty = false;
            };

            function saveDataError(data, status, headers, config) {

                $scope.loadingAction = false;
                $scope.showLoadingOverlay = false;
                utilityservices.notify("error");
            };

            $scope.getActionItemDetails = function () {
                $scope.showLoadingOverlay = true;
                angular.extend($scope.queryStringObj, globalobject.actionItem);
                sharedservices.parseDates($scope.queryStringObj);
                $scope.attachmentConfigsInit();
                if ($scope.isUpdatedActionItem()) {
                    var configs = {
                        url: "../WebServices/Calendar/CalendarActionItemService.asmx/GetCommonActionItemDetails",
                        data: { EventID: $scope.queryStringObj.aiID, ModuleSourceID: "", TaskType: $scope.queryStringObj.aiTaskType, ScreenID: $scope.ScreenID, QueryStringLocationID: $scope.queryStringObj.aiLocationID }
                    };
                }
                else {
                    var configs = {
                        url: "../WebServices/Calendar/CalendarActionItemService.asmx/GetCommonActionItemDetails",
                        data: { EventID: 0, ModuleSourceID: $scope.queryStringObj.aiSourceID, TaskType: $scope.queryStringObj.aiTaskType, ScreenID: $scope.ScreenID, QueryStringLocationID: $scope.queryStringObj.aiLocationID }
                    };
                }

                sharedservices.xhrService(configs)
                  .success(getDataSuccess)
                  .error(getDataError);

            };

            setTimeout(function () {
                $scope.getActionItemDetails();
            }, 100);


            function getDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    sharedservices.parseDates(data.d.Object.DM.ActionItem.Object);
                    $scope.OwnerList.SelectedOwners = JSON.parse("[" + data.d.Object.DM.ActionItem.Object.Owners.replace(/^,|,$/g, '') + "]");
                    sharedservices.parseDates(data.d.Object.Options.PriorityOptions.Object);
                    sharedservices.parseDates(data.d.Object.Options.StatusOptions.Object);
                    sharedservices.parseDates(data.d.Object.Options.VerificationPerformedOptions.Object);
                    $scope.actionitem = data.d.Object.DM.ActionItem.Object;
                    $scope.actionitem.TaskType = $scope.queryStringObj.aiTaskType;
                    translations.tags = translations.tags.concat(data.d.Object.LM.Translations.Object);
                    $scope.configurations = data.d.Object.DM.Configurations.Object;
                    $scope.PriorityOptions = data.d.Object.Options.PriorityOptions.Object;
                    $scope.StatusOptions = data.d.Object.Options.StatusOptions.Object;
                    $scope.VerificationPerformedOptions = data.d.Object.Options.VerificationPerformedOptions.Object;
                    $scope.CAPATypeOptions = data.d.Object.Options.CAPATypeOptions.Object;
                    $scope.OnSiteWhenOptions = data.d.Object.Options.OnSiteWhenOptions.Object;
                    $scope.RiskAssesmentOptions = data.d.Object.Options.RiskAssesmentOptions.Object;
                    $scope.locationID = $scope.actionitem.LocationID;
                    $scope.LoadUsersList();
                    $scope.LevelID = 0; // set to "0" As  in case of Null not Working in IE
                    $scope.IsdataLoaded = true;
                    $scope.actionitem.RequestedDueDateExtension = ((moment($scope.actionitem.RequestedDueDateExtension).isSame(moment("Jan 01, 0001"))) || ($scope.actionitem.RequestedDueDateExtension == null)) ? null : moment($scope.actionitem.RequestedDueDateExtension).format("MMMM DD,YYYY");
                    $scope.actionitem.VerificationDate = ((moment($scope.actionitem.VerificationDate).isSame(moment("Jan 01, 0001"))) || ($scope.actionitem.VerificationDate == null)) ? null : moment($scope.actionitem.VerificationDate).format("MMMM DD,YYYY");
                    $scope.actionitem.ActionItemDueDate = (moment($scope.actionitem.ActionItemDueDate).isSame(moment("Jan 01, 0001"))) ? null : moment($scope.actionitem.ActionItemDueDate).format("MMMM DD,YYYY");
                    $scope.actionitem.CurrentDate = moment($scope.actionitem.CurrentDate).format("MMMM DD,YYYY");
                    // For Initialising Due date From Query String
                    $scope.actionitem.ActionItemDueDate = ($scope.queryStringObj.aiDueDate != '' && $scope.queryStringObj.aiDueDate != null) ? moment($scope.queryStringObj.aiDueDate).format("MMMM DD,YYYY") : moment($scope.actionitem.ActionItemDueDate).format("MMMM DD,YYYY");
                    // $scope.actionitem.CreatedDate = (moment($scope.actionitem.CreatedDate).isSame(moment("Jan 01, 0001"))) ? null : moment($scope.actionitem.CreatedDate).format("MMMM DD,YYYY");
                    //$scope.actionitem.UpdatedDate = (moment($scope.actionitem.UpdatedDate).isSame(moment("Jan 01, 0001"))) ? null : moment($scope.actionitem.UpdatedDate).format("MMMM DD,YYYY");
                    $scope.actionitem.ActionItemCompletionDate = ((moment($scope.actionitem.ActionItemCompletionDate).isSame(moment("Jan 01, 0001"))) || ($scope.actionitem.ActionItemCompletionDate == null)) ? null : moment($scope.actionitem.ActionItemCompletionDate).format("MMMM DD,YYYY");

                    $('#hdnTxtOwner').val($scope.actionitem.Owners);
                    $('#hdnTxtAssignedBy').val($scope.actionitem.AssignedByID);
                    $('#hdnTxtActionItemCompleted').val($scope.actionitem.CompletedByID);
                    $('#Location_ID').val($scope.locationID);
                    $('#Level_ID').val($scope.LevelID);
                    $('#txtNames_SelectAssociateSamples').val($scope.actionitem.SelectAssociateSamples);
                    $('#hdnSampleIDs').val($scope.actionitem.SelectAssociateSampleID);
                    $('#hdnTxtVerify').val($scope.actionitem.VerifiedByID);
                    $('#txtDueDate1').val($scope.actionitem.ActionItemDueDate);
                    $('#txtVerificationDate1').val($scope.actionitem.VerificationDate);
                    $('#txtRequestedDueDateExtension1').val($scope.actionitem.RequestedDueDateExtension);
                    //  angular.element(document.querySelector('#txtDueDate1')).val($scope.actionitem.ActionItemDueDate);
                    if ($scope.actionitem.ActionItemStatus != "Closed") {
                        $scope.actionitem.CompletedByID = $scope.actionitem.UserID;
                        $scope.actionitem.ActionItemCompletedBy = $scope.actionitem.UserFullName;
                        $scope.actionitem.ActionItemCompletionDate = $scope.actionitem.CurrentDate;
                        //$scope.actionitem.ActionTaken = '';
                        $('#dtActionItemCompletedDate1').val($scope.actionitem.CurrentDate);
                        $('#hdnTxtActionItemCompleted').val($scope.actionitem.UserID);
                    }
                    if ($scope.actionitem.DueDateExtension != 'on') {

                        $scope.actionitem.RequestedDueDateExtension = null;
                        $scope.actionitem.ReasonNotDueDateExtension = '';
                    }
                    if ($('[id^="AdditionalSource"]').length == 0) {
                        $('#tblSourceCode tbody').append($scope.actionitem.AdditionalSource);
                    }

                    if ($scope.actionitem.TaskType.toUpperCase() == 'CHEMICAL') {
                        $scope.actionitem.SourceID = ($scope.queryStringObj.aiSourceID != '' && $scope.queryStringObj.aiSourceID != null) ? $scope.queryStringObj.aiSourceID : $scope.actionitem.SourceID;
                        $scope.GetRiskDetails();
                    }

                    //  $scope.initValidator('Get');
                    //                    $scope.$$childHead.sourceModel = $scope.actionitem;
                    //                    $scope.$$childHead.deleteAttachments();
                    //                    $scope.$$childHead.getAttachments();
                    $scope.$parent.loadActionItems();
                    $scope.attachmentConfigsInit();
                    $scope.ActionItemAttachment = $filter('filter')($scope.$parent.ActionItemAttachment, { Id: parseInt($scope.queryStringObj.aiID) });
                    $scope.showLoadingOverlay = false;
                }
            };

            function getDataError(data, status, headers, config) {
                console.log("call failed...");
                $scope.showLoadingOverlay = false;
            };
            $scope.getDropDownObject = function (dropdownName, dropdownObjList, requiredValue) {  // Generic function To set the Drop down Model on drop downs init/change and set corresponding action item property to save

                var dropdownObject = null;
                var selectedValue = angular.isString(requiredValue) ? requiredValue.replace(/^\s*/, '').replace(/\s*$/, '') : requiredValue;
                if ((dropdownObjList != undefined) && (dropdownObjList.length != 0)) {
                    var dropdownObject = dropdownObjList[0];
                    if (requiredValue != "" || selectedValue != 0) {
                        angular.forEach(dropdownObjList, function (object, index) {
                            if (selectedValue == object.Value)
                                dropdownObject = object;
                        });

                    }
                    $scope.actionitem[dropdownName] = dropdownObject.Value;

                }


                return dropdownObject;
            };

            $scope.dueDateProps = {
                format: 'MMMM dd, yyyy'
            };

            $scope.cancelActionItem = function () {

                if ($scope.frmActionItem.$dirty) {

                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/confirmation-modal.html',
                        controller: 'CancelModalCtrl',
                        size: 'sm',
                        scope: $scope
                    });
                }

                else {

                    if (globalobject.RedirectFrom == 'Encounter')
                        $location.path("/appointmentcentral");

                    else if (globalobject.RedirectFrom == 'EmployeeMedicalProfile')
                        $location.path("/employeemedicalprofile");     

                }
            }



            //-------Function for  configurations
            $scope.configureAttributes = function (attrName, configfeildName) {

                if ($scope.IsdataLoaded) {
                    var configuration = _.where($scope.configurations, { ControlName: configfeildName })[0];
                    // console.log(configfeildName + "-> " + configuration);
                    if ((attrName != '') && (configuration != undefined))
                        return configuration[attrName];
                    else
                        return configuration
                }

            };

            //-------Function to initialise Required feildValidator and Incase of save check Feild empty
            $scope.initValidator = function () {

                angular.forEach($scope.configurations, function (object, index) {
                    if (object.IsMandatory == true && object.IsVisible == true) {

                        //                        if (status != 'Save') {
                        //                            new RequiredFieldValidator("RequiredFieldValidator" + object.ControlName, "group" + object.ControlName, object.ControlName,"", "Static", ValidatorArray, false);
                        //                        }
                        //                        else {
                        if (($("#" + object.ControlName).val() == '')) { saveStatus = false; }
                        // }

                    }
                });
            };


            //----Function to Enable/Disable RequiredFieldValidator and IsMandatory/IsVisible depending on the Condition for a particular field
            $scope.validate = function (configfeildName, condition, attrName) {

                //                if (condition.toString != "") {
                //                    var configuration = _.where($scope.configurations, { ControlName: configfeildName })[0];

                //                    // Set configuration Properties depending on condition 
                //                    if ((attrName != '') && (configuration != undefined)) {
                //                        configuration[attrName] = condition;
                //                        angular.extend(configuration, $scope.configurations);

                //                        // Enable Disable Required Field Validator based on condition
                //                        var validateObject = _.where(ValidatorArray, { ID: "RequiredFieldValidator" + configfeildName })[0];
                //                        if (validateObject != undefined) {
                //                            if (condition == true)
                //                                validateObject.enable();
                //                            else
                //                                validateObject.disable();
                //                        }
                //                    }

                //                }

                if ($("#" + configfeildName).val() != '')
                    $('#' + configfeildName).css('background-color', '#FFFFFF');
                return 'inputValue'
            };

            // --------For Saving Translations
            $scope.translate = function (keyFeild) {

                if ($scope.IsdataLoaded) {
                    var translation = _.where($scope.translations, { Field: keyFeild })[0];
                    if (translation.FieldEditPermission) {

                        var params = {
                            iconImage: "fa fa-language fa-2x",
                            continueBack: 1,
                            bodyTxt: "",
                            cancelTxt: "Cancel", // $scope.actionItem.LeavePageDialog.LM.BtnLeft.Value,
                            continueTxt: "Contribute",  //$scope.actionItem.LeavePageDialog.LM.BtnRight.Value
                            object: translation
                        };

                        $scope.params = params;

                        ngDialog.open({
                            template: '/App_Scripts/shared/translation-callout/translation-callout.html',
                            controller: 'translationCtrl',
                            className: 'ngdialog-theme-plain',
                            scope: $scope
                        });
                    }
                }
            };


            $scope.attachmentConfigsInit = function () {

                $scope.ActionItemAttachment = $filter('filter')($scope.$parent.ActionItemAttachment, { Id: parseInt($scope.actionitem.ActionItemID) });
                $scope.attachmentConfig = $scope.$parent.Attachmentconfigs
                $scope.attachmentConfig.Attachments = $scope.ActionItemAttachment;
                $scope.attachmentConfig.AttachmentType = 'ActionItem';
                $scope.attachmentConfig.showUpload = false;
                $scope.attachmentConfig.ID = parseInt($scope.actionitem.ActionItemID);
                $scope.attachmentConfig.getServiceConfig.data.DocType = 'ActionItem';
                $scope.attachmentConfig.saveService = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                    data: { ID: $scope.actionitem.ActionItemID, DocumentIds: '', DocType: 'ActionItem' }
                };
                $scope.attachmentConfig.deleteService = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                    data: { ID: $scope.actionitem.ActionItemID, DocumentIds: '', DocType: 'ActionItem' }
                };


                // $scope.loadAttachments();
            }

            $scope.LoadUsersList = function () {

                var configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/LoadUserList",
                    data: { strLocationId: $scope.locationID, strLevelId: 0, strScopeYN: 'Yes', strACLIdList: '450021' }
                };

                sharedservices.xhrService(configs)
                        .success(getUserDataSuccess)
                        .error(getUserDataError);

            };

            function getUserDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    $scope.UserList = data.d.Object;
                }
            };

            function getUserDataError() {

                console.log("User service call failed...");
                $scope.showLoadingOverlay = false;
            }

        } ]);
