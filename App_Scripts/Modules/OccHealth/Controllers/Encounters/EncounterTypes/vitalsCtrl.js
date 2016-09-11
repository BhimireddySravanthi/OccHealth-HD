angular.module("app")

    .controller("vitalsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "$window", "utilityservices",

         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.changeSubView = sharedservices.changeSubView
             $scope.globalobject = globalobject;
             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/VitalDetails" : 1009,
                 resultsFormId: undefined,
                 investigationFormId: undefined
             };
             $scope.showSubNavbars = true;
             $scope.IsDisable = false;

             $scope.myDate = new Date();
             $scope.loadingAction = false;
             $scope.hourStep = sharedservices.hourStep;
             $scope.BGhourStep = sharedservices.hourStep;
             $scope.BPhourStep = sharedservices.hourStep;
             $scope.SPhourStep = sharedservices.hourStep;
             $scope.HRhourStep = sharedservices.hourStep;
             $scope.LChourStep = sharedservices.hourStep;

             $scope.minuteStep = sharedservices.minuteStep;
             $scope.BGminuteStep = sharedservices.minuteStep;
             $scope.BPminuteStep = sharedservices.minuteStep;
             $scope.SPminuteStep = sharedservices.minuteStep;
             $scope.HRminuteStep = sharedservices.minuteStep;
             $scope.LCminuteStep = sharedservices.minuteStep;

             $scope.DrawTimet = new Date();
             $scope.BGDrawTimet = new Date();
             $scope.BPDrawTimet = new Date();
             $scope.SPDrawTimet = new Date();
             $scope.HRDrawTimet = new Date();
             $scope.LCDrawTimet = new Date();

             $scope.vitals = {
                 VitalTestID: globalobject.currentEncounter.ExposureEncounterSummaryID
            , AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID
            , WorkRelated: null
            , IncidentID: ""
            , EncounterStatus: ""
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: ""
            , ScheduleFollowUp: ""
            , CreatedBy: globalobject.currentSession.userid
            , SampleID: ""
            , LaboratorylID: ""
            , EncounterDetailID: ""
            , EmployeeName: ""
            , EncounterTypeID: ""
             };

             $scope.BloodGlucose = {
                 BloodGlucoseTestID: 0
            , SampleID: ""
            , EncounterTypeID: 0
            , EncounterTypeReference: 0
            , BGhourStep: ""
            , BGminuteStep: ""
            , BGDrawTimet: ""
            , BloodGlucoseTestDate: ""
            , BloodGlucoseTestTime: ""
            , MeasurementTypeID: ""
            , NormalcyLevel: ""
            , BloodGlucoseValue: ""
            , BloodGlucoseUnitOfMeasurementID: ""
            , Fasting: ""
            , BloodGlucoseTestNote: ""
            , BloodGlucoseTestPerformed: ""
             };

             $scope.BloodPressure = {
                 BloodPresureTestID: 0
            , SampleID: ""
            , EncounterTypeID: 0
            , EncounterTypeReference: 0
            , BloodPresureTestDate: ""
            , BloodPresureTestTime: ""
            , BPhourStep: ""
            , BPminuteStep: ""
            , BPDrawTimet: ""
            , TestPositionFrameID: ""
            , BodyPartSideID: ""
            , MaximumPresure: ""
            , MinimumPresure: ""
            , PresureUnitOfMeasurementID: ""
            , MinPresureUnitOfMeasurementID: ""
             , PulseReadingUnitOfMeasurementID: ""
            , PulseReading: ""
            , PulseReadingUnitOfMeasurementID: ""
            , MonitoringTypeID: ""
            , IrregularHeartBeat: ""
            , BloodPresureTestNote: ""
            , BloodPressureTestPerformed: ""
             };

             $scope.SpO2 = {
                 OxygenSaturationTestID: 0
            , SampleID: ""
            , EncounterTypeID: 0
            , EncounterTypeReference: 0
            , OxygenSaturationTestDate: ""
            , OxygenSaturationTestTime: ""
            , SPhourStep: ""
            , SPminuteStep: ""
            , SPDrawTimet: ""
            , PercentageBloodOxygen: ""
            , Respiration: ""
            , CharactersticsDetailID: ""
            , OxygenSaturationTestNote: ""
            , PerformSpO2: ""
             };

             $scope.HeartRate = {
                 HeartRateTestID: 0
            , SampleID: ""
            , EncounterTypeID: 0
            , EncounterTypeReference: 0
            , HRhourStep: ""
            , HRminuteStep: ""
            , HRDrawTimet: ""
            , HeartRateTestDate: ""
            , HeartRateTestTime: ""
            , BeatsPerMinutes: ""
            , CharactersticsDetailID: null
            , HeartRateTestNote: ""
            , PerformHeartRate: ""
             };

             $scope.Consciousness = {
                 LevelOfConsciousnessTestID: 0
            , SampleID: ""
            , EncounterTypeID: 0
            , EncounterTypeReference: 0
            , LevelOfConsciousnessTestDate: ""
            , LChourStep: ""
            , LCminuteStep: ""
            , LCDrawTimet: ""
            , LevelOfConsciousnessTestTime: ""
            , AAOx3: ""
            , RightEye: ""
            , BothEyes: ""
            , LevelOfConsciousnessTestNote: ""
            , PerformLevelofConsciousness: ""
             };

             $scope.LiquidUOMList = globalobject.LiquidUOMList;
             $scope.DensityUOMList = globalobject.DensityUOMList;
             $scope.PressureUOMList = globalobject.PressureUOMList;

             $scope.PositionFrameList = globalobject.TestPositionFrameList;

             $scope.MonitoringList = globalobject.MonitoringTypeBiometricsList;

             $scope.CharacteristicsList = globalobject.CharacteristicsList;

             $scope.DiagnosticTypeList = globalobject.DiagnosticMethodList;
             $scope.UserList = globalobject.UserList;

             $scope.GoToPreviousPage = function () {
                 $window.history.back();
             }

             $scope.FieldDisabled = false;

             $scope.getVitalsDetails = function () {
                 globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);
                 var configs = {
                     url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                     data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
                 };

                 sharedservices.xhrService(configs)
                    .then(function (response) {
                        if (response.data.d.IsOK) {
                            globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                            globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                            globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            $scope.vitals.VitalTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                            $scope.vitals.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                            $scope.getexposureVitals();
                            $scope.getIncidentList();
                        }
                        else {
                            $scope.vitals.VitalTestID = 0;
                            $scope.vitals.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                            $scope.getexposureVitals();
                            $scope.getIncidentList();
                        }
                    });

             };

             $scope.getIncidentList = function () {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                     data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
                 };
                 sharedservices.xhrService(configs)
                      .success(function (data, status, headers, config) {
                          if (data.d.IsOK) {
                              $scope.IncidentIdList = data.d.Object;
                          }
                      })
                      .error(function (data, status, headers, config) {

                      });
             }

             $scope.keyPress = function (e, obj) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     utilityservices.notify("numbers");
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
                 else {
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
                     if ($('#' + obj).val().length >= 3) {
                         $scope.msg = $filter('translate')('msgValueShouldBeLessThan1000');
                         toastr.warning($scope.msg);
                         e.keyCode = 0;
                         if (e.preventDefault) e.preventDefault();
                         return false;
                     }
                 }
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

             $scope.cancelVitals = function () {

                 if ($scope.frmVitals.$dirty) {

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

             $scope.resetSchedulefollwupdetails = function () {
                 $scope.vitals.ScheduleFollowUp = false;
             }

             $scope.getexposureVitals = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/VitalsService.asmx/GetVitalsDetails",
                     data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, ExposureEncounterSummaryID: $scope.vitals.VitalTestID, EncounterTypeID: globalobject.currentEncounter.SelectedEncounterTypeID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };

             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.vitals = data.d.Object.VitalObj;
                     $scope.BloodGlucose = data.d.Object.BloodGlucose;
                     $scope.BloodPressure = data.d.Object.BloodPressure;
                     $scope.SpO2 = data.d.Object.SPO2;
                     $scope.HeartRate = data.d.Object.HeartRate;
                     $scope.Consciousness = data.d.Object.Consciousness;
                     $scope.vitals.VitalTestID = data.d.Object.VitalObj.VitalTestID;
                     if ($scope.vitals.VitalTestID == 0) {
                         $scope.vitals.EncounterStatus = '1002';
                         $scope.vitals.ScheduleFollowUp = false;
                         $scope.BloodPressure.BodyPartSideID = '1001';
                         $scope.BloodPressure.IrregularHeartBeat = '0';
                         $scope.SpO2.PercentageBloodOxygen = '';
                         $scope.HeartRate.BeatsPerMinutes = '';
                         $scope.Consciousness.AAOx3 = '';
                         $scope.vitals.WorkRelated = null;
                     }
                     if ($scope.SpO2.PercentageBloodOxygen == 0) {
                         $scope.SpO2.PercentageBloodOxygen = '';
                     }
                     if ($scope.HeartRate.BeatsPerMinutes == 0) {
                         $scope.HeartRate.BeatsPerMinutes = '';
                     }

                     $scope.vitals.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                     $scope.vitals.EncounterTypeID = globalobject.currentEncounter.SelectedEncounterTypeID;

                     if ($scope.vitals.ScheduleFollowUp == true) {
                         $scope.getScheduleFollowUpDetails();
                     }

                     if ($scope.BloodGlucose.BloodGlucoseTestTime != null && $scope.BloodGlucose.BloodGlucoseTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BloodGlucose.BloodGlucoseTestTime.substr(0, 2));
                         d.setMinutes($scope.BloodGlucose.BloodGlucoseTestTime.substr(3, 2));
                         $scope.BGDrawTimet = d;
                     }

                     if ($scope.BloodPressure.BloodPresureTestTime != null && $scope.BloodPressure.BloodPresureTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.BloodPressure.BloodPresureTestTime.substr(0, 2));
                         d.setMinutes($scope.BloodPressure.BloodPresureTestTime.substr(3, 2));
                         $scope.BPDrawTimet = d;
                     }

                     if ($scope.SpO2.OxygenSaturationTestTime != null && $scope.SpO2.OxygenSaturationTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.SpO2.OxygenSaturationTestTime.substr(0, 2));
                         d.setMinutes($scope.SpO2.OxygenSaturationTestTime.substr(3, 2));
                         $scope.SPDrawTimet = d;
                     }

                     if ($scope.HeartRate.HeartRateTestTime != null && $scope.HeartRate.HeartRateTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.HeartRate.HeartRateTestTime.substr(0, 2));
                         d.setMinutes($scope.HeartRate.HeartRateTestTime.substr(3, 2));
                         $scope.HRDrawTimet = d;
                     }

                     if ($scope.Consciousness.LevelOfConsciousnessTestTime != null && $scope.Consciousness.LevelOfConsciousnessTestTime != undefined) {
                         var d = new Date();
                         d.setHours($scope.Consciousness.LevelOfConsciousnessTestTime.substr(0, 2));
                         d.setMinutes($scope.Consciousness.LevelOfConsciousnessTestTime.substr(3, 2));
                         $scope.LCDrawTimet = d;
                     }
                 }
             };

             function getDetailDataError(data, status, headers, config) {
             };

             $scope.saveVitalsDetails = function () {
                 $scope.vitals.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                 $scope.vitals.EncounterTypeID = globalobject.currentEncounter.SelectedEncounterTypeID;
                 $scope.saveStatus = true;
                 $scope.msg = '';

                 if ($scope.vitals.WorkRelated == null) {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.BloodGlucose.BloodGlucoseTestPerformed == 1) {
                     $scope.BloodGlucose.BloodGlucoseTestTime = $('#hdnBGTime').val();
                     if ($scope.BloodGlucose.BloodGlucoseTestTime == null || $scope.BloodGlucose.BloodGlucoseTestTime == ''
                       || $scope.BloodGlucose.MeasurementTypeID == null || $scope.BloodGlucose.MeasurementTypeID == ''
                       || $scope.BloodGlucose.BloodGlucoseValue == null || $scope.BloodGlucose.BloodGlucoseValue == ''
                       || $scope.BloodGlucose.BloodGlucoseUnitOfMeasurementID == null || $scope.BloodGlucose.BloodGlucoseUnitOfMeasurementID == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                     else {
                         if ($scope.BloodGlucose.Fasting == undefined || $scope.BloodGlucose.Fasting == '') {
                             $scope.BloodGlucose.Fasting = null;
                         }
                         if ($scope.BloodGlucose.NormalcyLevel == undefined || $scope.BloodGlucose.NormalcyLevel == '') {
                             $scope.BloodGlucose.NormalcyLevel = 0;
                         }
                     }
                 }
                 else {
                     $scope.BloodGlucose.BloodGlucoseTestPerformed = false;
                     $scope.BloodGlucose.BloodGlucoseTestTime = '';
                     $scope.BloodGlucose.BloodGlucoseTestNote = '';
                     $scope.BloodGlucose.MeasurementTypeID = 0;
                     $scope.BloodGlucose.NormalcyLevel = 0;
                     $scope.BloodGlucose.BloodGlucoseValue = 0;
                     $scope.BloodGlucose.BloodGlucoseUnitOfMeasurementID = 0;
                     $scope.BloodGlucose.BloodGlucoseTestDate = '';

                 }

                 if ($scope.BloodPressure.BloodPressureTestPerformed == 1) {
                     $scope.BloodPressure.BloodPresureTestTime = $('#hdnBPTime').val();
                     if ($scope.BloodPressure.BloodPresureTestTime == null || $scope.BloodPressure.BloodPresureTestTime == ''
                       || $scope.BloodPressure.TestPositionFrameID == null || $scope.BloodPressure.TestPositionFrameID == ''
                       || $scope.BloodPressure.BodyPartSideID == null || $scope.BloodPressure.BodyPartSideID == ''
                       || $scope.BloodPressure.MaximumPresure == null || $scope.BloodPressure.MaximumPresure == ''
                       || $scope.BloodPressure.PresureUnitOfMeasurementID == null || $scope.BloodPressure.PresureUnitOfMeasurementID == ''
                        || $scope.BloodPressure.MinPresureUnitOfMeasurementID == null || $scope.BloodPressure.MinPresureUnitOfMeasurementID == ''
                          || $scope.BloodPressure.PulseReadingUnitOfMeasurementID == null || $scope.BloodPressure.PulseReadingUnitOfMeasurementID == ''
                       || $scope.BloodPressure.MinimumPresure == null || $scope.BloodPressure.MinimumPresure == ''
                     //|| $scope.BloodPressure.MinPresureUnitOfMeasurementID == null || $scope.BloodPressure.PresureUnitOfMeasurementID == ''
                       || $scope.BloodPressure.PulseReading == null || $scope.BloodPressure.PulseReading == ''
                     //|| $scope.BloodPressure.PulseReadingUnitOfMeasurementID == null || $scope.BloodPressure.PulseReadingUnitOfMeasurementID == ''
                       || $scope.BloodPressure.MonitoringTypeID == null || $scope.BloodPressure.MonitoringTypeID == ''
                       || $scope.BloodPressure.IrregularHeartBeat == null
                      ) {
                         $scope.saveStatus = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.BloodPressure.BloodPressureTestPerformed = false;
                     $scope.BloodPressure.BloodPresureTestTime = '';
                     $scope.BloodPressure.BloodPresureTestNote = '';
                     $scope.BloodPressure.TestPositionFrameID = 0;
                     $scope.BloodPressure.MaximumPresure = 0;
                     $scope.BloodPressure.MinimumPresure = 0;
                     $scope.BloodPressure.PresureUnitOfMeasurementID = 0;
                     $scope.BloodPressure.MinPresureUnitOfMeasurementID = 0;
                     $scope.BloodPressure.PulseReadingUnitOfMeasurementID = 0;
                     $scope.BloodPressure.PulseReading = 0;
                     //$scope.BloodPressure.PulseReadingUnitOfMeasurementID = 0;
                     $scope.BloodPressure.MonitoringTypeID = 0;
                     $scope.BloodPressure.BodyPartSideID = 0;
                     $scope.BloodPressure.BloodPresureTestDate = '';
                 }

                 if ($scope.SpO2.PerformSpO2 == 1) {
                     $scope.SpO2.OxygenSaturationTestTime = $('#hdnSPTime').val();
                     if ($scope.SpO2.OxygenSaturationTestTime == null || $scope.SpO2.OxygenSaturationTestTime == ''
                       || $scope.SpO2.PercentageBloodOxygen == null || $scope.SpO2.PercentageBloodOxygen == ''
                       || $scope.SpO2.CharactersticsDetailID == null || $scope.SpO2.CharactersticsDetailID == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.SpO2.PerformSpO2 = false;
                     $scope.SpO2.OxygenSaturationTestTime = '';
                     $scope.SpO2.Respiration = '';
                     $scope.SpO2.OxygenSaturationTestNote = '';
                     $scope.SpO2.OxygenSaturationTestDate = '';
                     $scope.SpO2.PercentageBloodOxygen = 0;
                 }

                 if ($scope.HeartRate.PerformHeartRate == 1) {
                     $scope.HeartRate.HeartRateTestTime = $('#hdnHRTime').val();
                     if ($scope.HeartRate.HeartRateTestTime == null || $scope.HeartRate.HeartRateTestTime == ''
                       || $scope.HeartRate.BeatsPerMinutes == null || $scope.HeartRate.BeatsPerMinutes == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                     else {
                         if ($scope.HeartRate.CharactersticsDetailID == null || $scope.HeartRate.CharactersticsDetailID == '') {
                             $scope.HeartRate.CharactersticsDetailID = 1005;
                         }
                     }
                 }
                 else {
                     $scope.HeartRate.PerformHeartRate = false;
                     $scope.HeartRate.HeartRateTestTime = '';
                     $scope.HeartRate.HeartRateTestNote = '';
                     $scope.HeartRate.HeartRateTestDate = '';
                     $scope.HeartRate.BeatsPerMinutes = 0;
                 }

                 if ($scope.Consciousness.PerformLevelofConsciousness == 1) {
                     $scope.Consciousness.LevelOfConsciousnessTestTime = $('#hdnLCTime').val();
                     if ($scope.Consciousness.LevelOfConsciousnessTestTime == null || $scope.Consciousness.LevelOfConsciousnessTestTime == ''
                       || $scope.Consciousness.AAOx3 == null || $scope.Consciousness.AAOx3 == ''
                      ) {
                         $scope.saveStatus = false;
                         $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.Consciousness.PerformLevelofConsciousness = false;
                     $scope.Consciousness.LevelOfConsciousnessTestTime = '';
                     $scope.Consciousness.LevelOfConsciousnessTestNote = '';
                     $scope.Consciousness.LevelOfConsciousnessTestDate = '';
                     $scope.Consciousness.AAOx3 = '';
                 }

                 if ($scope.vitals.EncounterStatus == 1003 && ($scope.vitals.ReasonEncounterIncomplete == null || $scope.vitals.ReasonEncounterIncomplete == '')) {
                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.vitals.ScheduleFollowUp == true) {
                     $scope.ValidateSF();
                 }

                 if ($scope.saveStatus) {
                     $scope.showLoadingOverlay = true;
                     $scope.loadingAction = true;
                     if ($scope.vitals.WorkRelated == 0) {
                         $scope.vitals.IncidentID = 0;
                         $scope.vitals.WorkRelated = false;
                     }
                     else {
                         $scope.vitals.WorkRelated = true;
                     }

                     if ($scope.BloodGlucose.Fasting == 0) {
                         $scope.BloodGlucose.Fasting = false;
                     }
                     else {
                         $scope.BloodGlucose.Fasting = true;
                     }

                     if ($scope.BloodPressure.IrregularHeartBeat == 0) {
                         $scope.BloodPressure.IrregularHeartBeat = false;
                     }
                     else {
                         $scope.BloodPressure.IrregularHeartBeat = true;
                     }

                     if ($scope.vitals.EncounterStatus == "1002") {
                         $scope.vitals.ReasonEncounterIncomplete = "";
                     }

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/VitalsService.asmx/SaveVitalsDetails",
                         data: { VitalObj: $scope.vitals, BloodGlucose: $scope.BloodGlucose, BloodPressure: $scope.BloodPressure, SPO2: $scope.SpO2, HeartRate: $scope.HeartRate, Consciousness: $scope.Consciousness }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                 }
                 else {
                     $scope.saveStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if ($scope.msg != "") {
                         toastr.warning($scope.msg);
                     }
                 }
             };


             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.vitals = data.d.Object.VitalObj;

                     setTimeout(function () { $scope.frmVitals.$dirty = false; }, 1000);

                     $scope.BloodGlucose = data.d.Object.BloodGlucose;
                     $scope.BloodPressure = data.d.Object.BloodPressure;
                     $scope.SpO2 = data.d.Object.SPO2;
                     $scope.HeartRate = data.d.Object.HeartRate;
                     $scope.Consciousness = data.d.Object.Consciousness;
                     $scope.vitals.VitalTestID = data.d.Object.VitalObj.VitalTestID;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.VitalObj.VitalTestID;
                     if ($scope.SpO2.PercentageBloodOxygen == 0) {
                         $scope.SpO2.PercentageBloodOxygen = '';
                     }
                     if ($scope.HeartRate.BeatsPerMinutes == 0) {
                         $scope.HeartRate.BeatsPerMinutes = '';
                     }
                     if ($scope.Consciousness.AAOx3 == null) {
                         $scope.Consciousness.AAOx3 = '';
                     }

                     if ($scope.vitals.ScheduleFollowUp == false) {
                         $scope.emptySchedulefollowupObject();
                     }


                     if ($scope.vitals.ScheduleFollowUp == true) {
                         $scope.saveScheduleFollowUpDetails();
                     }

                     if ($scope.vitals.ScheduleFollowUp == false) {
                         utilityservices.notify("saved");
                     }
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;

                 }
             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };

             setTimeout(function () { $scope.frmVitals.$dirty = false; }, 1000);

         } ]);



