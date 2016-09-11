
angular.module("app")
       .controller("clinicNotesFormCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.clinicnote = {
                EncounterDetailID: null
                , EncounterClinicNoteID: null
                , ClinicNoteAttachment: null
                , ClinicNoteComment: null
                , ClinicNoteLock: false
                , HealthCareProvider: null
                , ClinicNoteDate: null
                , ClinicNoteTime: null
                , CreatedBy: 0
                , AttachmentType: 0
            };


            var date = new Date();
            var timeNow = date.getHours() + ":" + date.getMinutes()

            $scope.Hour = timeNow.split(':')[0];
            $scope.Minut = timeNow.split(':')[1];
            date.setHours($scope.Hour);
            date.setMinutes($scope.Minut);

            $scope.noteTime = date;
            $scope.clinicnote.ClinicNoteDate = date;

            $scope.title = "Clinic Notes";
            $scope.supervisorList = [];
            $scope.hideClinicNote = globalobject.hideClinicNote;
            $scope.Supervisor = '';
            $scope.AppointmentDate = globalobject.currentEncounter.EncounterDetailDate;

            $scope.AttachmentTypeList = globalobject.AttachmentTypeList;

            $scope.BindDefaultDateTime = (function () {
                var date = new Date();
                var timeNow = date.getHours() + ":" + date.getMinutes()
                $scope.Hour = timeNow.split(':')[0];
                $scope.Minut = timeNow.split(':')[1];

                $scope.clinicnote.ClinicNoteDate = date;

                $scope.noteTime = sharedservices.setTime($scope.Hour, $scope.Minut);
                $scope.hourStep = sharedservices.hourStep;
                $scope.minuteStep = sharedservices.minuteStep;
            })();

            $scope.disableEmail = false;
            if (globalobject.EncounterClinicNoteID == 0) {
                $scope.disableEmail = true;
            }

            $scope.getSupervisorList = function () {

                var configs = {
                    url: "../WebServices/Foundation/EmployeeListService.asmx/GetSupervisorList"

                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       $scope.supervisorList = data.d.Object;
                   }

               })
            }

            $scope.getClinicNotesDetails = function () {

                $scope.EncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
                $scope.clinicnote.EncounterClinicNoteID = globalobject.EncounterClinicNoteID;
                $scope.attachmentConfigsInit();
                var configs = {
                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectClinicNote",
                    data: { EncounterDetailID: $scope.EncounterDetailID, ClinicNoteID: $scope.clinicnote.EncounterClinicNoteID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       sharedservices.parseDates(data.d.Object);
                       $scope.clinicnote = data.d.Object;
                       $scope.myDate = $scope.clinicnote.ClinicNoteDate;
                       $scope.EncounterDate = data.d.Object.EncounterDate;
                       $scope.EncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
                       $scope.clinicnote.EncounterClinicNoteID = globalobject.EncounterClinicNoteID;

                       $scope.clinicnote.ClinicNoteDate = data.d.Object.ClinicNoteDate;

                       if ($scope.clinicnote.EncounterClinicNoteID != 0) {

                           var intime = new Date();
                           intime.setHours($scope.clinicnote.ClinicNoteTime.split(':')[0]);
                           intime.setMinutes($scope.clinicnote.ClinicNoteTime.split(':')[1]);
                           $scope.noteTime = intime;
                       }

                       $scope.getSupervisorList();
                       $scope.ClinicNotesAttachment = _.where($scope.$parent.ClinicNotesAttachment, { Id: $scope.clinicnote.EncounterClinicNoteID });
                       //$scope.hasPermission = (!($scope.funPermissionCheck(450007, 'SelfOthers', $scope.clinicnote.CreatedBy) && (($scope.clinicnote.EncounterClinicNoteID == 0) ? true : (($scope.clinicnote.ClinicNoteLock == false) && $scope.funPermissionCheck(450064, 'Any', $scope.clinicnote.CreatedBy)))));

                       $scope.hasPermission = ($scope.funPermissionCheck(450007, 'SelfOthers', $scope.clinicnote.CreatedBy)) ? (($scope.clinicnote.ClinicNoteLock) ? $scope.funPermissionCheck(450064, 'Any', $scope.clinicnote.CreatedBy) : true) : false;
                   }
                   $scope.showLoadingOverlay = false;
               })
            };
            //            $scope.getClinicNotesDetails();

            $scope.saveClinicNotesDetails = function () {
                var saveStatus = true;
                var msg = '';
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;
                $scope.CurrentDate = new Date();

                $scope.clinicnote.ClinicNoteDate = new Date($scope.myDate).toDateString();

                $scope.clinicnote.ClinicNoteTime = $('#hdnclinicNoteTime').val();


                if ($scope.clinicnote.ClinicNoteDate == '' || ($scope.clinicnote.ClinicNoteComment == '' || $scope.clinicnote.ClinicNoteComment == null) || $scope.clinicnote.ClinicNoteTime == '') {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if ((moment($scope.clinicnote.ClinicNoteDate).isBefore($scope.EncounterDate))) {
                    saveStatus = false;
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    msg = $filter('translate')('msgClinicNoteDateValidation');
                }



                var DrawDate = new Date($scope.clinicnote.ClinicNoteDate);
                var EncounterDetailDate = new Date($scope.EncounterDate);
                var currentDate = new Date($scope.CurrentDate);

                if (saveStatus && DrawDate.toDateString() == EncounterDetailDate.toDateString()) {

                    $scope.AppointmentTimeHour = $scope.clinicnote.TimeIn.split(':')[0];
                    $scope.AppointmentTimeMin = $scope.clinicnote.TimeIn.split(':')[1];

                    $scope.NoteTimeHour = $scope.clinicnote.ClinicNoteTime.split(':')[0];
                    $scope.NoteTimeMin = $scope.clinicnote.ClinicNoteTime.split(':')[1];

                    //                    $scope.NoteTime = sharedservices.setTime($scope.NoteTimeHour, $scope.NoteTimeMin);
                    //                    $scope.AppointmentTime = sharedservices.setTime($scope.AppointmentTimeHour, $scope.AppointmentTimeMin);

                    // if (moment($scope.NoteTime).isBefore($scope.AppointmentTime)) {
                    //          if (parseInt($scope.exposureBLL.DrawTime.split(':')[0]) <= parseInt($scope.Hour) && parseInt($scope.exposureBLL.DrawTime.split(':')[1]) <= parseInt($scope.Minut)) {

                    if (parseInt($scope.NoteTimeHour) < parseInt($scope.AppointmentTimeHour)) {
                        saveStatus = false;
                        msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                    }
                    else if (parseInt($scope.NoteTimeHour) == parseInt($scope.AppointmentTimeHour)) {
                        if (parseInt($scope.NoteTimeMin) < parseInt($scope.AppointmentTimeMin)) {
                            saveStatus = false;
                            msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                        }
                    }
                }

                if (saveStatus && (DrawDate.toDateString() != currentDate.toDateString()) && (moment($scope.clinicnote.ClinicNoteDate).isAfter($scope.CurrentDate))) {
                    saveStatus = false;
                    msg = $filter('translate')('msgClinicNotesDateshouldnotbeGreaterthanCurrentDate');
                }

                if (saveStatus) {
                    var configs = {
                        url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveClinicNote",
                        data: { ClinicNotesObj: $scope.clinicnote, EncounterDetailID: $scope.EncounterDetailID }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }

                else
                    if (msg != '') {
                        toastr.warning(msg);

                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
            };

            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    globalobject.EncounterClinicNoteID = data.d.Object.EncounterClinicNoteID;
                    globalobject.currentEncounter.EncounterDetailID = data.d.Object.EncounterDetailID;
                    $scope.attachmentConfigsInit();
                    $scope.saveAttachments();
                    $scope.$parent.loadClinicNotes();
                    $scope.$parent.loadAttachments();
                    $scope.getClinicNotesDetails();
                    $scope.frmclinicNotes.$dirty = false;
                    toastr.success($filter('translate')('msgSavedSuccessfully'));
                    $scope.disableEmail = false;
                }

            };
            function saveDataError(data, status, headers, config) {
                toastr.warning($filter('translate')('msgSeriveerror'));
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
            };

            $scope.cancelClinicNotes = function () {

                if ($scope.frmclinicNotes.$dirty) {

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

            $scope.emailNote = function () {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/email-note-modal.html', //'/OccHealth/modals/email-note-modal.html',
                    controller: 'EmailNoteModalCtrl',
                    size: 'lg',
                    scope: $scope
                });
            };



            $scope.closeForm = function () {
                reloadParent(); // CloseModalPopup();
            };

            $scope.attachmentConfigsInit = function () {

                $scope.ClinicNotesAttachment = _.where($scope.$parent.ClinicNotesAttachment, { Id: $scope.clinicnote.EncounterClinicNoteID });
                $scope.attachmentConfig = $scope.$parent.Attachmentconfigs
                $scope.attachmentConfig.Attachments = $scope.ClinicNotesAttachment;
                $scope.attachmentConfig.AttachmentType = 'ClinicNote';
                $scope.attachmentConfig.showUpload = false;
                $scope.attachmentConfig.ID = globalobject.EncounterClinicNoteID;
                // $scope.attachmentConfig.getServiceConfig.data.ID = $scope.clinicnote.EncounterClinicNoteID;
                $scope.attachmentConfig.getServiceConfig.data.DocType = 'ClinicNote';
                $scope.attachmentConfig.saveService = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                    data: { ID: $scope.clinicnote.EncounterClinicNoteID, DocumentIds: '', DocType: 'ClinicNote' }
                };
                $scope.attachmentConfig.deleteService = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                    data: { ID: $scope.clinicnote.EncounterClinicNoteID, DocumentIds: '', DocType: 'ClinicNote' }
                };


                //$scope.loadAttachments();
            }



        } ]);
