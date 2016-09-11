angular.module("app")
    .controller("ohEncounterDetails", [
        "$scope",
        "$location",
        "$timeout",
        "$routeParams",
        "sharedservices",
        "$modal",
        "utilityservices",
        "toastr",
        "globalobject",
        "$filter",
        "toastr",
        function ($scope, $location, $timeout, $routeParams, sharedservices, $modal, utilityservices, toastr, globalobject, $filter, toastr) {

            //  Fetch available Data from Global Object  *********************
            $scope.EncounterData = { selected: false, exists: false };
            $scope.AppointmentStatusList = globalobject.AppointmentStatusList;
            $scope.EncounterTypeList = globalobject.EncounterTypeList;
            angular.extend($scope.EncounterData, globalobject.currentEncounter);
            globalobject.currentPage = "Encounter Details";
            globalobject.currentEncounter.FromAccordion = false;
            globalobject.employee = {};
            //globalobject.RedirectFrom = '';
            globalobject.isDuplicate = 0;
            if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                globalobject.RedirectFrom = "EmployeeMedicalProfile";
                $scope.fromMedicalProfileLink = "Details";                
            }
            else if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfileResult') {
                globalobject.RedirectFrom = "EmployeeMedicalProfile";
                $scope.fromMedicalProfileLink = "Result";
            }
            else if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfileInvestigation') {
                globalobject.RedirectFrom = "EmployeeMedicalProfile";
                $scope.fromMedicalProfileLink = "Investigation";
            }
            else {
                $scope.fromMedicalProfileLink = "";
                globalobject.RedirectFrom = 'Encounter';
                globalobject.currentEncounter.screenType = "encounterDetails";
            }
            if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "yes") {
                $scope.AllowPastAppointmentandEncounters = true;
            }
            else {
                $scope.AllowPastAppointmentandEncounters = false;
            }
            $scope.clinicNotes = [];
            $scope.findEncounter = '';
            $scope.myDate = new Date();
            // Attachment initialisation
            $scope.EncounterAttachment = [];
            $scope.EncounterTypeAttachment = [];
            $scope.ClinicNotesAttachment = [];
            $scope.ActionItemAttachment = [];
            //These are used for Mandatory fields missing case
            $scope.IsLocationinfoMissed = false;
            $scope.IsDataLoaded = false;
            $scope.IsEmployeeinfoMissed = false;
            $scope.MandatoryFieldsMissed = false;
            $scope.VisitDate = new Date();
            $scope.UserID = globalobject.currentSession.userid;
            $scope.pastAppointment = false;
            $scope.MandatoryFields = "";
            $scope.currentEncounterTypeID = null;
            $scope.IsDepartmentMandatoryCheck = true;


            if ((utilityservices.GetCustomKeyValue('45', 'IsDepartmentMandatoryCheck')).toLowerCase() == 'no') {
                $scope.IsDepartmentMandatoryCheck = false;
            }

            if (globalobject.currentEncounter.EncounterDetailID > 0) {

                $scope.Attachmentconfigs = {
                    MaxFileSize: '',
                    ProhibitedFileExtensions: '',
                    LocationID: '',
                    AttachmentType: 'Encounter',
                    Module: 'OccHealth',
                    ID: globalobject.currentEncounter.EncounterDetailID,
                    Attachments: [],
                    showUpload: true,

                    getServiceConfig: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectAttachmentsByEncounterID",
                        data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, DocType: 'Encounter' }
                    },
                    saveService: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                        data: { ID: globalobject.currentEncounter.EncounterDetailID, DocumentIds: '', DocType: 'Encounter' }
                    },
                    deleteService: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                        data: { ID: globalobject.currentEncounter.EncounterDetailID, DocumentIds: '', DocType: 'Encounter' }
                    }
                };
            }
            $scope.LengthOfAttachments = 0;


            // LOAD AT THE TOP OF THE PAGE
            $('html, body').animate({ scrollTop: 0 }, 0);

            // SHOW SUB NAV-BARS
            $scope.showSubNavbars = true;


            // Function to Load selected or default view ******************
            $scope.changeSubView = sharedservices.changeSubView;



            // Function to Get the Selected Employee Details ******************
            $scope.bindSelectedEmployee = (function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeDetails",
                    data: { AppointmentDetailID: globalobject.currentEncounter.AppointmentDetailID, OccEmployeePk: globalobject.currentEncounter.EmployeePK }
                };
                sharedservices.xhrService(configs)
                    .then(function (response) {
                        sharedservices.parseDates(response.data.d.Object);
                        $scope.selectedEmployee = response.data.d.Object;
                        globalobject.employee = response.data.d.Object;
                        globalobject.currentEncounter.PersonnelTypeID = parseInt($scope.selectedEmployee.EmployeeType);
                        CheckMandatoryEmployeeFields();
                    });

            });


            if (globalobject.currentEncounter.AppointmentDetailID > 0) {
                $scope.bindSelectedEmployee();
            }
            else {
                $scope.selectedEmployee = globalobject.employee;
                globalobject.currentEncounter.PersonnelTypeID = parseInt($scope.selectedEmployee.EmployeeType);
                CheckMandatoryEmployeeFields();
            }

            function CheckMandatoryEmployeeFields() {
                switch (globalobject.currentEncounter.PersonnelTypeID) {
                    case 1001:
                        $scope.MandatoryFields = utilityservices.GetCustomKeyValue('45', 'EmployeeEncounterMandatoryFields').split(",");
                        CompareMandataryFields();
                        break;
                    case 1002:
                        $scope.MandatoryFields = utilityservices.GetCustomKeyValue('45', 'UnsupervisedContractEmployeeEncounterMandatoryFields').split(",");
                        CompareMandataryFields();
                        break;
                    case 1003:
                        $scope.MandatoryFields = utilityservices.GetCustomKeyValue('45', 'VisitorEncounterMandatoryFields').split(",");
                        CompareMandataryFields();
                        break;
                    case 1004:
                        $scope.MandatoryFields = utilityservices.GetCustomKeyValue('45', 'SupervisedContractEmployeeEncounterMandatoryFields').split(",");
                        CompareMandataryFields();
                        break;
                    default:
                        break;
                }
            }

            function CompareMandataryFields() {
                angular.forEach($scope.MandatoryFields, function (value, key) {
                    if ($scope.selectedEmployee[value] == undefined || $scope.selectedEmployee[value] == null || $scope.selectedEmployee[value] == "") {
                        $scope.IsEmployeeinfoMissed = true;
                        $scope.MandatoryFieldsMissed = true;
                        globalobject.currentEncounter.PersonnelTypeID = $scope.selectedEmployee.EmployeeType;
                        return;
                    }
                });
            }

            function checkPermissionforEditAppointment() {
                var today = new Date();
                var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                var AppointmentDate = new Date($scope.selectedAppointment.AppointmentDate);
                if (AppointmentDate.toString() != date.toString()) {
                    $scope.pastAppointment = true;
                }
                else {
                    $scope.pastAppointment = false;
                }
            }




            // Function to Get the Selected Appointment Details ******************
            $scope.getAppointmentDetails = function () {
                if ($scope.AllowPastAppointmentandEncounters) {
                    if (moment(globalobject.AppointmentDate).isBefore(moment($scope.myDate))) {

                        $scope.VisitDate = globalobject.AppointmentDate;
                    }
                } else {
                    $scope.VisitDate = $scope.VisitDate.toDateString();
                }
                var date = new Date();
                var timeNow = date.getHours() + ":" + date.getMinutes()
                var timeout = (date.getHours() + 1) > 23 ? 23 : (date.getHours() + 1) + ":" + date.getMinutes();

                var myDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                var AppointmentDate = new Date($scope.VisitDate);

                var caller = "Encounter";
                if (AppointmentDate.toDateString() == myDate.toDateString()) {
                    caller = "EncounterDetail";

                }


                var configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAppointmentDetails",
                    data: { AppointmentDetailID: globalobject.currentEncounter.AppointmentDetailID, Caller: caller, VisitDate: $scope.VisitDate, Timenow: timeNow, TimeOut: timeout }
                };
                sharedservices.xhrService(configs)
                    .then(function (response) {
                        sharedservices.parseDates(response.data.d.Object);
                        $scope.selectedAppointment = response.data.d.Object;
                        $scope.EncounterCreatedBy = $scope.selectedAppointment.EncounterCreatedBy;
                        // Condition checking for Editing appointment details. Past appointments can't be editable
                        checkPermissionforEditAppointment();
                        globalobject.currentEncounter.EncounterDetailID = $scope.selectedAppointment.EncounterDetailID;
                        if (($scope.IsDepartmentMandatoryCheck) && ($scope.selectedAppointment.LocationDepartment == null || $scope.selectedAppointment.LocationDepartment == "")) {
                            $scope.IsLocationinfoMissed = true;
                            $scope.MandatoryFieldsMissed = true;
                        }
                        if (globalobject.currentEncounter.EncounterDetailID > 0) {
                            $scope.getEncounterAccordians();
                        }

                    });

            };
            $scope.getAppointmentDetails();

            // Function to Get the Selected ACCORDIONS ******************
            $scope.getEncounterAccordians = function () {
                var configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectEncounterTypeByEncounterID",
                    data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: 0 }
                };
                sharedservices.xhrService(configs)
                    .then(function (response) {
                        $scope.selectedEncounterTypes = response.data.d.Object;
                        $scope.initialiseSelectedType();
                    });

            };



            //  Function to Get Action Items ******************

            $scope.actionItems = [];
            $scope.loadActionItems = function () {

                $scope.ActionObj = {
                    AdditionalFilter: "EncounterType:" + globalobject.currentEncounter.AppointmentEncounterTypeID
                   , strModules: "occupationalhealth"
                }
                var configs = {
                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/GetActionItemList",
                    data: { ActionObj: $scope.ActionObj }

                };
                sharedservices.xhrService(configs)
              .success(function (data, status, headers, config) {
                  sharedservices.parseDates(data.d.Object);
                  if (data.d.IsOK) {

                      $scope.actionItems = data.d.Object;

                  }
              })
            };





            // Function to Load default view ******************
            $scope.loadDefaultView = function () {
                var viewId = 1000;
                $scope.showLoadingOverlayEncounter = true;
                $scope.IsDataLoaded = false;
                // viewId = (globalobject.currentEncounter.SelectedEncounterTypeID == undefined || globalobject.currentEncounter.SelectedEncounterTypeID == 0) ? viewId : parseInt(globalobject.currentEncounter.SelectedEncounterTypeID); // Make first encounter type default
                var SelectedEncounter = (globalobject.currentEncounter.SelectedEncounterTypeID != undefined && globalobject.currentEncounter.SelectedEncounterTypeID != 0) ? _.where($scope.EncounterTypeList, { ID: parseInt(globalobject.currentEncounter.SelectedEncounterTypeID) })[0] : _.where($scope.EncounterTypeList, { selected: true })[0];
                viewId = SelectedEncounter.EncounterTypeID;
                globalobject.encounterTypes.encounterDetails.currentAccordionViewId = SelectedEncounter.ID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = SelectedEncounter.ExposureEncounterSummaryID;
                globalobject.currentEncounter.AppointmentEncounterTypeID = SelectedEncounter.AppointmentEncounterTypeID;
                globalobject.currentEncounter.EncounterTypeID = SelectedEncounter.EncounterTypeID;
                globalobject.currentEncounter.EncounterDetailDate = $scope.selectedAppointment.AppointmentDate;
                $scope.currentEncounterTypeID = SelectedEncounter.EncounterTypeID;
                if ($scope.fromMedicalProfileLink == "Result") {
                    if (globalobject.currentEncounter.SelectedEncounterTypeID == 1000) {
                        $scope.changeSubView(2004);
                    }
                    if (globalobject.currentEncounter.SelectedEncounterTypeID == 1001) {
                        $scope.changeSubView(2006);
                    }
                    if (globalobject.currentEncounter.SelectedEncounterTypeID == 1020) {
                        $scope.changeSubView(2020);
                    }
                }
                else if ($scope.fromMedicalProfileLink == "Investigation") { $scope.changeSubView(2005); }
                else {
                    sharedservices.changeSubView(viewId);
                    globalobject.encounterTypes.encounterDetails.currentAccordionViewId = viewId;
                }

                // Action Item object initialisation**************
                globalobject.actionItem = { aiID: 0, aiSourceID: globalobject.currentEncounter.AppointmentEncounterTypeID, aiTaskType: "occupationalhealth" }

                $scope.loadActionItems();
                $scope.showLoadingOverlayEncounter = false;
                $scope.IsDataLoaded = true;


            };


            // Function to Initialise Selected Encounter Type details ******************
            $scope.initialiseSelectedType = function () {

                angular.forEach($scope.EncounterTypeList, function (object, index) {
                    var selectedobject = [];
                    selectedobject = _.where($scope.selectedEncounterTypes, { EncounterTypeID: object.ID })[0];

                    $scope.EncounterTypeList[index].selected = (selectedobject != undefined) ? true : false;
                    $scope.EncounterTypeList[index].exists = (selectedobject != undefined) ? true : false;
                    $scope.EncounterTypeList[index].ExposureEncounterSummaryID = (selectedobject != undefined) ? selectedobject.ExposureEncounterSummaryID : 0;
                    $scope.EncounterTypeList[index].AppointmentEncounterTypeID = (selectedobject != undefined) ? selectedobject.AppointmentEncounterTypeID : 0;
                    $scope.EncounterTypeList[index].EncounterTypeID = (selectedobject != undefined) ? selectedobject.EncounterTypeID : $scope.EncounterTypeList[index].ID;
                    $scope.EncounterTypeList[index].EncounterDetailDate = $scope.selectedAppointment.AppointmentDate;

                });
                //setTimeout(function () { $scope.loadDefaultView(); }, 100);
                $scope.loadDefaultView();
            }


            // Function to Save Encounter Type details ******************
            $scope.saveEncounterTypeList = function () {
                var saveStatus = false;
                var SelectedIDs = _.where($scope.EncounterTypeList, { selected: true });
                var SaveEncounterTypes = (SelectedIDs.length > 0) ? _.where(SelectedIDs, { exists: false }) : []; // to check if Type alraedy exists for Encounter

                if (SaveEncounterTypes.length > 0) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveEncounterTypeByEncounterID",
                        data: { EncounterID: globalobject.currentEncounter.EncounterDetailID, EncounterTypes: _.pluck(SaveEncounterTypes, 'ID').join(",") }
                    };
                    sharedservices.xhrService(configs)
                    .then(function (response) {
                        sharedservices.parseDates(response.data.d.Object);
                        $scope.savedEncounterType = response.data.d.Object;
                        globalobject.isDuplicate = response.data.d.Object.isDuplicate;
                        $scope.msgEncounter = $filter('translate')('msgduplicateappointmentsencounterwithtime') + $scope.savedEncounterType.EncounterDate + ' ' + $filter('translate')('lblat') + ' ' + $scope.savedEncounterType.TimeInOut;
                        $scope.getEncounterAccordians();
                        $scope.deleteEncounterTypeList();
                    });
                }
                else
                    $scope.deleteEncounterTypeList();
            }



            // Function to Delete Encounter Type details ******************
            $scope.deleteEncounterTypeList = function () {

                var SelectedIDs = _.where($scope.EncounterTypeList, { selected: false });
                var deleteEncounterTypes = (SelectedIDs.length > 0) ? _.where(SelectedIDs, { exists: true }) : []; // to check if Type alraedy exists for Encounter

                if (deleteEncounterTypes.length > 0) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteEncounterType",
                        data: { AppointmentEncounterTypeID: _.pluck(deleteEncounterTypes, 'AppointmentEncounterTypeID').join(",") }
                    };
                    sharedservices.xhrService(configs)
                .then(function (response) {
                    $scope.deletdEncounterType = response.data.d.Object;
                    $scope.getEncounterAccordians();

                });
                }

                $scope.getEncounterAccordians();
                if (globalobject.isDuplicate) {
                    toastr.error($scope.msgEncounter, '', { timeOut: 10000 });
                }
                else
                    toastr.success($filter('translate')('msgSavedSuccessfully'));
            }


            // Function to to handle Encounter type events ******************
            $scope.encounterTypeAction = function (type) {
                showOtherField();

                //checkedEncounter[selected] = !(type.selected);
                if ($scope.editEncounterTypeList) {
                    if (type.selected) {
                        var selectedEncounter = _.where($scope.EncounterTypeList, { selected: true });
                        if ($scope.funPermissionCheck(450012, 'SelfOthers', $scope.EncounterCreatedBy)) {
                            if (selectedEncounter.length > 1) {
                                $scope.message = $filter('translate')('msgDeleteEncounterType');
                                $scope.item = type;

                                var modalInstance = $modal.open({
                                    animation: $scope.animationsEnabled,
                                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                                    controller: 'deleteEncounterTypeModalCtrl',
                                    size: 'sm',
                                    scope: $scope
                                });
                            }
                            else
                            { toastr.error($filter('translate')('msgEncountertypeismandatoryforanencounter')); }
                        }
                        else { toastr.error($filter('translate')('msgYouDontHavePermissionToDelete')); }
                    }
                    else {
                        if ($scope.funPermissionCheck(450010, 'SelfOthers', $scope.UserID)) {
                            type.selected = !type.selected;
                            angular.forEach($scope.EncounterTypeList, function (object, index) {
                                if (object.ID == type.ID)
                                    $scope.EncounterTypeList[index].selected = type.selected;
                                globalobject.encounterTypes.encounterDetails.currentAccordionViewId = type.ID;
                                globalobject.currentEncounter.ExposureEncounterSummaryID = type.ExposureEncounterSummaryID;
                                globalobject.currentEncounter.AppointmentEncounterTypeID = type.AppointmentEncounterTypeID;
                                globalobject.currentEncounter.EncounterTypeID = type.EncounterTypeID;
                                globalobject.currentEncounter.EncounterDetailDate = type.EncounterDetailDate;
                                globalobject.currentEncounter.SelectedEncounterTypeID = type.ID;
                                $scope.currentEncounterTypeID = type.ID;

                            });
                        }
                        else { toastr.error($filter('translate')('msgYouDontHavePermissionToAdd')); }

                    }
                    //angular.extend($scope.checkedEncounter, $scope.EncounterTypeList);

                }
                else {
                    globalobject.encounterTypes.encounterDetails.resetNavBar();

                    globalobject.encounterTypes.encounterDetails.currentAccordionViewId = type.ID;
                    globalobject.currentEncounter.ExposureEncounterSummaryID = type.ExposureEncounterSummaryID;
                    globalobject.currentEncounter.AppointmentEncounterTypeID = type.AppointmentEncounterTypeID;
                    globalobject.currentEncounter.EncounterTypeID = type.EncounterTypeID;
                    globalobject.currentEncounter.EncounterDetailDate = type.EncounterDetailDate;
                    globalobject.currentEncounter.SelectedEncounterTypeID = type.ID;
                    $scope.currentEncounterTypeID = type.ID;
                    globalobject.actionItem = { aiID: 0, aiSourceID: globalobject.currentEncounter.AppointmentEncounterTypeID, aiTaskType: "occupationalhealth" }
                    globalobject.RedirectFrom = 'Encounter';
                    $scope.changeSubView(type.ID);
                    $scope.loadActionItems();
                }
            }


            // Function to Get the Clinic Note List ******************
            $scope.loadClinicNotes = function () {
                var configs = {

                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectClinicNotesList",
                    data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       $scope.clinicNotes = data.d.Object;
                   }
               })
                  .error(function () {
                      toastr.warning($filter('translate')('msgSeriveerror'));
                  })

            };
            if (globalobject.currentEncounter.EncounterDetailID > 0) {

                $scope.loadClinicNotes();
            }


            // Function to Get Clinic Note details ******************
            $scope.gotoClinicNotesDetails = function (id) {

                globalobject.EncounterClinicNoteID = id;
                $scope.changeSubView(2000);
            }


            // Function to Delete Clinic Note ******************
            $scope.removeClinicNote = function (item, type) {

                $scope.message = $filter('translate')('msgDeleteClinicNotes');
                $scope.item = item;
                $scope.type = type;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteClinicNotesModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }


            $scope.editEncounterTypeList = false;
            $scope.toogleEditEncounterTypeList = function () {
                $scope.editEncounterTypeList = !$scope.editEncounterTypeList;

            }



            // Function to Get Action Item details ******************
            $scope.gotoActionItemDetails = function (obj) {

                globalobject.actionItem.aiID = obj.ID;
                globalobject.actionItem.aiSourceID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                globalobject.actionItem.aiTaskType = "occupationalhealth";
                $scope.showSubNavbars = false;
                globalobject.currentEncounter.FromAccordion = true;
                $scope.changeSubView(2001);
            }



            // **********************************************************************




            $scope.editEncounter = function (id) {

                globalobject.currentEncounter.screenType = "encounterDetails";

                $location.path("/add/2");
            };

            $scope.editEmployee = function () {
                if (globalobject.RedirectFrom == "") {
                    globalobject.RedirectFrom = "Encounter";
                }
                $location.path("/add");
            };

            $scope.currentListIndex = null;
            $scope.updateListIndex = function (index) {
                $scope.currentListIndex = index;
            };



            // ATTACHMENTS


            $scope.loadAttachments = function () {

                var configs = {

                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectAttachmentsByEncounterID",
                    data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, DocType: "" }
                };

                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);

                    if (data.d.IsOK) {

                        $scope.Attachmentconfigs.Attachments = (angular.isArray(data.d.Object.items)) ? data.d.Object.items : [];
                        $scope.EncounterAttachment = _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "Encounter" });
                        $scope.EncounterTypeAttachment = ($scope.funPermissionCheck(450013, 'SelfOthers', $scope.UserID)) ? _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "EncounterType" }) : [];
                        $scope.ClinicNotesAttachment = ($scope.funPermissionCheck(450065, 'Any', $scope.UserID)) ? _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "ClinicNote" }) : [];
                        $scope.ActionItemAttachment = ($scope.funPermissionCheck(450021, 'SelfOthers', $scope.UserID)) ? _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "ActionItem" }) : [];
                        $scope.Attachmentconfigs.MaxFileSize = data.d.Object.Configs.item.MaxFileSize;
                        $scope.Attachmentconfigs.ProhibitedFileExtensions = data.d.Object.Configs.item.ProhibitedFileExtensions;
                        $scope.Attachmentconfigs.LocationID = data.d.Object.Configs.item.LocationID;
                        $scope.attachmentConfig = $scope.Attachmentconfigs;

                        $scope.LengthOfAttachments = $scope.EncounterAttachment.length + $scope.EncounterTypeAttachment.length + $scope.ClinicNotesAttachment.length + $scope.ActionItemAttachment.length;
                        globalobject.AttachmentType = "";
                    }
                })
                .error(function () {
                    toastr.warning($filter('translate')('msgSeriveerror'));
                })
            };
            if (globalobject.currentEncounter.EncounterDetailID > 0) {
                $scope.loadAttachments();
            }

            $scope.attachmentIcon = sharedservices.attachmentIcon;

            // Function to Delete Attachment ******************

            $scope.deleteAttachment = function (item) {

                $scope.message = $filter('translate')('msgDeleteAttachment');
                $scope.Attachment = item;
                $scope.item = item;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteAttachmentsModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }

            $scope.downloadAttachment = function (attachment) {

                window.open(attachment.FullFilePath, 'Attachment', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
                return false;
            }


            $scope.gotoAttachments = function () {

                globalobject.AttachmentType = "Encounter";
                $scope.Attachmentconfigs.Attachments = $scope.EncounterAttachment;
                $scope.attachmentConfig.AttachmentType = 'Encounter';
                $scope.attachmentConfig.ID = globalobject.currentEncounter.EncounterDetailID;
                $scope.attachmentConfig.saveService.data.ID = globalobject.currentEncounter.EncounterDetailID;
                $scope.attachmentConfig.saveService.data.DocType = 'Encounter';
                $scope.attachmentConfig.deleteService.data.ID = globalobject.currentEncounter.EncounterDetailID;
                $scope.attachmentConfig.deleteService.data.DocType = 'Encounter';
                $scope.attachmentConfig.getServiceConfig.data.ID = globalobject.currentEncounter.EncounterDetailID;
                $scope.attachmentConfig.getServiceConfig.data.DocType = 'Encounter';
                $scope.changeSubView(2002);
            }

            $scope.goBack = function () {
                globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
                if (globalobject.initalreDirection == "EmployeeMedicalProfile" ) {
                    $location.path("/employeemedicalprofile");
                } else
                    $location.path("/appointmentcentral");
            }




            // EMPLOYEE PROFILE SUMMARY
            $scope.employeeProfileSummaryView = false;
            $scope.toggleFullEmployeeSummary = function () {
                $scope.employeeProfileSummaryView = !$scope.employeeProfileSummaryView;
            }

            /* -----------------------------------------------------------------------------
            SIDE BAR LISTS
            ----------------------------------------------------------------------------- */

            // ENCOUNTER TYPE


            // ACTION ITEMS
            // need to use common confirmation available in utility services
            $scope.removeActionItem = function (item, type) {
                $scope.message = "Are you sure you want to delete this Action Item?";
                $scope.item = item;
                $scope.type = type;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteActionItemModalCtrl',
                    size: 'sm',
                    scope: $scope
                });

                //var index = $scope.actionItems.indexOf(item);
                //$scope.actionItems.splice(index, 1);
            }


            /* -----------------------------------------------------------------------------
            SIDE BAR ACTIONS
            ----------------------------------------------------------------------------- */
            $scope.editSection = function (step) {
                // $location.path('/add/' + step);
                // employeeinformation
                globalobject.RedirectFrom = "Encounter";
                globalobject.employee = $scope.selectedEmployee;
                $location.path('/employeeinformation');
            }

            var showOtherField = function () {
                if (globalobject.currentEncounter.EncounterDetailID == 20) {
                    $scope.showField = true;
                }
                else {
                    $scope.showField = false;
                }
            }





            /* -----------------------------------------------------------------------------
            CUSTOM DIRECTIVES
            ----------------------------------------------------------------------------- */

            $scope.$watch(function () {
                // $scope.url = sharedservices.subViewUrl;
                return sharedservices.subViewUrl
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    //debugger;
                    if (newVal != oldVal)
                        $scope.url = sharedservices.subViewUrl;
                }
            });


            /* -----------------------------------------------------------------------------
            JQUERY
            ----------------------------------------------------------------------------- */
            $(function () {

                // LEFT COLUMN DYNAMIC HEIGHT
                var setLeftColumnHeight = function (affixTop) {
                    var affixTop = $("#sidebar").hasClass("affix-top")
                        , $navbar = $('.navbar.navbar-default.navbar-fixed-top')
                        , $mastHead = $('#masthead')
                        , $accordionPanels = $('.accordion.panel')
                        , $accordionTitles = $accordionPanels.find('.panel-heading')
                        , adjustedHeight = Math.ceil($accordionTitles.length * ($accordionTitles.height() * .6))
                        , $panelBody = $accordionPanels.find('.panel-body')
                        , contentHeight = Math.ceil($navbar.height() + $mastHead.height())
                        , panelBodyHeight = $(window).height() - contentHeight
                        , height;
                    // console.log($(window).height(), contentHeight, panelBodyHeight);
                    if (affixTop) {
                        height = Math.ceil((panelBodyHeight - contentHeight) - $accordionTitles.height())
                    } else {
                        height = Math.ceil(panelBodyHeight + ($mastHead.height() - contentHeight) - $accordionTitles.height())
                    }
                    $panelBody.css({ 'height': (height - adjustedHeight + 60) + 'px' });

                };
                setLeftColumnHeight();

                // ACCORDIONS:
                // TITLE BAR CLICK
                $("body").on("click", ".accordion .panel-heading", function () {
                    var $this = $(this).siblings();
                    if (!$this.is(':visible')) {
                        $('.accordion .panel-body, .accordion .panel-body-action-bar').hide();
                        $(this).siblings().show();
                        // $(this).siblings('.panel-body').find('.list-group-item:first-child').trigger('click');
                    }
                })
                // LIST ITEM CLICK
                $("body").on("click", ".accordion .list-group > .list-group-item", function () {
                    var $this = $(this)
                        , $others = $(".accordion .list-group > .list-group-item");
                    if (!$this.hasClass('active')) {
                        $others.removeClass('active');
                        $this.addClass('active');
                    }
                })


                // SET LEFT COLUMN WIDTH
                var leftColumnAffix = $("#leftCol > #sidebar");
                var setLeftColumnWidth = function () {
                    var leftColumnWidth = $("#leftCol").width();
                    leftColumnAffix.css({ "width": leftColumnWidth });
                };

                $(window).resize(function () {
                    setLeftColumnWidth();
                    setLeftColumnHeight();
                });

                // AFFIX LEFT COLUMN
                $("#sidebar").affix({
                    offset: { top: 139 }
                })
                // THIS EVENT IS FIRED AFTER THE ELEMENT HAS BEEN AFFIXED TO TOP
                .on('affixed.bs.affix', function () {
                    setLeftColumnWidth();
                    setLeftColumnHeight();
                })
                // THIS EVENT IS FIRED AFTER THE ELEMENT HAS BEEN AFFIXED
                .on('affixed-top.bs.affix', function () {
                    setLeftColumnHeight();
                });

            });

        } ]);


