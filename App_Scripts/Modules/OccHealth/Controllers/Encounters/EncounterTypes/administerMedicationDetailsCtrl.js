(function () {
    angular.module("app")
        .controller("administerMedicationDetailsCtrl", administerMedicationDetailsCtrl);

    function administerMedicationDetailsCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;
        $scope.IsDisable = false;
        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: 1021
            //            resultsFormId: undefined,
            //            investigationFormId: undefined
        };
        $scope.msg = $filter('translate')('msgReviewPreviousMedicationAdministrationAndOSHALimitsCreateRecordable');

        $scope.FieldDisabled = false;

        var strGlobalAdministerMedicationID = globalobject.currentEncounter.AdministerMedicationID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
        $scope.createdBy = globalobject.currentSession.userid;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.administerMedicationDetails = {
            AdministerMedicationID: strGlobalAdministerMedicationID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , AdministerMedicationID: 0
            , SampleID: ""
            , WorkRelated: null
            , IncidentID: null
            , PrescriptionProvided: false
            , PrescribedMedication: ""
            , MedicineName: ""
            , PrescriptionTime: ""
            , DrawPrescriptionTime: ""
            , hourStep: ""
            , minuteStep: ""
            , PrescriptionFilledDate: null
            , HealthCareProviderID: null
            , PrescriptionDose: ""
            , MedicationFrequencyID: null
            , MedicationRouteID: null
            , MedicationLotNumber: ''
            , MedicineExpirationDate: null
            , MedicineDose: ""
            , AdverseReaction: false
            , AdverseReactionDescription: ''
            , AdditionalMedication: false
            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: null
            , DiagnosticMethodID: null
            , ScheduleFollowUp: false
            //            , StatusTypeID: ""
            , PrescribedBy: ""
            , CreatedBy: 0
            //, CreatedDate: ''
            , LastUpdatedBy: 0
            //, LastUpdatedDate: ''
            , CurrentDosage: null
            , DrugDetailID: 0

        };
        // 
        $scope.PAMDetails = {
            AdministerMedicationID: strGlobalAdministerMedicationID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , AdministerMedicationDetailID: 0
            , PrescriptionProvided: true
             , Prescription: true
            , PrescribedMedication: ""
            , MedicineName: ""
            , PrescriptionTime: ""
            , DrawPrescriptionTime: ""
            , hourStep: ""
            , minuteStep: ""
            , PrescriptionFilledDate: null
            , PrescriptionDose: ""
            , PrescriptionDoseUOMTypeId: null
            , PrescriptionDoseUOM: ''
            , MedicationFrequencyID: null
            , MedicationFrequencyTitle: ""
            , MedicationRouteID: null
            , MedicationRouteTitle: ""
            , MedicationLotNumber: ''
            , MedicineExpirationDate: null
            , MedicineDose: ""
            , MedicineDoseUOMTypeId: null
            , MedicineDoseUOM: ""
            , AdverseReaction: false
            , AdverseReactionDescription: ""
            , HealthCareProviderID: null
            , HealthCareProvider: ""
            , CurrentDosage: null
            , DrugDetailID: 0
        };

        $scope.NONPAMDetails = {
            AdministerMedicationID: strGlobalAdministerMedicationID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , AdministerMedicationDetailID: 0
            , PrescriptionProvided: false
            , NonPrescription: true
            , PrescribedMedication: ""
            , MedicineName: ""
            , PrescriptionTime: ""
            , DrawPrescriptionTime: ""
            , hourStep: ""
            , minuteStep: ""
            , PrescriptionFilledDate: null
            , PrescriptionDose: ""
            , PrescriptionDoseUOMTypeId: null
            , PrescriptionDoseUOM: ''
            , MedicationFrequencyID: null
            , MedicationFrequencyTitle: ""
            , MedicationRouteID: null
            , MedicationRouteTitle: ""
            , MedicationLotNumber: ''
            , MedicineExpirationDate: null
            , MedicineDose: ""
            , MedicineDoseUOMTypeId: null
            , MedicineDoseUOM: ""
            , AdverseReaction: false
            , AdverseReactionDescription: ""
            , HealthCareProviderID: null
            , HealthCareProvider: ""
            , CurrentDosage: null
            , DrugDetailID: 0
        };

        var ReadyToSavePrescribed = true;
        var ReadyToSaveNonPrescribed = true;

        $scope.showPrescribedDetail = true;
        $scope.showNonPrescribedDetail = true;
        $scope.animationsEnabled = true;
        $scope.deleteElement = null;

        $scope.prescibedList = [];
        $scope.nonprescibedList = [];

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // TIMEncounterStatus            E
        /*    ReasonEncounterIncomplete  
        * sharDiagnosticMethodID         edservices.setTime( hour, minutes) function
        * hourScheduleFollowUp            and minute arguments can be integer or string
        */
        // TIME STEPS

        $scope.DrawPrescriptionTime = new Date();
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        $scope.PreviousDosage = 0;
        //***************************************************************Getting Look Up Value************************************************************//

        $scope.MedicationFrequencyList = globalobject.MedicationFrequencyList;
        $scope.MedicationRouteList = globalobject.RouteAdministerMedicationList;
        $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
        $scope.TestTypeList = globalobject.TestTypeList;
        $scope.LiquidUOMList = globalobject.LiquidUOMList;
        $scope.CommonUnitsOfMeasurementList = globalobject.CommonUnitsOfMeasurementList;
        $scope.ResultPermissibleRangeList = globalobject.ResultPermissibleRangeList;

        //***************************************************************For look up tables****************************************************************//
        function CheckForInUseIdsDetails() {
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';

            setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 1000);
            setTimeout(function () { $('#ddlFollowType').val($scope.scheduleFollowUp.FollowUpTypeID); }, 1000);


        }

        var date = new Date();
        $scope.Hour = date.getHours();
        $scope.Minut = date.getMinutes();
        date.setHours($scope.Hour);
        date.setMinutes($scope.Minut);
        $scope.time = date;

        var date = new Date();
        var timeNow = date.getHours() + ":" + date.getMinutes()
        $scope.Hour = timeNow.substring(0, 2);
        $scope.Minut = timeNow.substr(3, 2);

        $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }
        //********************************************************For Characters left calculation*************************************************************//
        //        $scope.$watch('administerMedicationDetails.AdverseReactionDescription', function (newVal, oldVal) {
        //            if (newVal != undefined)
        //                if (newVal.length > 2000) {
        //                    $scope.administerMedicationDetails.AdverseReactionDescription = oldVal;
        //                }
        //        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //********************************************************Get the Administer Medication Details*******************************************************//

        $scope.getEncounterDetails = function () {
            globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);

            globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

            var configs = {
                url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
            };
            sharedservices.xhrService(configs)
                    .then(function (response) {
                        globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                        globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                        globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalAdministerMedicationID = globalobject.currentEncounter.ExposureEncounterSummaryID;

                        strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = response.data.d.Object[0].AppointmentEncounterTypeID;
                        //                        $scope.getAdministerMedicationDetails();
                        $scope.getMedicineDetails();
                    });
        };

                $scope.getEncounterDetails();

                $scope.resetSchedulefollwupdetails = function () {
                    $scope.administerMedicationDetails.ScheduleFollowUp = false;
                }

        $scope.getAdministerMedicationDetails = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/AMService.asmx/GetAMDetails",
                data: { AdministerMedicationID: strGlobalExposureEncounterSummaryID, AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID }
            };

            sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
        };

        function getDetailDataSuccess(data, status, headers, config) {

            if (data.d.IsOK) {
                // toastr.success('call Success');
                //                console.log(data);
                sharedservices.parseDates(data.d.Object);
                $scope.administerMedicationDetails = data.d.Object;

                if ($scope.administerMedicationDetails.ScheduleFollowUp) {
                    $scope.FieldDisabled = true;
                }

                $scope.prescibedList = []
                $scope.nonprescibedList = []

                if (data.d.Object.AMDetailList != null && data.d.Object.AMDetailList != undefined && data.d.Object.AMDetailList.length > 0) {
                    $.each(data.d.Object.AMDetailList, function (index, value) {
                        if (value.PrescriptionProvided == false) {
                            $scope.nonprescibedList.push(value);
                        }
                        else {
                            $scope.prescibedList.push(value);
                        }
                    });
                }
                if ($scope.nonprescibedList == null || $scope.nonprescibedList == undefined || $scope.nonprescibedList.length == 0) {
                    $scope.NonPrescription = false;
                }
                else {
                    $scope.NonPrescription = true;
                    $scope.showNonPrescribedDetail = false;
                }

                if ($scope.prescibedList == null || $scope.prescibedList == undefined || $scope.prescibedList.length == 0) {
                    $scope.Prescription = false;
                }
                else {
                    $scope.Prescription = true;
                    $scope.showPrescribedDetail = false;
                }


                if ($scope.administerMedicationDetails.MedicationLotNumber != null || $scope.administerMedicationDetails.MedicationLotNumber == '') {

                    $scope.lotNumberList = [{ LotNumber: $scope.administerMedicationDetails.MedicationLotNumber,
                        ExpirationDate: $scope.administerMedicationDetails.MedicineExpirationDate, DosageUnitOfMeasurementID: $scope.administerMedicationDetails.MedicineDoseUOMTypeId
                    }];
                }

                if ($scope.administerMedicationDetails.ScheduleFollowUp == null || $scope.administerMedicationDetails.ScheduleFollowUp == undefined || isNaN($scope.administerMedicationDetails.ScheduleFollowUp)) {
                    $scope.administerMedicationDetails.ScheduleFollowUp = false;             //Default 'No'
                }
                if ($scope.administerMedicationDetails.PrescriptionProvided == null || $scope.administerMedicationDetails.PrescriptionProvided == undefined || isNaN($scope.administerMedicationDetails.PrescriptionProvided)) {
                    $scope.administerMedicationDetails.PrescriptionProvided = false;             //Default 'No'
                }
                if ($scope.administerMedicationDetails.EncounterStatus == null || $scope.administerMedicationDetails.EncounterStatus == undefined || isNaN($scope.administerMedicationDetails.EncounterStatus)) {
                    $scope.administerMedicationDetails.EncounterStatus = 1002;           //Default 'Yes'
                }
                if ($scope.administerMedicationDetails.PrescriptionTime != null && $scope.administerMedicationDetails.PrescriptionTime != undefined) {
                    var d = new Date();
                    d.setHours($scope.administerMedicationDetails.PrescriptionTime.split(':')[0]);
                    d.setMinutes($scope.administerMedicationDetails.PrescriptionTime.split(':')[1]);
                    $scope.DrawPrescriptionTime = d;
                }
                //                if ($scope.administerMedicationDetails.AdministerMedicationID != 0)
                $scope.getScheduleFollowUpDetails();


                $scope.GetCurrentDosageByLotNumber();
                //                if (data.d.Object.MedicineDose != null && data.d.Object.MedicineDose != '' && data.d.Object.MedicineDose != undefined) {
                //                    $scope.PreviousDosage = data.d.Object.MedicineDose;
                //                }
            }

        };
        function getDetailDataError(data, status, headers, config) {
            utilityservices.notify("error");
        };

        $scope.keyPressWithDot = function (e, obj) {
            var textNewValue = $('#' + obj).val();
            var exp = String.fromCharCode(e.keyCode)
            var r = new RegExp("^[.][0-9]+$|^[0-9]*[.]{0,1}[0-9]*$");
            if (exp.match(r) == null) {
                e.keyCode = 0;
                utilityservices.notify("numbers");
                if (e.preventDefault) e.preventDefault();
                return false;
            }
            else {
                var index = textNewValue.indexOf('.');
                if (index != -1 && exp == '.') {
                    e.keyCode = 0;
                    $scope.msg = $filter('translate')('msgOnedotisvalidonly');
                    toastr.warning($scope.msg);
                    if (e.preventDefault) e.preventDefault();
                    return false;
                }
                else {
                    var textOldValue = textNewValue + exp;
                    var length = textOldValue.length;
                    if (index != -1 && index + 4 == length) {
                        e.keyCode = 0;
                        $scope.msg = $filter('translate')('msgValiduptotwodecimal');
                        toastr.warning($scope.msg);
                        if (e.preventDefault) e.preventDefault();
                        return false;
                    }
                    if (length > 3 && textOldValue.indexOf('.') == -1) {
                        e.keyCode = 0;
                        $scope.msg = $filter('translate')('msgValueShouldBeLessThan1000');
                        toastr.warning($scope.msg);
                        if (e.preventDefault) e.preventDefault();
                        return false;
                    }
                    else {
                        if (textOldValue.indexOf('.') == -1) {
                            var newValue = $('#' + obj).val();
                            if ($('#' + obj).val() != '') {
                                if (newValue == '0' && (e.keyCode == 48 || e.keyCode == 96)) {
                                    e.keyCode = 0;
                                    if (e.preventDefault) e.preventDefault();
                                    return false;
                                }
                                else {
                                    newValue = parseInt($('#' + obj).val());
                                }
                            }
                            $('#' + obj).val(newValue);
                        }
                    }
                }
                if (textOldValue == '.') {
                    $('#' + obj).val("0");
                }
            }
        };
        //****************************************************************Get incident list record *********************************************************//



        $scope.getIncidentList = function () {
            var configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
            };
            sharedservices.xhrService(configs)
                     .success(function (data, status, headers, config) {
                         if (data.d.IsOK) {
                             $scope.incidentList = data.d.Object;
                         }
                     })
                     .error(function (data, status, headers, config) {

                     });
        }

        $scope.getIncidentList();
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //***************************************************************Save Encounter Type Details*********************************************************//
        $scope.saveAMDetails = function () {

            $scope.saveStatus = true;
            $scope.msg = '';

            if ($scope.showNonPrescribedDetail && $scope.NonPrescription)
                $scope.SaveToNonPecribedList();
            else
                ReadyToSaveNonPrescribed = true;

            if (ReadyToSaveNonPrescribed) {
                if ($scope.showPrescribedDetail && $scope.Prescription)
                    $scope.SaveToPecribedList();
                else
                    ReadyToSavePrescribed = true;
            }

            if (ReadyToSaveNonPrescribed && ReadyToSavePrescribed) {
                if ($scope.NonPrescription && $scope.nonprescibedList.length == 0) {
                    ReadyToSaveNonPrescribed = false;
                    toastr.warning("Non-Prescribed Medicine is set to Yes, but no data available.");
                }
            }

            if (ReadyToSaveNonPrescribed && ReadyToSavePrescribed) {
                if ($scope.Prescription && $scope.prescibedList.length == 0) {
                    ReadyToSavePrescribed = false;
                    toastr.warning("Prescribed Medicine is set to Yes, but no data available.");
                }
            }

            if (ReadyToSaveNonPrescribed && ReadyToSavePrescribed) {

                //To Solve Server Date Time Issue.
                //            $scope.administerMedicationDetails.DrawDate = new Date($scope.DrawDate).toDateString();

                $scope.administerMedicationDetails.PrescriptionTime = $('#hdnPt').val();


                if ($scope.ExpectedDueDate != null) {
                    $scope.administerMedicationDetails.ExpectedDueDate = new Date($scope.ExpectedDueDate).toDateString();
                }

                $scope.administerMedicationDetails.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;

                if ($scope.administerMedicationDetails.EncounterStatus == null) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgEncounterStatusfieldmustbecompleted');
                }
                else if ($scope.administerMedicationDetails.EncounterStatus == 1003 && ($scope.administerMedicationDetails.ReasonEncounterIncomplete == null || $scope.administerMedicationDetails.ReasonEncounterIncomplete == '')) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }


                else if ($scope.administerMedicationDetails.WorkRelated != true && $scope.administerMedicationDetails.WorkRelated != false) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
                //Check only if the schedule follow up value is set to 'yes'

                if ($scope.administerMedicationDetails.ScheduleFollowUp) {

                    $scope.ValidateSF();
                }

                if ($scope.saveStatus) {
                    $scope.administerMedicationDetails.AMDetailList = [];
                    $scope.administerMedicationDetails.AMDetailList = $scope.administerMedicationDetails.AMDetailList.concat($scope.prescibedList);
                    $scope.administerMedicationDetails.AMDetailList = $scope.administerMedicationDetails.AMDetailList.concat($scope.nonprescibedList);

                    // $scope.PreviousDosage = $scope.administerMedicationDetails.MedicineDose;
                    $scope.showLoadingOverlay = true;
                    $scope.loadingAction = true;
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/AMService.asmx/SaveAMDetails",
                        data: { AMDetailsObj: $scope.administerMedicationDetails }
                    };

                    sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                }
                else {
                    $scope.saveStatus = true;
                    if ($scope.msg != "") {
                        toastr.warning($scope.msg);
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
                }
            }

        };

        function saveDetailDataSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                strGlobalExposureEncounterSummaryID = data.d.Object.AdministerMedicationID;
                $scope.administerMedicationDetails.AdministerMedicationID = strGlobalExposureEncounterSummaryID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalExposureEncounterSummaryID;

                $scope.frmAdministerMed.$dirty = false;

                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/AMService.asmx/getFailedMedicineDetails",
                    data: { AdministerMedicationID: data.d.Object.AdministerMedicationID }
                };

                sharedservices.xhrService(configs)
                  .success(function (data, status, headers, config) {
                      if (data.d.IsOK) {
                          $scope.getFailedMedicineDetails(data.d.Object);
                      }
                  })
                  .error(function () {
                      toastr.error($filter('translate')('msgSeriveerror'));
                  })

                $scope.prescibedList = []
                $scope.nonprescibedList = []

                if (data.d.Object.AMDetailList != null && data.d.Object.AMDetailList != undefined && data.d.Object.AMDetailList.length > 0) {
                    $.each(data.d.Object.AMDetailList, function (index, value) {
                        if (value.PrescriptionProvided == false) {
                            $scope.nonprescibedList.push(value);
                        }
                        else {
                            $scope.prescibedList.push(value);
                        }
                    });
                }

                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    $scope.msg = $filter('translate')('msgReviewPreviousMedicationAdministrationAndOSHALimitsCreateRecordable');
                    toastr.success($scope.msg);
                }
                if ($scope.administerMedicationDetails.ScheduleFollowUp == true) {

                    $scope.saveScheduleFollowUpDetails();
                }
                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    if ($scope.administerMedicationDetails.ScheduleFollowUp == false) {
                        $scope.emptySchedulefollowupObject();
                        toastr.success($filter('translate')('msgReviewPreviousMedicationAdministrationAndOSHALimitsCreateRecordable'));
                    }
                }
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
              
            }
        };

        function saveDetailDataError(data, status, headers, config) {
            $scope.showLoadingOverlay = false;
            $scope.loadingAction = false;
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //******************************************************************Cancel********************************************************************************//
        $scope.cancelAMDetails = function () {

            if ($scope.frmAdministerMed.$dirty) {

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

        //******************************************************************Inventory Medicine Details**************************************************************//
        $scope.getMedicineDetails = function () {
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetMedicineDetailsFromInventory",
                //data: { ExposureEncounterSummaryID: strGlobalAdministerMedicationID, EncounterDetailID: globalobject.currentEncounter.SelectedEncounterTypeID }
                data: { InventoryTypeID: 1001} // 1001 is used for medicine details
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                if (data.d.IsOK) {
                    $scope.medicineDetailsList = data.d.Object.MedicineDetailList;
                    $scope.getAdministerMedicationDetails();
                }

            })
            .error(function (data, status, headers, config) {

            });
        }


        $scope.onSelectMedicine = function ($item, $model, $label) {
            $scope.NONPAMDetails.DrugDetailID = $item.ID;
            //code to get lot #,UOM and expiration date based on $item.ID
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetLotNumberList",
                data: { DrugDetailID: $item.ID }
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                if (data.d.IsOK) {
                    sharedservices.parseDates(data.d.Object);
                    $scope.lotNumberList = data.d.Object;
                    $scope.NONPAMDetails.MedicationLotNumber = null;
                    $scope.NONPAMDetails.MedicineExpirationDate = '';
                    $scope.NONPAMDetails.MedicineDoseUOMTypeId = null;
                    console.log($scope.lotNumberList);
                }

            })
            .error(function (data, status, headers, config) {

            });
        }


        $scope.onSelectLotNumber = function ($item, $model, $label) {
            $scope.NONPAMDetails.MedicationLotNumber = $item.LotNumber;
            $scope.NONPAMDetails.MedicineExpirationDate = $item.ExpirationDate;
            $scope.NONPAMDetails.MedicineDoseUOMTypeId = $item.DosageUnitOfMeasurementID;
            $scope.GetCurrentDosageByLotNumber();
        }

        $scope.getUOMType = function (uom) {
            var obj = _.where($scope.CommonUnitsOfMeasurementList, { 'ID': uom })[0];
            if (obj != undefined) {
                return obj.Text;
            }
            else {
                return '';
            }
        };

        $scope.getMedicineName = function (med) {
            var obj = _.where($scope.medicineDetailsList, { 'Text': med })[0];
            if (obj != undefined) {
                return obj.ID;
            }
            else {
                return 0;
            }
        };

        $scope.GetCurrentDosageByLotNumber = function () {
            if ($scope.NONPAMDetails.DrugDetailID == null) {
                $scope.NONPAMDetails.DrugDetailID = $scope.getMedicineName($scope.NONPAMDetails.MedicineName);
            }
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetCurrentDosageByLotNumber",
                data: { TypeID: $scope.NONPAMDetails.DrugDetailID, LotNumber: $scope.NONPAMDetails.MedicationLotNumber, Type: 'AM' }
            };
            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.NONPAMDetails.CurrentDosage = data.d.Object.CurrentDosage;
                        if ($scope.NONPAMDetails.CurrentDosage == null || $scope.NONPAMDetails.CurrentDosage == '' || $scope.NONPAMDetails.CurrentDosage == 0) {
                            $scope.NONPAMDetails.CurrentDosage = 0;
                        }
                        else {
                            $scope.NONPAMDetails.CurrentDosage = data.d.Object.CurrentDosage;
                        }
                    }
                })
                .error(function (data, status, headers, config) {

                });
        };

        //**************************New Enhancement for multiple medication****************************************//
        $scope.updatePAM = false;
        $scope.updateNonPAM = false;
        $scope.updatePAMindex = -1;
        $scope.updateNonPAMindex = -1;


        $scope.ClearePAMObject = function () {
            $scope.PAMDetails = null;
            $scope.PAMDetails = {
                AdministerMedicationID: strGlobalAdministerMedicationID
                , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
                , AdministerMedicationDetailID: 0
                , PrescriptionProvided: true
                , Prescription: true
                , PrescribedMedication: ""
                , MedicineName: ""
                , PrescriptionTime: ""
                , DrawPrescriptionTime: ""
                , hourStep: ""
                , minuteStep: ""
                , PrescriptionFilledDate: null
                , PrescriptionDose: ""
                , PrescriptionDoseUOMTypeId: null
                , PrescriptionDoseUOM: ''
                , MedicationFrequencyID: null
                , MedicationFrequencyTitle: ""
                , MedicationRouteID: null
                , MedicationRouteTitle: ""
                , MedicationLotNumber: ''
                , MedicineExpirationDate: null
                , MedicineDose: ""
                , MedicineDoseUOMTypeId: null
                , MedicineDoseUOM: ""
                , AdverseReaction: false
                , AdverseReactionDescription: ""
                , HealthCareProviderID: null
                , HealthCareProvider: ""
                , CurrentDosage: null
                , DrugDetailID: 0

            };
        }
        $scope.CleareNonPAMObject = function () {

            $scope.NONPAMDetails = {
                AdministerMedicationID: strGlobalAdministerMedicationID
                , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
                , AdministerMedicationDetailID: 0
                , PrescriptionProvided: false
                , NonPrescription: true
                , PrescribedMedication: ""
                , MedicineName: ""
                , PrescriptionTime: ""
                , DrawPrescriptionTime: ""
                , hourStep: ""
                , minuteStep: ""
                , PrescriptionFilledDate: null
                , PrescriptionDose: ""
                , PrescriptionDoseUOMTypeId: null
                , PrescriptionDoseUOM: ''
                , MedicationFrequencyID: null
                , MedicationFrequencyTitle: ""
                , MedicationRouteID: null
                , MedicationRouteTitle: ""
                , MedicationLotNumber: ''
                , MedicineExpirationDate: null
                , MedicineDose: ""
                , MedicineDoseUOMTypeId: null
                , MedicineDoseUOM: ""
                , AdverseReaction: false
                , AdverseReactionDescription: ""
                , HealthCareProviderID: null
                , HealthCareProvider: ""
                , CurrentDosage: null
                , DrugDetailID: 0

            };
        }

        $scope.SaveToPecribedList = function () {
            var IsvalidData = true;
            if (ValidatePAMForm()) {
                utilityservices.notify("required");
                IsvalidData = false;
            }
            var currentDate = moment().startOf('day');
            var PrescriptionFilledDate = moment($scope.PAMDetails.PrescriptionFilledDate).startOf('day');

            if (IsvalidData && (moment(PrescriptionFilledDate)).isAfter(moment(currentDate))) {
                IsvalidData = false;
                toastr.warning($filter('translate')('msgPrescriptionFilledDateShouldNotBeGreaterThanCurrentDate'));
            }
            ReadyToSavePrescribed = IsvalidData;
            if (IsvalidData) {
                if (!$scope.updatePAM) {
                    $scope.prescibedList.push($scope.PAMDetails);
                }
                else {
                    $scope.prescibedList[$scope.updatePAMindex] = $scope.PAMDetails;
                }
                $scope.ClearePAMObject();
                $scope.showPrescribedDetail = false;
            }

        };

        var SelectedNonPAMIndex = -1;
        $scope.SaveToNonPecribedList = function () {
            var IsvalidData = true;
            if (ValidateNonPAMForm()) {
                utilityservices.notify("required");
                IsvalidData = false;
            }
            if (IsvalidData && (moment($scope.NONPAMDetails.MedicineExpirationDate)).isBefore(moment())) {
                IsvalidData = false;
                toastr.warning('Medicine already Expired');
            }
            if (IsvalidData && parseFloat($scope.NONPAMDetails.MedicineDose) > (parseFloat($scope.PreviousDosage) + $scope.NONPAMDetails.CurrentDosage)) {
                IsvalidData = false;
                toastr.warning('Stock not enough. Try another Medicine');
            }
            var c = 0;
            if ($scope.nonprescibedList != null && $scope.nonprescibedList != undefined && $scope.nonprescibedList.length > 0) {
                $.each($scope.nonprescibedList, function (index, value) {
                    if (value.MedicineName == $scope.NONPAMDetails.MedicineName && value.MedicationLotNumber == $scope.NONPAMDetails.MedicationLotNumber) {
                        c = c + 1;
                    }
                });
                if (SelectedNonPAMIndex == -1) {
                    if (c >= 1) {
                        IsvalidData = false;
                        toastr.warning('Can not add duplicate medicine with same lot number.');
                    }
                }
                else {
                    if (c > 1) {
                        IsvalidData = false;
                        toastr.warning('Can not add duplicate medicine with same lot number.');
                    }
                }
                SelectedNonPAMIndex = -1;
            }
            //             angular.forEach($scope.nonprescibedList, function (nonprescibed) {
            //                 if (nonprescibed.MedicineName)
            //                return state;
            //            });
            ReadyToSaveNonPrescribed = IsvalidData;
            if (IsvalidData) {
                if (!$scope.updateNonPAM) {
                    $scope.nonprescibedList.push($scope.NONPAMDetails);
                }
                else {
                    $scope.nonprescibedList[$scope.updateNonPAMindex] = $scope.NONPAMDetails;
                }
                $scope.CleareNonPAMObject();
                $scope.showNonPrescribedDetail = false;
            }
        };



        $scope.$watch('NonPrescription', function handleNonPrescriptionSwitchChange(newValue, oldValue) {
            if (newValue == false && oldValue == true) {

                if ($scope.nonprescibedList.length > 0) {
                    $scope.switchMedication('NonPrescribed');
                }
            }
        });

        $scope.$watch('Prescription', function handlePrescriptionSwitchChange(newValue, oldValue) {
            if (newValue == false && oldValue == true) {

                if ($scope.prescibedList.length > 0) {
                    $scope.switchMedication('Prescribed');
                }
            }
        });

        $scope.DiscardPecribedDetail = function () {
            $scope.ClearePAMObject();
            $scope.showPrescribedDetail = false;

        };
        $scope.DiscardNonPecribedDetail = function () {
            $scope.CleareNonPAMObject();
            $scope.showNonPrescribedDetail = false;

        };


        $scope.AddPAMItem = function () {
            $scope.updatePAM = false;
            $scope.showPrescribedDetail = true;
        }
        $scope.AddNonPAMItem = function () {
            $scope.updateNonPAM = false;
            $scope.PreviousDosage = 0;
            $scope.showNonPrescribedDetail = true;
        }
        $scope.removeNonPrescribedAM = function (element) {
            var index = $scope.nonprescibedList.indexOf(element);
            $scope.nonprescibedList.splice(index, 1);
        }
        $scope.removePrescribedAM = function (element) {
            var index = $scope.prescibedList.indexOf(element);
            $scope.prescibedList.splice(index, 1);
        }
        $scope.SelectNonPAMedication = function (element, index) {
            $scope.updateNonPAM = true;
            if (element.MedicineDose != null && element.MedicineDose != '' || element.MedicineDose != undefined) {
                $scope.PreviousDosage = element.MedicineDose;
            }
            $scope.lotNumberList = [{ LotNumber: element.MedicationLotNumber,
                ExpirationDate: element.MedicineExpirationDate, DosageUnitOfMeasurementID: element.MedicineDoseUOMTypeId
            }];

            $scope.NONPAMDetails = element;
            $scope.showNonPrescribedDetail = true;
            $scope.updateNonPAMindex = index;
            SelectedNonPAMIndex = index;
        }
        $scope.SelectPAMedication = function (element, index) {
            $scope.updatePAM = true;
            $scope.PAMDetails = element;
            $scope.showPrescribedDetail = true;
            $scope.updatePAMindex = index;
        }
        //************************** Validate Prescibed and non prescribed medication form.*****************************************//
        function ValidatePAMForm() {
            if ($scope.Prescription) {
                if (utilityservices.ValidateField($scope.PAMDetails.MedicationRouteID) ||
                   utilityservices.ValidateField($scope.PAMDetails.MedicationFrequencyID) ||
                   utilityservices.ValidateField($scope.PAMDetails.PrescribedMedication)) {
                    return true;
                }
            }

        }
        function ValidateNonPAMForm() {
            if ($scope.NonPrescription) {
                if (utilityservices.ValidateField($scope.NONPAMDetails.MedicationRouteID) ||
                   utilityservices.ValidateField($scope.NONPAMDetails.MedicationFrequencyID) ||
                   utilityservices.ValidateField($scope.NONPAMDetails.MedicationLotNumber) ||
                   utilityservices.ValidateField($scope.NONPAMDetails.MedicineName) ||
                   utilityservices.CheckUndefineAndNull($scope.NONPAMDetails.AdverseReaction) ||
                   ($scope.NONPAMDetails.AdverseReaction == true && (utilityservices.ValidateField($scope.NONPAMDetails.AdverseReactionDescription)))) {
                    return true;
                }
            }
        }
        //******************************************************************************************************************//

        $scope.AMType = null;
        // OPEN MODALS
        $scope.removeAM = function (obj, type) {
            $scope.$parent.deleteElement = obj;
            globalobject.currentEncounter.screenType = "AM";
            $scope.AMType = type;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                controller: 'DeleteAMCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.DiscardAMDetail = function (type) {
            $scope.AMType = type;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'DiscardAMDetailsCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.addMedication = function (type) {
            var noModal = false;
            $scope.AMType = type;
            if (type == 'NonPrescribed') {
                if ($scope.showNonPrescribedDetail)
                    noModal = true;
            }
            if (type == 'Prescribed') {
                if ($scope.showPrescribedDetail)
                    noModal = true;
            }
            if (noModal)
                return false;
            else {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'AddAMCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }
        };

        $scope.switchMedication = function (obj) {
            $scope.AMType = obj;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'SwitchAMCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.getFailedMedicineDetails = function (obj) {
            globalobject.currentEncounter.screenType = "AM";
            globalobject.currentObject = obj;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/unsavedMedicine-modal.html',
                controller: 'UnSavedAMCtrl',
                size: 'lg',
                scope: $scope
            });
        };

        $scope.fun = function (type) {
            if (type == 1) {
                $scope.PAMDetails.MedicationRouteTitle = $('#ddlMedicationRoute').find("option:selected").text().trim();
            }
            else if (type == 2) {
                $scope.PAMDetails.MedicationFrequencyTitle = $('#ddlMedicationFrequency').find("option:selected").text().trim();
            }
            else if (type == 3) {
                $scope.PAMDetails.HealthCareProvider = $('#ddlHealthCareProvider').find("option:selected").text().trim();
            }
            else if (type == 4) {
                $scope.PAMDetails.PrescriptionDoseUOM = $('#ddlPrescriptionDoseUOM').find("option:selected").text().trim();
            }
            else if (type == 5) {
                $scope.NONPAMDetails.MedicineDoseUOM = $('#ddlMedicineDoseUOM').find("option:selected").text().trim();
            }
            else if (type == 6) {
                $scope.NONPAMDetails.MedicationRouteTitle = $('#ddlNONPAMMedicationRoute').find("option:selected").text().trim();
            }
            else if (type == 7) {
                $scope.NONPAMDetails.MedicationFrequencyTitle = $('#ddlNONPAMMedicationFrequency').find("option:selected").text().trim();
            }
        }
        setTimeout(function () { $scope.frmAdministerMed.$dirty = false; }, 1000);
        

    };

})();
