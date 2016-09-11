(function () {
    angular.module("app")
        .controller("administerImmunizationCtrl", administerImmunizationCtrl);

    function administerImmunizationCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AIDetails" : 1002,
            AITiterDetailsId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AITiterDetails" : 2025,
            AINextStepsId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AINextSteps" : 2026,
            AIResultsId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AIResults" : 2027,
            AITiterHistoryId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AITiterHistory" : 2028,
            AIQuestionnaireId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AIQuestionnaire" : 2029
        };

        if ((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase() == "yes") {
            $scope.AllowPastAppointmentandEncounters = true;
        }
        else {
            $scope.AllowPastAppointmentandEncounters = false;
        }

        // TIME STEPS
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;
        $scope.PreviousDosage = 0;

        var strGlobalAdministerImmunizationID = globalobject.currentEncounter.ExposureEncounterSummaryID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //creating Object for Administer Immmunization
        $scope.administerImmunizationDetail = {
            AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID,
            AdministerImmunizationID: 0,
            SampleID: '',
            WorkRelated: null,
            IncidentID: null,
            ImmunizationForTravel: null,
            TravelDestination: '',
            ImmunizationTypeID: null,
            ImmunizationDeclined: false,
            DeclinedReasonID: '',
            ImmunizationTime: '',
            LotNumber: '',
            LotExpirationDate: '',
            LotDose: '',
            DoseUnitOfMeasurementID: null,
            InjectionSiteID: null,
            MedicationRouteID: null,
            AdverseReaction: null,
            AdverseReactionDescription: '',
            NextImmunizationDate: '',
            ImmunizationRegistryReviewed: null,
            DateStateRegistryUpdated: '',
            AddAdditionalImmunization: false,
            EncounterStatus: 1002,
            ReasonEncounterIncomplete: '',
            DiagnosticMethodID: '',
            ScheduleFollowUp: false,
            //StatusTypeID: 0,
            //LastUpdatedBy: 0,
            //LastUpdatedDate: '',
            DrawImmTimet: "",
            hourStep: "",
            minuteStep: "",
            ImmunizationType: "",
            //ImmunizationTypeID: 0
            CurrentDosage: null
        };

        $scope.AIDetail = {
            AdministerImmunizationDetailID: 0,
            AdministerImmunizationID: 0,
            ImmunizationForTravel: null,
            TravelDestination: '',
            ImmunizationTypeID: null,
            ImmunizationDeclined: false,
            DeclinedReasonID: '',
            ImmunizationTime: '',
            LotNumber: '',
            LotExpirationDate: '',
            LotDose: '',
            DoseUnitOfMeasurementID: null,
            InjectionSiteID: null,
            MedicationRouteID: null,
            AdverseReaction: null,
            AdverseReactionDescription: '',
            NextImmunizationDate: '',
            ImmunizationRegistryReviewed: null,
            DateStateRegistryUpdated: '',
            AddAdditionalImmunization: false,
            ImmunizationType: '',
            MedicationRouteTitle: '',
            InjectionSiteTitle: '',
            DoseUnitOfMeasurement: ''
        }

        $scope.AIDetailList = [];

        $scope.showAIDetail = false;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //********************************************Object for immunization type List************************************************************
        $scope.ImmunizationtypeList = {
            ID: ""
            , Text: ""

        };

        $scope.FieldDisabled = false;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //        $scope.myDate = new Date();

        //        $scope.hourStep = sharedservices.hourStep;
        //        $scope.minuteStep = sharedservices.minuteStep;
        //        $scope.DrawTimet = new Date();

        var d = new Date();
        $scope.minuteStep = d.getMinutes();
        $scope.hourStep = d.getHours();
        $scope.DrawImmTimet = d;

        var date = new Date();
        var timeNow = date.getHours() + ":" + date.getMinutes()
        $scope.Hour = timeNow.substring(0, 2);
        $scope.Minut = timeNow.substr(3, 2);

        $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        //        $scope.$watch('administerImmunizationDetail.AdverseReactionDescription', function (newVal, oldVal) {
        //            if (newVal != undefined)
        //                if (newVal.length > 2000) {
        //                    $scope.administerImmunizationDetail.AdverseReactionDescription = oldVal;
        //                }
        //        });

        //*************** Getting Lists for dropdown from globalobject *************************************************************************

        $scope.ImmunizationTypeList = globalobject.ImmunizationTypeList;
        $scope.InjectionSiteList = globalobject.InjectionSiteList;
        $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList; //referred for
        $scope.MedicationRouteList = globalobject.RouteAdministerImmunizationList; //route
        $scope.DeclinedReasonList = globalobject.DeclinedReasonList;
        $scope.LiquidUOMList = globalobject.LiquidUOMList;
        $scope.CommonUnitsOfMeasurementList = globalobject.CommonUnitsOfMeasurementList;
        $scope.createdBy = globalobject.currentSession.userid;

        var date = new Date();
        var timeNow = date.getHours() + ":" + date.getMinutes()

        $scope.Hour = timeNow.substring(0, 2);
        $scope.Minut = timeNow.substr(3, 2);
        date.setHours($scope.Hour);
        date.setMinutes($scope.Minut);

        $scope.time = date;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Function to Get the Encounter Details ******************
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
                        globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalAdministerImmunizationID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                        $scope.getImmunizationTypeList();

                    });

        };
        $scope.getEncounterDetails();

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Function to Get the Details Administer Immunization ******************
        $scope.getAdministerImmunizationdetail = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/AIService.asmx/GetAIDetails",
                data: { AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID, AdministerImmunizationID: strGlobalAdministerImmunizationID }
            };

            sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
        };

        function getDetailDataSuccess(data, status, headers, config) {

            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                $scope.administerImmunizationDetail.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
                $scope.administerImmunizationDetail.SampleID = data.d.Object.SampleID;
                strGlobalAdministerImmunizationID = data.d.Object.AdministerImmunizationID;

                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalAdministerImmunizationID;
                //                if (data.d.Object.LotDose != null && data.d.Object.LotDose != '' && data.d.Object.LotDose != undefined) {
                //                    $scope.PreviousDosage = data.d.Object.LotDose;
                //                }

                if (strGlobalAdministerImmunizationID != 0) {
                    $scope.administerImmunizationDetail = data.d.Object;
                    $scope.administerImmunizationDetail.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
                }

                $scope.AIDetailList = [];

                if (data.d.Object.AIDetailList != null && data.d.Object.AIDetailList != undefined && data.d.Object.AIDetailList.length > 0) {
                    $scope.AIDetailList = data.d.Object.AIDetailList;
                    $scope.showAIDetail = false;
                }
                else {
                    $scope.showAIDetail = true;
                }


                if (strGlobalAdministerImmunizationID != 0 && $scope.administerImmunizationDetail.ScheduleFollowUp) {
                    $scope.getScheduleFollowUpDetails();
                }

                $scope.getIncidentList();
                // $scope.GetCurrentDosageByLotNumber();
            }
        };

        function getDetailDataError(data, status, headers, config) {

        };

        $scope.resetSchedulefollwupdetails = function () {
            $scope.administerImmunizationDetail.ScheduleFollowUp = false;
        }

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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Function to Get the Details Immunization Type List ******************
        $scope.getImmunizationTypeList = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetImmunizationDetails",
                data: { InventoryTypeID: 1003 }
            };

            sharedservices.xhrService(configs)
                  .success(getDetailSuccess)
                  .error(getDetailError);
        };

        function getDetailSuccess(data, status, headers, config) {

            if (data.d.IsOK) {
                $scope.ImmunizationtypeList = data.d.Object;
                if (strGlobalAdministerImmunizationID != 0) {
                    $scope.getAdministerImmunizationdetail();
                }
                else {
                    $scope.getIncidentList();
                    $scope.showAIDetail = true;
                    //$scope.GetCurrentDosageByLotNumber();
                }
            }

        };

        function getDetailError(data, status, headers, config) {

        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //********************************************Object for LotNumber List************************************************************
        $scope.LotNumberList = {
            LotNumber: ""
            , ExpirationDate: ""
            , DosageUnitOfMeasurementID: ""

        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////Function to get LotNumberList*****************
        //$scope.ImmunizationtypeId='';
        $scope.onSelectImmune = function ($item, $model, $label) {
            //code to get lot #,UOM and expiration date based on $item.ID
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetLotNumberListForImmunization",
                data: { ImmunizationTypeID: $item.ID }
            };
            $scope.AIDetail.ImmunizationTypeID = $item.ID;
            sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              sharedservices.parseDates(data.d.Object);
                              $scope.lotNumberList = data.d.Object;
                              $scope.AIDetail.LotNumber = null;
                              $scope.AIDetail.LotExpirationDate = '';
                              $scope.AIDetail.DoseUnitOfMeasurementID = null;
                              console.log($scope.lotNumberList);
                          }

                      })
                      .error(function (data, status, headers, config) {

                      });
        }


        $scope.onSelectLotNumber = function ($item, $model, $label) {
            $scope.AIDetail.LotNumber = $item.LotNumber;
            $scope.AIDetail.LotExpirationDate = $item.ExpirationDate;
            $scope.AIDetail.DoseUnitOfMeasurementID = $item.DosageUnitOfMeasurementID;
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

        $scope.GetCurrentDosageByLotNumber = function () {
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetCurrentDosageByLotNumber",
                data: { TypeID: $scope.AIDetail.ImmunizationTypeID, LotNumber: $scope.AIDetail.LotNumber, Type: 'AI' }
            };
            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.AIDetail.CurrentDosage = data.d.Object.CurrentDosage;
                        if ($scope.AIDetail.CurrentDosage == null || $scope.AIDetail.CurrentDosage == '' || $scope.AIDetail.CurrentDosage == 0) {
                            $scope.AIDetail.CurrentDosage = 0;
                        }
                        else {
                            $scope.AIDetail.CurrentDosage = data.d.Object.CurrentDosage;
                        }
                    }
                })
                .error(function (data, status, headers, config) {

                });
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Function to Save the Details Administer Immunization ******************

        $scope.SelectedIndex = -1;

        $scope.saveAdministerImmunization = function (type) {

            $scope.saveStatus = true;
            $scope.msg = '';

            if (type == 'All') {
                //To Solve Server Date Time Issue.
                //            $scope.administerImmunizationDetail.DrawDate = new Date($scope.DrawDate).toDateString();AIDetail

                //            if ($scope.ExpectedDueDate != null) {
                //                $scope.administerImmunizationDetail.ExpectedDueDate = new Date($scope.ExpectedDueDate).toDateString();
                //            }

                $scope.administerImmunizationDetail.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;



                if ($scope.administerImmunizationDetail.WorkRelated != true && $scope.administerImmunizationDetail.WorkRelated != false) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgWorkRelatedmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.administerImmunizationDetail.WorkRelated == true && ($scope.administerImmunizationDetail.IncidentID == null || $scope.administerImmunizationDetail.IncidentID == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgIncidentIDmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
            }

            if ($scope.showAIDetail == true && $scope.saveStatus == true) {

                $scope.AIDetail.ImmunizationTime = $('#hdnIm').val();

                if ($scope.AIDetail.ImmunizationForTravel != true && $scope.AIDetail.ImmunizationForTravel != false) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgImmunizationForTravelmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
                else if ($scope.AIDetail.ImmunizationForTravel == true && ($scope.AIDetail.TravelDestination == null || $scope.AIDetail.TravelDestination == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgTravelDestinationmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationTypeID == null || $scope.AIDetail.ImmunizationTypeID == null || $scope.AIDetail.ImmunizationTypeID == 0) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgImmunizationTypeIDmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
                else if ($scope.AIDetail.ImmunizationDeclined != true && $scope.AIDetail.ImmunizationDeclined != false) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgImmunizationDeclinedmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == true && ($scope.AIDetail.DeclinedReasonID == null || $scope.AIDetail.DeclinedReasonID == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgDeclinedReasonIDmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationTime == null || $scope.AIDetail.ImmunizationTime == '') {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgImmunizationTimemustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == false && ($scope.AIDetail.LotNumber == null || $scope.AIDetail.LotNumber == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgLotNumbermustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == false && ($scope.AIDetail.LotExpirationDate == null || $scope.AIDetail.LotExpirationDate == '')) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == false && ($scope.AIDetail.LotDose == null || $scope.AIDetail.LotDose === '' || $scope.AIDetail.LotDose == undefined)) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgLotDosemustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == false && ($scope.AIDetail.InjectionSiteID == null || $scope.AIDetail.InjectionSiteID == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgInjectionSiteIDmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationDeclined == false && ($scope.AIDetail.MedicationRouteID == null || $scope.AIDetail.MedicationRouteID == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgMedicationRouteIDmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
                else if ($scope.AIDetail.AdverseReaction == true && ($scope.AIDetail.AdverseReactionDescription == null || $scope.AIDetail.AdverseReactionDescription == '')) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgAdverseReactionDescriptionmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationRegistryReviewed != 1 && $scope.AIDetail.ImmunizationRegistryReviewed != 0 && $scope.AIDetail.ImmunizationRegistryReviewed != 2) {
                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgImmunizationRegistryReviewedmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.AIDetail.ImmunizationRegistryReviewed == 1 && ($scope.AIDetail.DateStateRegistryUpdated == null || $scope.AIDetail.DateStateRegistryUpdated == undefined || $scope.AIDetail.DateStateRegistryUpdated == '')) {

                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgDateStateRegistryUpdatedmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
            }

            if (type == 'All' && $scope.saveStatus == true) {
                if ($scope.administerImmunizationDetail.EncounterStatus == null) {

                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgEncounterStatusmustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
                else if ($scope.administerImmunizationDetail.EncounterStatus == 1003 && ($scope.administerImmunizationDetail.ReasonEncounterIncomplete == null || $scope.administerImmunizationDetail.ReasonEncounterIncomplete == '')) {

                    $scope.saveStatus = false;
                    //                msg = $filter('translate')('msgReasonsEncounterIncompletemustbecompleted');
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
            }

            if ($scope.showAIDetail && $scope.saveStatus == true) {
                var c = 0;

                if ($scope.AIDetailList != null && $scope.AIDetailList != undefined && $scope.AIDetailList.length > 0) {
                    $.each($scope.AIDetailList, function (index, value) {
                        if (value.ImmunizationTypeID == $scope.AIDetail.ImmunizationTypeID && (value.LotNumber != null && value.LotNumber == $scope.AIDetail.LotNumber)) {
                            c = c + 1;
                        }
                    });
                    if ($scope.SelectedIndex < 0) {
                        if (c >= 1) {
                            $scope.saveStatus = false;
                            $scope.msg = 'Can not add duplicate vaccine with same lot number.';
                        }
                    }
                    else {
                        if (c > 1) {
                            $scope.saveStatus = false;
                            $scope.msg = 'Can not add duplicate vaccine with same lot number.';
                        }
                    }
                }

                if (!$scope.AllowPastAppointmentandEncounters && (moment($scope.AIDetail.NextImmunizationDate)).isBefore(moment()) && $scope.saveStatus == true && $scope.AIDetail.ImmunizationDeclined == false) {
                    if (moment($scope.AIDetail.NextImmunizationDate).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY")) {
                        $scope.saveStatus = false;
                        $scope.msg = $filter('translate')('msgNextImmunizationDateShouldNotBeLessThanCurrentDate');
                    }
                }

                if ((moment($scope.AIDetail.LotExpirationDate)).isBefore(moment()) && $scope.saveStatus == true && $scope.AIDetail.ImmunizationDeclined == false) {
                    if (moment($scope.AIDetail.LotExpirationDate).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY")) {
                        $scope.saveStatus = false;
                        $scope.msg = 'Vaccine already Expired';
                    }
                }
                if ((moment($scope.AIDetail.DateStateRegistryUpdated)).isAfter(moment()) && $scope.saveStatus == true && $scope.AIDetail.ImmunizationDeclined == false) {
                    if (moment($scope.AIDetail.DateStateRegistryUpdated).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY")) {
                        $scope.saveStatus = false;
                        $scope.msg = $filter('translate')('msgDateStateRegistryUpdatedShouldNotBeMoreThanCurrentDate');
                    }
                }

                if ((parseFloat($scope.AIDetail.LotDose) > (parseFloat($scope.PreviousDosage) + $scope.AIDetail.CurrentDosage)) && $scope.saveStatus == true && $scope.AIDetail.ImmunizationDeclined == false) {
                    $scope.saveStatus = false;
                    $scope.msg = 'Stock not enough. Try another Vaccine';
                }
            }

            if (type == 'All') {
                if ($scope.saveStatus == true) {

                    if ($scope.administerImmunizationDetail.ScheduleFollowUp) {

                        $scope.ValidateSF();
                    }


                    if ($scope.showAIDetail == false && ($scope.AIDetailList.length == null || $scope.AIDetailList.length == undefined || $scope.AIDetailList.length < 1)) {
                        $scope.saveStatus = false;
                        $scope.msg = 'Please fill at least one immunization detail.';
                    }
                }
                if ($scope.saveStatus) {
                    //$scope.PreviousDosage = $scope.AIDetail.LotDose;
                    if ($scope.showAIDetail) {

                        if ($scope.AIDetail.NextImmunizationDate != "" && $scope.AIDetail.NextImmunizationDate != null && $scope.AIDetail.NextImmunizationDate != undefined) {
                            $scope.AIDetail.NextImmunizationDate = new Date($scope.AIDetail.NextImmunizationDate).toDateString();
                        }
                        if ($scope.AIDetail.LotExpirationDate != "" && $scope.AIDetail.LotExpirationDate != null && $scope.AIDetail.LotExpirationDate != undefined) {
                            $scope.AIDetail.LotExpirationDate = new Date($scope.AIDetail.LotExpirationDate).toDateString();
                        }
                        if (!$scope.updateAI) {
                            $scope.AIDetailList.push($scope.AIDetail);
                        }
                        else {
                            $scope.AIDetailList[$scope.updateIndex] = $scope.AIDetail;
                        }
                        $scope.ClearAIDetailObject();
                        $scope.showAIDetail = false;
                    }

                    $scope.administerImmunizationDetail.AIDetailList = [];
                    $scope.administerImmunizationDetail.AIDetailList = $scope.administerImmunizationDetail.AIDetailList.concat($scope.AIDetailList);

                    $scope.showLoadingOverlay = true;
                    $scope.loadingAction = true;
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/AIService.asmx/SaveAIDetails",
                        data: { AIDetailsObj: $scope.administerImmunizationDetail }
                    };

                    sharedservices.xhrService(configs)
                      .success(saveDetailDataSuccess)
                      .error(saveDetailDataError);
                }
                else {
                    $scope.saveStatus = true;
                    if ($scope.msg != "") {
                        toastr.warning($scope.msg);
                    }
                }

            }
            else if (type == 'AIDetailOnly') {
                if ($scope.saveStatus) {
                    if (!$scope.updateAI) {
                        $scope.AIDetailList.push($scope.AIDetail);
                    }
                    else {
                        $scope.AIDetailList[$scope.updateIndex] = $scope.AIDetail;
                    }
                    $scope.ClearAIDetailObject();
                    $scope.showAIDetail = false;
                }
                else {
                    $scope.saveStatus = true;
                    if ($scope.msg != "") {
                        toastr.warning($scope.msg);
                    }
                }
            }

        };

        function saveDetailDataSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                strGlobalAdministerImmunizationID = data.d.Object.AdministerImmunizationID;
                $scope.administerImmunizationDetail.AdministerImmunizationID = strGlobalAdministerImmunizationID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalAdministerImmunizationID;

                //$scope.GetCurrentDosageByLotNumber();
                $scope.frmAdiministerImm.$dirty = false;

                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/AIService.asmx/getFailedImmunizationDetails",
                    data: { AdministerImmunizationID: data.d.Object.AdministerImmunizationID }
                };

                sharedservices.xhrService(configs)
                  .success(function (data, status, headers, config) {
                      if (data.d.IsOK) {
                          $scope.getFailedImmunizationDetails(data.d.Object);
                      }
                  })
                  .error(function () {
                      toastr.error($filter('translate')('msgSeriveerror'));
                  })

                if ($scope.administerImmunizationDetail.ScheduleFollowUp == false) {
                    $scope.emptySchedulefollowupObject();
                }

                $scope.AIDetailList = [];

                if (data.d.Object.AIDetailList != null && data.d.Object.AIDetailList != undefined && data.d.Object.AIDetailList.length > 0) {
                    $scope.AIDetailList = data.d.Object.AIDetailList;
                }

                if ($scope.administerImmunizationDetail.ScheduleFollowUp == true) {

                    $scope.saveScheduleFollowUpDetails();
                }
                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    if ($scope.administerImmunizationDetail.ScheduleFollowUp == false) {
                        utilityservices.notify("saved");
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


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //**************************** Get incident list record **********************************************//


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


        $scope.cancelAdministerImmunization = function () {

            if ($scope.frmAdiministerImm.$dirty) {

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

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


        function CheckForInUseIdsDetails() {
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';

            //            setTimeout(function () { $('#ddlDiagnostictMethodList').val($scope.administerImmunizationDetail.DiagnosticMethodID); }, 1000);
            setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 1000);
            setTimeout(function () { $('#ddlFollowType').val($scope.scheduleFollowUp.FollowUpTypeID); }, 1000);


        }

        $scope.ClearAIDetailObject = function () {
            $scope.AIDetail = null;

            $scope.AIDetail = {
                AdministerImmunizationDetailID: 0,
                AdministerImmunizationID: 0,
                ImmunizationForTravel: null,
                TravelDestination: '',
                ImmunizationTypeID: null,
                ImmunizationDeclined: false,
                DeclinedReasonID: '',
                ImmunizationTime: '',
                LotNumber: '',
                LotExpirationDate: '',
                LotDose: '',
                DoseUnitOfMeasurementID: null,
                InjectionSiteID: null,
                MedicationRouteID: null,
                AdverseReaction: null,
                AdverseReactionDescription: '',
                NextImmunizationDate: '',
                ImmunizationRegistryReviewed: null,
                DateStateRegistryUpdated: '',
                AddAdditionalImmunization: false,
                ImmunizationType: '',
                MedicationRouteTitle: '',
                InjectionSiteTitle: '',
                DoseUnitOfMeasurement: ''
            }
        };



        $scope.removeAIAction = function (element) {
            var index = $scope.AIDetailList.indexOf(element);
            $scope.prescibedList.splice(index, 1);
        }

        $scope.SelectAI = function (element, index) {
            $scope.updateAI = true;
            if (element.LotDose != null && element.LotDose != '' || element.LotDose != undefined) {
                $scope.PreviousDosage = element.LotDose;
            }

            if (element.ImmunizationTime != null && element.ImmunizationTime != undefined) {
                var d = new Date();
                $scope.minuteStep = element.ImmunizationTime.substr(3, 2);
                $scope.hourStep = element.ImmunizationTime.substr(0, 2);
                d.setHours(element.ImmunizationTime.substr(0, 2));
                d.setMinutes(element.ImmunizationTime.substr(3, 2));
                $scope.DrawImmTimet = d;
            }

            $scope.lotNumberList = [{ LotNumber: element.LotNumber,
                ExpirationDate: element.LotExpirationDate, DosageUnitOfMeasurementID: element.DoseUnitOfMeasurementID
            }];


            $scope.AIDetail = element;
            $scope.showAIDetail = true;
            $scope.updateIndex = index;
            $scope.SelectedIndex = index;
            $scope.GetCurrentDosageByLotNumber();
        }


        $scope.deleteElement = null;
        // OPEN MODALS
        $scope.removeAI = function (index) {
            $scope.deleteElement = $scope.AIDetailList[index];
            globalobject.currentEncounter.screenType = "AI";
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                controller: 'DeleteAICtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.discardAIDetail = function (type) {
            $scope.AMType = type;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'DiscardAIDetailsCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.AddAIDetail = function () {
            var noModal = false;
            if ($scope.showAIDetail) {
                noModal = true;
            }

            if (noModal) {
                return false;
            }
            else {
                $scope.SelectedIndex = -1;
                $scope.updateAI = false;
                $scope.ClearAIDetailObject();
                var d = new Date();
                $scope.minuteStep = d.getMinutes();
                $scope.hourStep = d.getHours();
                $scope.DrawImmTimet = d;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'AddAICtrl',
                    size: 'sm',
                    scope: $scope
                });
            }
        };



        $scope.getFailedImmunizationDetails = function (obj) {
            globalobject.currentEncounter.screenType = "AI";
            globalobject.currentObject = obj;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/unsavedVaccine-modal.html',
                controller: 'UnSavedAICtrl',
                size: 'lg',
                scope: $scope
            });
        };

        $scope.fun = function (type) {
            if (type == 1) {
                $scope.AIDetail.MedicationRouteTitle = $('#ddlMedicationRoute').find("option:selected").text().trim();
            }
            else if (type == 2) {
                $scope.AIDetail.InjectionSiteTitle = $('#ddlInjectionSite').find("option:selected").text().trim();
            }
        }

    };

})();

