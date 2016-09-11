angular.module("app")
       .controller("medicalRecordsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.changeSubView = sharedservices.changeSubView;
            $scope.showSubNavbars = true;
            //Object Initialization 

            $scope.EMR = {

                ExternalMedicalRecordID: null
            , AppointmentEncounterTypeID: null
            , SampleID: ''
			, Provider: null
			, DateRecordAdded: null
			, TimeRecordAdded: null
			, RecordTypeID: null
			, TestTypeID: null
			, DateOfProcedure: null
			, BodyPartSideReferenceID: null
            };

            // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.

            $scope.navBarOptions = {
                detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/EMRDetails" : 1018,
                resultsFormId: undefined,
                investigationFormId: undefined
            };


            // TIME
            /* 
            * sharedservices.setTime( hour, minutes) function
            * hour and minute arguments can be integer or string
            */
            // TIME STEPS
            globalobject.encounterTypes.encounterDetails.detailsFormId = 1018;
            var date = new Date();
            var timeNow = date.getHours() + ":" + date.getMinutes()

            $scope.Hour = timeNow.split(':')[0];
            $scope.Minut = timeNow.split(':')[1];
            date.setHours($scope.Hour);
            date.setMinutes($scope.Minut);

            $scope.noteTime = date;
            $scope.EMR.DateOfProcedure = date;


            $scope.EMRAttachment = [];

            $scope.BindDefaultDateTime = (function () {
                var date = new Date();
                var timeNow = date.getHours() + ":" + date.getMinutes()
                $scope.Hour = timeNow.split(':')[0];
                $scope.Minut = timeNow.split(':')[1];

                $scope.EMR.DateOfProcedure = date;
                $scope.noteTime = sharedservices.setTime($scope.Hour, $scope.Minut);
                $scope.hourStep = sharedservices.hourStep;
                $scope.minuteStep = sharedservices.minuteStep;
            })();

            $scope.RecordTypeList = globalobject.RecordTypeList;
            $scope.TestTypeList = globalobject.TestTypeExtermalMedicalRecordsList;

            // Function to Get the Details ******************
            $scope.getEncounterDetails = function () {
                globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ?
                                                            parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ?
                                                            parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

                globalobject.currentEncounter.EncounterDetailDate = (sharedservices.getURLParameter().AppointmentDate != undefined && sharedservices.getURLParameter().AppointmentDate != null) ?
                                                                     sharedservices.getURLParameter().AppointmentDate : globalobject.currentEncounter.EncounterDetailDate;

                var configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                    data: { EncounterDetailID: parseInt(globalobject.currentEncounter.EncounterDetailID), AppointmentEncounterTypeID: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID) }
                };
                sharedservices.xhrService(configs)
            .then(function (response) {
                globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);

                $scope.getEMRDetails();
            });

            };

            //$scope.AppointmentDate = globalobject.currentEncounter.EncounterDetailDate;


            $scope.getBodyParts = function () {
                var configs = {
                    url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetBodyPartsList"
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.BodyPartsList = data.d.Object;
                    }
                })
                .error(function (data, status, headers, config) {

                });
            }
            $scope.getBodyParts();

            $scope.getEMRDetails = function () {

                $scope.EMR.ExternalMedicalRecordID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                $scope.EMR.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                $scope.attachmentConfigsInit();
                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/EMRService.asmx/SelectEMRDetails",
                    data: { EMRID: $scope.EMR.ExternalMedicalRecordID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       $scope.EMR = data.d.Object;
                       $scope.DateRecordAdded = globalobject.currentEncounter.EncounterDetailDate;
                       //$scope.EMR.DateRecordAdded = globalobject.currentEncounter.EncounterDetailDate;
                       $scope.EMR.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                       if ($scope.EMR.DateOfProcedure == 'Jan 01, 1970') { $scope.EMR.DateOfProcedure = null; }
                       $scope.myDate = $scope.EMR.DateOfProcedure;

                       $scope.EMRAttachment = _.where($scope.$parent.EMRAttachment, { Id: $scope.EMR.ExternalMedicalRecordID });

                       if ($scope.EMR.ExternalMedicalRecordID != 0) {

                           var intime = new Date();
                           intime.setHours($scope.EMR.TimeRecordAdded.split(':')[0]);
                           intime.setMinutes($scope.EMR.TimeRecordAdded.split(':')[1]);
                           $scope.noteTime = intime;
                           $scope.DateRecordAdded = $scope.EMR.DateRecordAdded
                       }

                       $scope.attachmentConfigsInit();
                       $scope.loadAttachments();
                   }

               })
            }; //


            $scope.saveEMRDetails = function () {
                var saveStatus = true;
                var msg = '';
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;

                $scope.EMR.DateOfProcedure = new Date($scope.myDate).toDateString();

                $scope.EMR.DateRecordAdded = globalobject.currentEncounter.EncounterDetailDate;
                $scope.EMR.TimeRecordAdded = $('#hdnEMRTime').val();

                if (!($scope.Attachments.length > 0 || $scope.uploadAttachments.length > 0)) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgAttachmentisRequired');
                }

                if (($scope.EMR.DateOfProcedure != '' || $scope.EMR.DateOfProcedure != null) && (moment($scope.EMR.DateOfProcedure)).isAfter($scope.EMR.DateRecordAdded)) {

                    saveStatus = false;
                    $scope.loadingAction = false;
                    msg = ($filter('translate')('msgDateOfProcedure'));
                    $scope.showLoadingOverlay = false;
                }

                if ($scope.EMR.Provider == '' || $scope.EMR.Provider == null || $scope.EMR.TimeRecordAdded == '' || $scope.EMR.RecordTypeID == ''
                    || $scope.EMR.RecordTypeID == null || $scope.EMR.RecordTypeID == undefined || $scope.EMR.BodyPartSideReferenceID == '' || $scope.EMR.BodyPartSideReferenceID == null) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if (saveStatus) {
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/EMRService.asmx/SaveEMRDetails",
                        data: { EMRDetailsObj: $scope.EMR }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }

                else
                    if (msg != '') {
                        toastr.warning(msg);
                    }
            };

            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.ExternalMedicalRecordID;
                    $scope.EMR.ExternalMedicalRecordID = data.d.Object.ExternalMedicalRecordID;
                    $scope.attachmentConfigsInit();
                    $scope.saveAttachments();
                    $scope.loadAttachments();
                    toastr.success($filter('translate')('msgSavedSuccessfully'));
                    $scope.frmEMR.$dirty = false;
                }

            };
            function saveDataError(data, status, headers, config) {
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
                toastr.warning($filter('translate')('msgSeriveerror'));
            };

            $scope.cancelEMR = function () {

                if ($scope.frmEMR.$dirty) {

                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/confirmation-modal.html',
                        controller: 'CancelModalCtrl',
                        size: 'sm',
                        scope: $scope
                    });
                }

                else {
                    if (globalobject.currentEncounter.FromSOAListScreen) {
                        sharedservices.reloadParent();
                    }
                    else {
                        if (globalobject.RedirectFrom == 'Encounter')
                            $location.path("/appointmentcentral");

                        else if (globalobject.RedirectFrom == 'EmployeeMedicalProfile')
                            $location.path("/employeemedicalprofile");

                    }

                }
            }

            $scope.attachmentConfigsInit = function () {

                //$scope.EMRAttachment = _.where($scope.$parent.EMRAttachment, { Id: $scope.EMR.ExternalMedicalRecordID });

                $scope.attachmentConfig = {
                    MaxFileSize: '',
                    ProhibitedFileExtensions: '',
                    LocationID: '',
                    AttachmentType: 'EMR',
                    Module: 'OccHealth',
                    ID: $scope.EMR.ExternalMedicalRecordID,
                    Attachments: $scope.EMRAttachment,
                    showUpload: false,

                    getServiceConfig: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectAttachmentsByEncounterID",
                        data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, DocType: 'EMR' }
                    },
                    saveService: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                        data: { ID: $scope.EMR.ExternalMedicalRecordID, DocumentIds: '', DocType: 'EMR' }
                    },
                    deleteService: {
                        url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                        data: { ID: $scope.EMR.ExternalMedicalRecordID, DocumentIds: '', DocType: 'EMR' }
                    }
                };
            }


        } ]);

