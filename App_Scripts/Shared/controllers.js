//common module will be linked to shred controllers
angular.module("app")
    .controller('commonPickListCtrl',
        function ($scope, $modalInstance) {
            $scope.name = "";
            $scope.modalOk = function () {
                $modalInstance.close($scope.selected.item);

            };

            $scope.modalClose = function () {
                $scope.names = "updated in picklist";
                $modalInstance.close($scope);

            };

        }
    )
    .controller('ModalInstanceCtrl',
        function ($scope, $modalInstance) {
            $scope.modalOk = function () {
                $modalInstance.close($scope.selected.item);
            };
            $scope.modalClose = function () {
                $modalInstance.close('Cancel');

            };

        }
    )
    .controller('confirmationCtrl',
        function ($scope, $modalInstance) {
            //default configs, those will be overwritten with requester configs
            $scope.header = $scope.params.header || 'Confirm';
            $scope.okBtnName = $scope.params.okBtnName || 'Ok';
            $scope.cancelBtnName = $scope.params.cancelBtnName || 'Cancel'
            $scope.message = $scope.params.message || 'Please Confirm to proceed.'

            $scope.modalOk = function () {
                if ($scope.params.onSuccessCall) {
                    $scope.params.onSuccessCall();
                }
                $modalInstance.close('');

            };
            $scope.modalClose = function () {
                $modalInstance.close('Cancel');

            };

        }
    )
    .controller('AppointmentActionModalCtrl',
        function ($scope, $modalInstance, $filter, $location, utilityservices, globalobject, sharedservices, toastr) {
            //$scope.modalOk = function () {
            //    $modalInstance.close($scope.selected.item);
            //};

            $scope.currentObject = globalobject.currentObject;

            // $scope.currentObject.AppointmentDate = $filter('parseDate')($scope.currentObject.AppointmentDate);

            $scope.ReasonCancellationList = globalobject.ReasonCancellationList;

            $scope.appointmentrescheduleReasonID = '';
            $scope.RescheduleReasonList = globalobject.RescheduleReasonList;

            $scope.reschedulesendNotification = true;
            $scope.cancelsendNotification = true;
            var params = $scope;
            var configs;
            $scope.resDate = new Date();
            var date = new Date();
            var timeNow = $filter('date')(date, 'HH:mm');

            $scope.timeInHours = timeNow.split(':')[0];
            $scope.timeInMinutes = timeNow.split(':')[1];

            $scope.TimeHour = timeNow.split(':')[0];
            $scope.TimeMin = timeNow.split(':')[1];

            $scope.modalClose = function () {
                $modalInstance.close('Cancel');
            };

            $scope.modalOk = function () {
                $scope.noShowAppointment();
                $modalInstance.close('');

            };

            function ValidateAppointmentDate(ValidateDate, type) {
                var today = new Date();
                var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                var AppointmentDate = new Date(ValidateDate);
                if (type == "appointment") {
                    if (AppointmentDate < date) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (AppointmentDate > date) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }

            // RESCHEDULE APPOINTMENT
            $scope.rescheduleAppointment = function () {

                $scope.CurrentTime = sharedservices.setTime($scope.TimeHour, $scope.TimeMin);
                $scope.rescheduleTime = sharedservices.setTime($scope.timeInHours, $scope.timeInMinutes);
                $scope.today = new Date();
                if ($scope.resDate == null || $scope.timeInHours == "" || $scope.timeInMinutes == "" || $scope.appointmentrescheduleReasonID == null || $scope.appointmentrescheduleReasonID == '') {

                    utilityservices.notify("warning", $filter('translate')('msgRequiredfieldmustbecompleted'));

                }
                else if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "no" && ValidateAppointmentDate($scope.resDate, "appointment")) {
                    utilityservices.notify("warning", $filter('translate')('msgAppointmentCannotbescheduledtoPreviousDates')); //$filter('translate')('msgRequiredfieldmustbecompleted')
                }
                else if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "no" && moment($scope.resDate).isBefore($scope.today) && moment($scope.rescheduleTime).isBefore($scope.CurrentTime)) {

                    utilityservices.notify("warning", $filter('translate')('msgPasttimeCantbeallowedPleaseenterFuturetime'));
                }
                else {
                    var msg = $filter('translate')('msgRescheduleAppointmentsuccessfully');
                    if ($scope.reschedulesendNotification == undefined) $scope.reschedulesendNotification = false;
                    var test = $scope.VisitDate;
                    configs = {
                        url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/RescheduleAppointment",
                        data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID, appointmentDate: new Date($scope.resDate).toDateString(), appointmentTime: $scope.timeInHours + ':' + $scope.timeInMinutes, appointmentrescheduleReasonID: $scope.appointmentrescheduleReasonID,
                            EmployeePK: $scope.currentObject.EmployeePK, sendNotification: $scope.reschedulesendNotification, allowDuplicate: $scope.currentObject.PersonnelTypeID != 1003 ? $scope.$parent.allowDuplicate : true
                        }
                    };
                    sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            // Fetch data
                            if (data.d.Object) {
                                if (data.d.Message == "AlreadyExists" || data.d.Message == "Duplicatetime") {                                

                                    if ($scope.$parent != null) { $scope.$parent.DuplicateExists = data.d.Message; }
                                    else { $scope.DuplicateExists = data.d.Message; }
                                    globalobject.currentObject.AppointmentDetailID = $scope.currentObject.AppointmentDetailID;
                                    globalobject.currentObject.appointmentDate = new Date($scope.resDate);
                                    globalobject.currentObject.AppointmentTimeIn = $scope.timeInHours + ':' + $scope.timeInMinutes;
                                    globalobject.currentObject.appointmentrescheduleReasonID = $scope.appointmentrescheduleReasonID;
                                    globalobject.currentObject.reschedulesendNotification = $scope.reschedulesendNotification;
                                    $scope.DuplicateAppointments();
                                }
                                else {
                                    utilityservices.notify("success", msg);
                                    if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                                        $scope.$parent.SelectEmployeeDetails();
                                    }
                                    else {
                                        $scope.$parent.getAppointments();
                                        $scope.$parent.getEncounters();
                                    }
                                }
                            }
                            else {
                                toastr.error("Appointment already exists for today.");
                            }
                            $modalInstance.close('');
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
                }
            }

            $scope.deleteItem = function () {

                var msg = $filter('translate')('msgRecordDeletedsuccessfully');
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/DeleteAppointment",
                    data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID }
                };
                sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            // Fetch data
                            utilityservices.notify("success", msg);
                            if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                                $scope.$parent.SelectEmployeeDetails();
                            }
                            else {
                                $scope.$parent.getAppointments();
                                $scope.$parent.getEncounters();
                            }
                            $modalInstance.close('');
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
            }

            $scope.noShow = function () {

                var msg = $filter('translate')('msgSuccessfullyMarkedasaNoShow');
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/NoShowAppointment",
                    data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID }
                };
                sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            utilityservices.notify("success", msg);
                            if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                                $scope.$parent.SelectEmployeeDetails();
                            }
                            else {
                                $scope.$parent.getAppointments();
                                $scope.$parent.getEncounters();
                            }
                            $modalInstance.close('');
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
            }
            $scope.cancelItem = function () {


                if ($scope.appointmentCancelReasonID == null) {

                    utilityservices.notify("warning", $filter('translate')('msgRequiredfieldmustbecompleted'));
                }
                else {
                    var msg = $filter('translate')('msgCancelAppointmentsuccessfully');
                    configs = {
                        url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/CancelAppointment",
                        data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID, appointmentCancelReasonID: $scope.appointmentCancelReasonID, sendNotification: $scope.cancelsendNotification }
                    };
                    sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            utilityservices.notify("success", msg);
                            if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                                $scope.$parent.SelectEmployeeDetails();
                            }
                            else {
                                $scope.$parent.getAppointments();
                                $scope.$parent.getEncounters();
                            }
                            $modalInstance.close('');

                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
                }
            }






            $scope.modalCreateEncounter = function () {

                if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "yes") {
                    $scope.AllowPastAppointmentandEncounters = true;
                    $scope.AppDate = $scope.currentObject.AppointmentDate;
                }
                else {
                    $scope.AllowPastAppointmentandEncounters = false;
                    $scope.AppDate = new Date().toDateString();
                }

                if ($scope.currentObject.PersonnelTypeID == 1003) {
                    $location.path("/encounterdetails/");
                }
                else {
                    var date = new Date();
                    var timeNow = $filter('date')(date, 'HH:mm');
                    $scope.timeInHours = timeNow.split(':')[0];
                    $scope.timeInMinutes = timeNow.split(':')[1];
                    configs = {
                        url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/CheckduplicateAppointmentExist",
                        data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID, appointmentDate: $scope.AppDate, appointmentTime: $scope.timeInHours + ":" + $scope.timeInMinutes,
                            EmployeePK: $scope.currentObject.EmployeePK
                        }
                    };
                    sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            if (data.d.IsOK) {
                                if (data.d.Message == "NotExits") {
                                    $location.path("/encounterdetails/");
                                }
                                else if (data.d.Message == "Duplicatetime" || data.d.Message == "AlreadyExists") {
                                    if ($scope.$parent != null) { $scope.$parent.DuplicateExists = data.d.Message; }
                                    else { $scope.DuplicateExists = data.d.Message; }
                                    globalobject.currentObject.AppointmentTimeIn = $scope.timeInHours + ":" + $scope.timeInMinutes;
                                    globalobject.DuplicateAppointmentfromScreen = "CreateEncounter";
                                    $scope.DuplicateAppointments();
                                }
                            }
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })

                }
                $modalInstance.close('');
            };

            $scope.performActionOnAppointment = function (appointmentAction) {
                switch (appointmentAction) {
                    case 'reschedule':
                        $scope.showAppointmentActions = false;
                        $scope.showRescheduleModal = true;
                        break;
                    case 'noShow':
                        $scope.showAppointmentActions = false;
                        $scope.showNoShowModel = true;
                        break;
                    case 'cancel':
                        $scope.showAppointmentActions = false;
                        $scope.showCancelModal = true;
                        break;
                    case 'delete':
                        $scope.showAppointmentActions = false;
                        $scope.showDeleteModal = true;
                        break;
                    case 'createEncounter':

                        globalobject.currentEncounter.AppointmentDetailID = globalobject.currentObject.AppointmentDetailID;
                        globalobject.currentEncounter.EncounterDetailID = globalobject.currentObject.EncounterDetailID == null ? 0 : globalobject.currentObject.EncounterDetailID;
                        // globalobject.currentEncounter.EmployeePK
                        if (globalobject.currentEncounter.screenType != 'EmployeeMedicalProfile') {
                            globalobject.currentEncounter.EmployeePK = globalobject.currentObject.EmployeePK == null ? 0 : globalobject.currentObject.EmployeePK;
                        }
                        if (globalobject.currentEncounter.EncounterDetailID == 0) {
                            $scope.showAppointmentActions = false;
                            $scope.showCreateEncounterModel = true;

                        } else {
                            $scope.modalClose();
                            $location.path("/encounterdetails/");
                        }

                        break;

                    default:
                        break;
                }
            };

        }
    )

.controller('EmailNoteModalCtrl',
    function ($scope, $modalInstance, $location, sharedservices, globalobject, toastr) {

        $scope.clinicnoteDetails = $scope.clinicnote;
        $scope.EmployeeDetails = globalobject.employee;
        $scope.Username = sessionStorage.getItem('UserFullName');
        $scope.subject = 'Clinic Note Summary - ' + $scope.EmployeeDetails.EmployeeName + ' - ' + $scope.clinicnoteDetails.ClinicNoteDate;
        $scope.supervisorList = $scope.supervisorList;
        // $scope.Supervisor = "abcd";
        $scope.EmployeeEmail = '';
        $scope.supervisorpicklist = {};
        $scope.supervisorpicklist.supervisorEmail = [];

        if ($scope.EmployeeDetails.SupervisorEmail != null || $scope.EmployeeDetails.SupervisorEmail != undefined) {

            $scope.supervisorpicklist.supervisorEmail.push($scope.EmployeeDetails.SupervisorEmail);
        }

        $scope.emailDetails = {
            EmployeeName: '',
            HealthCareProvider: '',
            EmailAddress: ''
        };

        $scope.Others = '';

        $scope.modalClose = function () {
            $modalInstance.close('Cancel');

        };

        $scope.modalOk = function () {

            $scope.emailDetails.EmployeeName = $scope.EmployeeDetails.EmployeeName;
            $scope.EmployeeEmail = $scope.EmployeeDetails.EmailID;
            $scope.emailDetails.HealthCareProvider = $scope.clinicnoteDetails.HealthCareProvider;
            $scope.emailDetails.EmailAddress = $scope.supervisorpicklist.supervisorEmail.join(";") + ';' + $scope.Others;

            var configs = {
                url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SendClinicNoteEmail",
                data: { ClinicNoteId: $scope.clinicnoteDetails.EncounterClinicNoteID, EmailObj: $scope.emailDetails, Subject: $scope.subject, EmployeeEmail: $scope.EmployeeEmail }
            };

            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);

                    if (data.d.IsOK) {

                        toastr.success('Mail Sent Successfully');
                        $modalInstance.close('');

                    }

                })
        };


    }
).controller('deleteActionItemModalCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, utilityservices, globalobject) {
            $scope.modalClose = function () {
                $modalInstance.close('');

            };

            $scope.deleteItem = function () {
                var id = $scope.item.ID;
                var configs = {

                    url: "../WebServices/Calendar/CalendarActionItemService.asmx/DeleteCalendarEvents",
                    data: { EventIDList: id }
                };

                sharedservices.xhrService(configs)
              .success(function (data, status, headers, config) {
                  sharedservices.parseDates(data.d.Object);

                  if (data.d.IsOK) {

                      var index = $scope.actionItems.indexOf($scope.item);
                      $scope.actionItems.splice(index, 1);

                      if ($scope.type == 'Encounter') {

                          globalobject.hideActionItem = false;
                          $scope.gotoActionItemDetails(0);
                      }

                      if ($scope.type == 'MedProfile') {

                          globalobject.hideActionItem = true;
                          $scope.changeSubView(2001);
                      }


                      toastr.success($filter('translate')('msgDeleteSuccessfully'));

                  }
              })
                $modalInstance.close('');

            };


        }
    )
    .controller('deleteClinicNotesModalCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.modalClose = function () {
                $modalInstance.close('');

            };

            $scope.deleteItem = function () {
                var id = $scope.item.EncounterClinicNoteID;
                var configs = {

                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteClinicNotes",
                    data: { ClinicNoteIDs: id }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       var index = $scope.clinicNotes.indexOf($scope.item);
                       $scope.clinicNotes.splice(index, 1);

                       if ($scope.type == 'Encounter') {

                           globalobject.hideClinicNote = false;
                           $scope.gotoClinicNotesDetails(0);
                       }

                       if ($scope.type == 'MedProfile') {

                           globalobject.hideClinicNote = true;
                           $scope.changeSubView(2000);
                       }


                       toastr.success($filter('translate')('msgDeleteSuccessfully'));

                   }
               })
              .error(function () {
                  $log.log("error")
              })
                $modalInstance.close('');

            };


        }
    )

    .controller('deleteAttachmentsModalCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter) {
            $scope.modalClose = function () {
                $modalInstance.close('');

            };

            $scope.deleteItem = function () {

                $scope.Id = $scope.Attachment.ID;
                $scope.DocID = $scope.Attachment.DocumentId;
                $scope.DocType = $scope.Attachment.KeyWord;

                var configs = {

                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                    data: { ID: $scope.Id, DocumentIds: $scope.DocID, DocType: $scope.DocType }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       if ($scope.DocType == 'Encounter') {
                           var index = $scope.EncounterAttachment.indexOf($scope.item);
                           $scope.EncounterAttachment.splice(index, 1);
                       }
                       else if ($scope.DocType == 'EncounterType') {
                           var index = $scope.EncounterTypeAttachment.indexOf($scope.item);
                           $scope.EncounterTypeAttachment.splice(index, 1);
                       }
                       else if ($scope.DocType == 'ClinicNote') {
                           var index = $scope.ClinicNotesAttachment.indexOf($scope.item);
                           $scope.ClinicNotesAttachment.splice(index, 1);
                       }
                       else {
                           $scope.ActionItemAttachment
                           var index = $scope.ActionItemAttachment.indexOf($scope.item);
                           $scope.ActionItemAttachment.splice(index, 1);
                       }
                       $scope.$parent.LengthOfAttachments = $scope.LengthOfAttachments - 1;
                       toastr.success($filter('translate')('msgDeleteSuccessfully'));
                   }
               })
              .error(function () {
                  toastr.warning($filter('translate')('msgSeriveerror'));
              })
                $modalInstance.close('');

            };


        }
    )

    .controller('CancelModalCtrl',
        function ($scope, $modalInstance, $location, $filter, globalobject, sharedservices) {

            $scope.message = $filter('translate')('msgAreyousureyouwanttocancelallofyourchanges');
            $scope.cancelBtnName = $filter('translate')('btnNo');
            $scope.okBtnName = $filter('translate')('btnYes');

            $scope.modalClose = function () {
                $modalInstance.close('Cancel');

            };

            $scope.modalOk = function () {

                $modalInstance.close('');

                if ($scope.FromSOAListScreen != undefined && $scope.FromSOAListScreen) {

                    if ($scope.fromLookup) {

                        globalobject.redirected = true;

                        if (globalobject.fromScreen == 'Equipment')
                            $location.path("/Equipment");
                        if (globalobject.fromScreen == 'Medication')
                            $location.path("/Medication");

                    }
                    else
                        sharedservices.reloadParent();
                }

                if (globalobject.currentEncounter.FromSOAListScreen) {

                    if ($scope.fromLookup) {

                        globalobject.redirected = true;

                        if (globalobject.fromScreen == 'Equipment')
                            $location.path("/Equipment");
                        if (globalobject.fromScreen == 'Medication')
                            $location.path("/Medication");

                    }
                    else
                        sharedservices.reloadParent();
                }

                //Need to modify later when encounter detail will complete
                else if (globalobject.initalreDirection == "EmployeeMedicalProfile" && $scope.screenType == 'encounterDetails') {
                    $location.path("/encounterdetails");
                }
                else if (globalobject.initalreDirection == "EmployeeMedicalProfile" || $scope.RedirectFromMedicalProf == 'EmployeeMedicalProfile') {
                    $location.path("/employeemedicalprofile");
                } else {
                    if ($scope.editMode && ($scope.screenType == 'encounterDetails')) {
                        $location.path("/encounterdetails");
                    }
                    else if ($scope.screenType == 'appointment' && $scope.editMode && $scope.stepThruNumber != 3) {
                        $scope.$parent.stepThruNumber = 3;
                        //$location.path("/appointmentcentral");
                    }
                    else if ($scope.screenType == 'appointment' && $scope.editMode) {
                        $location.path("/appointmentcentral");
                    }
                    else if ($scope.screenType == "EmployeeMedicalProfile") {
                        $location.path("/employeemedicalprofile");
                    }
                    else {
                        $location.path("/appointmentcentral");
                    }
                }

            };


        }
    )


    .controller('deleteEncounterTypeModalCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.modalClose = function () {
                $modalInstance.close('');

            };

            $scope.deleteItem = function () {

                $scope.item.selected = false;
                angular.forEach($scope.EncounterTypeList, function (object, index) {
                    if (object.ID == $scope.item.ID)
                        $scope.EncounterTypeList[index].selected = $scope.item.selected;
                });
                globalobject.currentEncounter.SelectedEncounterTypeID = (globalobject.currentEncounter.SelectedEncounterTypeID == $scope.item.ID) ? 0 : globalobject.currentEncounter.SelectedEncounterTypeID;
                $scope.$parent.loadDefaultView();
                toastr.success($filter('translate')('msgDeleteSuccessfully'));
                $modalInstance.close('');

            };


        }
    )

    .controller('CreateEncounterModalCtrl',
        function ($scope, $modalInstance, $location, $filter) {

            $scope.message = $filter('translate')('msgAreyousureyouwouldliketocreateanEncounter');
            $scope.cancelBtnName = $filter('translate')('btnNo');
            $scope.okBtnName = $filter('translate')('btnYes');

            $scope.modalClose = function () {

                $modalInstance.close('Cancel');


            };

            $scope.modalOk = function () {

                $scope.$parent.IsCreateEncounter = true;
                $scope.SaveandContinue();
                $modalInstance.close('');
                //  $location.path("/encounterdetails/");
                //Need to modify later when encounter detail will complete


            };


        }
    )



    .controller('deleteUploadedAttachmentsModalCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter) {
            $scope.modalClose = function () {
                $modalInstance.close('');

            };

            $scope.deleteItem = function () {

                $scope.attachmentConfig.deleteService.data.ID = $scope.selectedAttachment.ID;
                $scope.attachmentConfig.deleteService.data.DocumentIds = $scope.selectedAttachment.DocumentId;
                $scope.attachmentConfig.deleteService.data.DocType = $scope.selectedAttachment.KeyWord;

                sharedservices.xhrService($scope.attachmentConfigs.deleteService)
                          .success(function (data, status, headers, config) {
                              sharedservices.parseDates(data.d.Object);

                              if (data.d.IsOK) {
                                  //                                  var index = $scope.Attachments.indexOf($scope.selectedAttachment);
                                  //                                  $scope.Attachments.splice(index, 1);
                                  $scope.getAttachments();
                                  toastr.success($filter('translate')('msgDeleteSuccessfully'));
                              }
                          })

                      .error(function () {
                          toastr.warning($filter('translate')('msgSeriveerror'));
                      })
                $modalInstance.close('');

            };


        }
    )

    .controller('AddEmployeeCancelModalCtrl',
        function ($scope, $modalInstance, $location, $filter) {

            $scope.message = $filter('translate')('msgAreyousureyouwanttocancelallofyourchanges');
            $scope.cancelBtnName = $filter('translate')('btnNo');
            $scope.okBtnName = $filter('translate')('btnYes');

            $scope.modalClose = function () {
                $modalInstance.close('Cancel');

            };

            $scope.modalOk = function () {

                $modalInstance.close('');

                //Need to modify later when encounter detail will complete
                if ($scope.RedirectFromMedicalProf == 'EmployeeMedicalProfile') {
                    $location.path("/employeemedicalprofile");
                }
                else {
                    if ($scope.RedirectFrom == "Encounter") {
                        $location.path("/encounterdetails");
                    }

                    else if ($scope.RedirectFrom == "Appointment" || $scope.RedirectFrom == "Addencounter") {
                        $location.path("/add");
                    }
                }

            };


        }
    )
    .controller('ViewPrevAppointmentCtrl',
              function ($scope, $modalInstance, sharedservices, toastr, $filter) {
                  $scope.modalClose = function () {
                      $modalInstance.close('');

                  };
              })


/////////////////////////// * Added for Administer Medication Alerts *//////////////////////////

    .controller('DeleteAMCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {

            $scope.message = 'Are you sure you would like to delete this record?';
            $scope.modalClose = function () {
                $scope.$parent.deleteElement = null;
                $scope.AMType = null;
                $modalInstance.close('');
            };

            $scope.deleteItem = function () {
                //$scope.$parent.deleteElement = true;                
                if ($scope.$parent.AMType == "NonPrescribed") {
                    $scope.$parent.removeNonPrescribedAM($scope.$parent.deleteElement);
                }
                else if ($scope.$parent.AMType == "Prescribed") {
                    $scope.$parent.removePrescribedAM($scope.$parent.deleteElement);
                }
                $modalInstance.close('');
            }
        }
    )

    .controller('DiscardAMDetailsCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you want to discard all your changes?';
            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                if ($scope.$parent.AMType == "NonPrescribed") {
                    $scope.$parent.CleareNonPAMObject();
                    $scope.$parent.showNonPrescribedDetail = false;
                }
                else if ($scope.$parent.AMType == "Prescribed") {
                    $scope.$parent.ClearePAMObject();
                    $scope.$parent.showPrescribedDetail = false;
                }
                $modalInstance.close('');
            };
        }
    )

    .controller('UnSavedAMCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.UnsavedMedicinesList = globalobject.currentObject;
            $scope.modalClose = function () {

                $modalInstance.close('');
            };
        }
    )

    .controller('AddAMCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you would like to add another medication?';

            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                if ($scope.$parent.AMType == "NonPrescribed") {
                    $scope.$parent.updateNonPAM = false;
                    $scope.$parent.PreviousDosage = 0;
                    $scope.$parent.showNonPrescribedDetail = true;
                }
                else if ($scope.$parent.AMType == "Prescribed") {
                    $scope.$parent.updatePAM = false;
                    $scope.$parent.showPrescribedDetail = true;
                }
                $modalInstance.close('');
            };
        }
    )

    .controller('SwitchAMCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'You are about to lose previous meditation records.Do you want to proceed ?';

            $scope.modalClose = function () {
                if ($scope.$parent.AMType == "NonPrescribed") {
                    $scope.$parent.NonPrescription = true;
                }
                else if ($scope.$parent.AMType == "Prescribed") {
                    $scope.$parent.Prescription = true;
                }
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                if ($scope.$parent.AMType == "NonPrescribed") {
                    $scope.$parent.nonprescibedList = [];
                    $scope.$parent.CleareNonPAMObject();
                }
                else if ($scope.$parent.AMType == "Prescribed") {
                    $scope.$parent.prescibedList = [];
                    $scope.$parent.ClearePAMObject();
                }
                $modalInstance.close('');
            };
        }
    )

////////////////////////// * Added for Administer Immunization Alerts * ////////////////////////////

    .controller('DeleteAICtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {

            $scope.message = 'Are you sure you would like to delete this record?';
            $scope.modalClose = function () {
                $scope.$parent.deleteElement = null;
                $modalInstance.close('');
            };

            $scope.deleteItem = function () {
                var index = $scope.AIDetailList.indexOf($scope.$parent.deleteElement);
                if ($scope.$parent.updateIndex == index) {
                    $scope.$parent.ClearAIDetailObject();
                    $scope.$parent.showAIDetail = false;
                }
                $scope.$parent.AIDetailList.splice(index, 1);
                $modalInstance.close('');
            }
        }
    )

    .controller('DiscardAIDetailsCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you want to discard all your changes?';
            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                $scope.$parent.ClearAIDetailObject();
                $scope.$parent.showAIDetail = false;
                $modalInstance.close('');
            };
        }
    )

    .controller('UnSavedAICtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.UnsavedMedicinesList = [];

            $.each(globalobject.currentObject, function (index, value) {
                var obj = {};
                obj.MedicineName = value.ImmunizationType;
                obj.MedicationLotNumber = value.LotNumber;
                $scope.UnsavedMedicinesList.push(obj);
            });

            $scope.modalClose = function () {
                $modalInstance.close('');
            };
        }
    )

    .controller('AddAICtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you would like to add another Immunization?';

            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                $scope.$parent.updateAI = false;
                $scope.$parent.PreviousDosage = 0;
                $scope.$parent.showAIDetail = true;
                $modalInstance.close('');
            };
        }
    )

///////////Added for Drug&Alcohol ///////////////////////////////

    .controller('AddDATCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you would like to add another Drug-Alcohol Test?';

            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {

                $scope.$parent.updateDAT = false;
                $scope.$parent.showDATDetail = true;
                $modalInstance.close('');
            };
        }
    )


   .controller('DiscardDATDetailsCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you want to discard all your changes?';
            $scope.modalClose = function () {
                $modalInstance.close('');
            };
            $scope.modalOk = function () {
                $scope.$parent.ClearDATObject();
                $scope.$parent.showDATDetail = false;
                $modalInstance.close('');
            };
        }
    )

     .controller('showRevisedBaselineCtrl',
        function ($scope, $modalInstance, sharedservices, utilityservices, toastr, $filter, globalobject) {
            $scope.cancelBtnName = 'No';
            $scope.okBtnName = 'Yes';
            $scope.message = 'Are you sure you want to discard all your changes?';
            $scope.modalCancel = function () {
                $modalInstance.close('');
            };
            $scope.modalSave = function () {

                if ($scope.comments == null || $scope.comments == "") {
                    utilityservices.notify("warning", $filter('translate')('msgRequiredfieldmustbecompleted'));
                }
                else {
                    $scope.$parent.RevisedBaselineComments($scope.comments);
                    $modalInstance.close('');
                }
            };
        }
    )
     .controller('RescheduleActionModalCtrl',
        function ($scope, $modalInstance, $filter, $location, utilityservices, globalobject, sharedservices, toastr) {

            $scope.currentObject = globalobject.currentObject;
            $scope.ReasonCancellationList = globalobject.ReasonCancellationList;
            $scope.RescheduleReasonList = globalobject.RescheduleReasonList;
            $scope.appointmentrescheduleReasonID = globalobject.currentObject.appointmentrescheduleReasonID;
            $scope.reschedulesendNotification = true;
            $scope.cancelsendNotification = true;
            var params = $scope;
            var configs;
            $scope.resDate = new Date();
            var date = new Date();
            var timeNow = $filter('date')(date, 'HH:mm');

            $scope.timeInHours = timeNow.split(':')[0];
            $scope.timeInMinutes = timeNow.split(':')[1];
            $scope.TimeHour = timeNow.split(':')[0];
            $scope.TimeMin = timeNow.split(':')[1];

            $scope.modalClose = function () {
                $modalInstance.close('Cancel');
            };

            function ValidateAppointmentDate(ValidateDate, type) {
                var today = new Date();
                var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                var AppointmentDate = new Date(ValidateDate);
                if (type == "appointment") {
                    if (AppointmentDate < date) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (AppointmentDate > date) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }

            // RESCHEDULE APPOINTMENT
            $scope.rescheduleAppointment = function () {

                $scope.CurrentTime = sharedservices.setTime($scope.TimeHour, $scope.TimeMin);
                $scope.rescheduleTime = sharedservices.setTime($scope.timeInHours, $scope.timeInMinutes);
                $scope.today = new Date();
                if ($scope.resDate == null || $scope.timeInHours == "" || $scope.timeInMinutes == "" || $scope.appointmentrescheduleReasonID == null || $scope.appointmentrescheduleReasonID == '') {
                    utilityservices.notify("warning", $filter('translate')('msgRequiredfieldmustbecompleted'));
                }
                else if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "no" && ValidateAppointmentDate($scope.resDate, "appointment")) {
                    utilityservices.notify("warning", $filter('translate')('msgAppointmentCannotbescheduledtoPreviousDates')); //$filter('translate')('msgRequiredfieldmustbecompleted')
                }
                else if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "no" && moment($scope.resDate).isBefore($scope.today) && moment($scope.rescheduleTime).isBefore($scope.CurrentTime)) {

                    utilityservices.notify("warning", $filter('translate')('msgPasttimeCantbeallowedPleaseenterFuturetime'));
                }
                else {
                    var msg = $filter('translate')('msgRescheduleAppointmentsuccessfully');
                    if ($scope.reschedulesendNotification == undefined) $scope.reschedulesendNotification = false;
                    var test = $scope.VisitDate;
                    configs = {
                        url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/RescheduleAppointment",
                        data: { appointmentDetailID: $scope.currentObject.AppointmentDetailID, appointmentDate: $scope.currentObject.appointmentDate, appointmentTime: $scope.timeInHours + ':' + $scope.timeInMinutes, appointmentrescheduleReasonID: $scope.appointmentrescheduleReasonID,
                            EmployeePK: $scope.currentObject.EmployeePK, sendNotification: $scope.reschedulesendNotification, allowDuplicate: $scope.currentObject.PersonnelTypeID != 1003 ? $scope.$parent.allowDuplicate : true
                        }
                    };
                    sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            // Fetch data
                            if (data.d.Object) {
                                if (data.d.Message == "AlreadyExists" || data.d.Message == "Duplicatetime") {
                                   
                                    if ($scope.$parent != null) { $scope.$parent.DuplicateExists = data.d.Message; }
                                    else { $scope.DuplicateExists = data.d.Message; }

                                    globalobject.currentObject.AppointmentDetailID = $scope.currentObject.AppointmentDetailID;
                                    globalobject.currentObject.appointmentDate = new Date($scope.resDate);
                                    globalobject.currentObject.AppointmentTimeIn = $scope.timeInHours + ':' + $scope.timeInMinutes;
                                    globalobject.currentObject.appointmentrescheduleReasonID = $scope.appointmentrescheduleReasonID;
                                    globalobject.currentObject.reschedulesendNotification = $scope.reschedulesendNotification;
                                    $scope.DuplicateAppointments();
                                }
                                else {
                                    utilityservices.notify("success", msg);
                                    if (globalobject.currentEncounter.screenType == 'EmployeeMedicalProfile') {
                                        $scope.$parent.SelectEmployeeDetails();
                                    }
                                    else {
                                        $scope.getAppointments();
                                        $scope.getEncounters();
                                        $scope.$parent.allowDuplicate = false;
                                    }
                                }
                            }
                            else {
                                toastr.error("Appointment already exists for today.");
                            }
                            $modalInstance.close('');
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
                }
            }
        }
    )

    .controller('duplicateAppointmentCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject, utilityservices, $location) {
            $scope.modalClose = function () {
                $scope.$parent.allowDuplicate = false;
//                if (globalobject.DuplicateAppointmentfromScreen == "AppCentral" || globalobject.DuplicateAppointmentfromScreen == 'EmployeeMedicalProfile') {
//                    $scope.CancelDuplicateAppointments();
//                }
                $modalInstance.close('');
            };
            $scope.cancelBtnName = $filter('translate')('btnNo');
            $scope.okBtnName = $filter('translate')('btnYes');
            var msg = $filter('translate')('msgRescheduleAppointmentsuccessfully');
            $scope.modalOk = function () {
                $modalInstance.close('');

                if (globalobject.DuplicateAppointmentfromScreen == "CreateEncounter") {
                    $location.path("/encounterdetails/");
                }
                else
                    if (globalobject.DuplicateAppointmentfromScreen == "AppCentral" || globalobject.DuplicateAppointmentfromScreen == 'EmployeeMedicalProfile') {

                        configs = {
                            url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/RescheduleAppointment",
                            data: { appointmentDetailID: globalobject.currentObject.AppointmentDetailID, appointmentDate: globalobject.currentObject.appointmentDate, appointmentTime: globalobject.currentObject.AppointmentTimeIn,
                                appointmentrescheduleReasonID: globalobject.currentObject.appointmentrescheduleReasonID, EmployeePK: globalobject.currentObject.EmployeePK, sendNotification: globalobject.currentObject.reschedulesendNotification, allowDuplicate: true
                            }
                        };
                        sharedservices.xhrService(configs)
                         .success(function (data, status, headers, config) {
                             utilityservices.notify("success", msg);
                             if (globalobject.DuplicateAppointmentfromScreen == 'EmployeeMedicalProfile') {
                                 $scope.SelectEmployeeDetails();
                             }
                             else {
                                 $scope.getAppointments();
                                 $scope.getEncounters();
                                 $scope.$parent.allowDuplicate = false;
                             }
                         })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
                    }
                    else {
                        $scope.$parent.allowDuplicate = true;
                        if ($scope.$parent.allowEncounter == false)
                            $scope.save();
                        else {
                            $scope.$parent.SaveandContinueflag = true;
                            $scope.SaveandContinue();
                        }
                    }
            }
        }
    )

      .controller('duplicatetimeAppointmentCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {

            $scope.AppointmentDate = $scope.$parent.AppointmentDate;
            $scope.AppTimein = $scope.$parent.AppTimein;
            $scope.okBtnName = "Ok";
            $scope.modalOk = function () {
                $modalInstance.close('');
            }
        }
    )

    .controller('DeleteDATCtrl',
        function ($scope, $modalInstance, sharedservices, toastr, $filter, globalobject) {

            $scope.message = 'Are you sure you would like to delete this record?';
            $scope.modalClose = function () {
                $scope.$parent.deleteElement = null;
                $modalInstance.close('');
            };

            $scope.deleteItem = function () {

                var index = $scope.DATList.indexOf($scope.item);
                $scope.DATList.splice(index, 1);
                $modalInstance.close('');
            }
        })
