angular.module("app")

    .controller("ULLCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "$window", "utilityservices",

         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.changeSubView = sharedservices.changeSubView;
             $scope.Check = false;

             $scope.globalobject = globalobject;

             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/ULLDetails" : 1001,
                 resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/ULLResults" : 2006,
                 investigationFormId: 2007
             };

             $scope.showSubNavbars = true;

             $scope.IsDisable = false;

             $scope.EncounterDateFromSOA = null;

             var strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
             var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
             var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;


             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.exposureUrine = {
                 ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , SampleID: ""
            , WorkShiftID: ""
            , Smoker: ""
            , Gender: ""
            , Pregnant: null
            , NoOfWeeks: ""
            , ExpectedDueDate: ""
            , DrawDate: ""
            , DrawTime: ""
            , RefuseSampling: ""
            , NumberOfSample: ""
            , PriorityID: ""
            , SampleStatusID: ""
            , LaboratorylID: ""
            , RemarkCodeID: ""
            , Comments: ""
            , ApprovalForLabProcessing: ""
            , SentToLab: ""
            , ReasonforRefusal: ""
            , DateSenttoLab: ""
            , CreatedBy: globalobject.currentSession.userid
             };
             $scope.AppointmentTime = "";
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

             //CustomSetting for hide Pregnant Fields Start
             $scope.hideePregnantFields = true;
             $scope.HidePregnantFieldsByLocation = function () {

                 var msg = $filter('translate')('msgSuccessfullyMarkedasaNoShow');
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/HidePregnantFieldsByLocation"
                 };
                 sharedservices.xhrService(configs)
                        .success(function (data, status, headers, config) {
                            $scope.hideePregnantFields = data.d.Object;
                        })
                        .error(function () {
                            utilityservices.notify("error", $filter('translate')('msgSeriveerror'));
                        })
             }
             $scope.HidePregnantFieldsByLocation();
             ///CustomSetting for hide Pregnant Fields End
             $scope.loadingAction = false;
             $scope.myDate = new Date();

             $scope.hourStep = sharedservices.hourStep;
             $scope.minuteStep = sharedservices.minuteStep;



             $scope.InUsedIDs = '';
             $scope.RemarksCodeList = [];
             $scope.RemarkCodePicklist = {};
             $scope.RemarkCodePicklist.Remarkcode = [];
             if (strGlobalExposureEncounterSummaryID == 0 || strGlobalExposureEncounterSummaryID == null || strGlobalExposureEncounterSummaryID == '' || strGlobalExposureEncounterSummaryID == undefined) {
                 GetRemarkCodeLookUp();
             }

             $scope.LabList = globalobject.LabList;
             $scope.WorkShiftList = globalobject.WorkShiftList;
             $scope.SampleStatusList = globalobject.SampleStatusList;

             $scope.AnalysisMethodList = globalobject.AnalysisMethodList;
             $scope.UomtypeList = globalobject.UomtypeList;
             $scope.ResultPermissibleRangeList = globalobject.ResultPermissibleRangeList;

             var date = new Date();
             var timeNow = date.getHours() + ":" + date.getMinutes()

             $scope.Hour = timeNow.split(':')[0];
             $scope.Minut = timeNow.split(':')[1];
             date.setHours($scope.Hour);
             date.setMinutes($scope.Minut);

             $scope.time = date;

             $scope.BindDefaultDateTime = (function () {
                 var date = new Date();
                 var timeNow = date.getHours() + ":" + date.getMinutes()
                 $scope.Hour = timeNow.split(':')[0];
                 $scope.Minut = timeNow.split(':')[1];

                 $scope.exposureUrine.DrawDate = date;
                 $scope.DrawDate = date;
                 $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
                 $scope.hourStep = sharedservices.hourStep;
                 $scope.minuteStep = sharedservices.minuteStep;
             })();

             ///////////////////////////////////////////////////////////////////////////////////////////////
             $scope.GoToPreviousPage = function () {
                 $window.history.back();
             }

             function CheckForInUseIdsDetails() {
                 var i, innerHTML, c = 0;
                 var ddlReplace = '<option value="? string: ?"></option>';
                 var ddlReplace1 = '<option value="? number:1000 ?"></option>';
                 if ($scope.exposureUrine.LaboratorylID != null) {
                     for (i = $scope.LabList.length - 1; i > -1; i--) {
                         if ($scope.LabList[i].ID === $scope.exposureUrine.LaboratorylID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlLab').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         searchString = '<option value="' + $scope.exposureUrine.LaboratorylID + '" selected="selected">';
                         if (($scope.exposureUrine.LaboratorylID != null || $scope.exposureUrine.LaboratorylID != undefined) && (innerHTML.indexOf(searchString) <= -1)) {
                             innerHTML = innerHTML + '<option value="' + $scope.exposureUrine.LaboratorylID + '" selected="selected" >' + $scope.exposureUrine.LaboratoryName + '</option>';
                             $('#ddlLab').html(innerHTML);
                         }
                         else
                             $('#ddlLab').html(innerHTML);
                     }
                 }

                 //                 c = 0;
                 //                 if ($scope.exposureUrine.RemarkCodeID != null) {
                 //                     for (i = $scope.RemarksCodeList.length - 1; i > -1; i--) {
                 //                         if ($scope.RemarksCodeList[i].ID === $scope.exposureUrine.RemarkCodeID) {
                 //                             c++;
                 //                         }
                 //                     }
                 //                     if (c == 0) {
                 //                         innerHTML = $('#ddlRemarkCode').html();
                 //                         innerHTML = innerHTML.replace(ddlReplace, "");
                 //                         innerHTML = innerHTML.replace(ddlReplace1, "");
                 //                         searchString = '<option value="' + $scope.exposureUrine.RemarkCodeID + '" selected="selected">';
                 //                         if (($scope.exposureUrine.RemarkCodeID != null || $scope.exposureUrine.RemarkCodeID != undefined) && (innerHTML.indexOf(searchString) <= -1)) {
                 //                             innerHTML = innerHTML + '<option value="' + $scope.exposureUrine.RemarkCodeID + '" selected="selected" >' + $scope.exposureUrine.RemarkCodeName + '</option>';
                 //                             $('#ddlRemarkCode').html(innerHTML);
                 //                         }
                 //                         else
                 //                             $('#ddlRemarkCode').html(innerHTML);
                 //                     }
                 //                 }

                 setTimeout(function () { $('#ddlLab').val($scope.exposureUrine.LaboratorylID); }, 1000);
                 // setTimeout(function () { $('#ddlRemarkCode').val($scope.exposureUrine.RemarkCodeID); }, 1000);
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////
             // Function to Get the Details ******************
             $scope.getEncounterDetails = function () {
                 $scope.showLoadingOverlay = true;
                 globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);

                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

                 globalobject.currentEncounter.EmployeePK = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ?
                                            parseInt(sharedservices.getURLParameter().EmployeePK) : parseInt(globalobject.currentEncounter.EmployeePK);

                 var configs = {
                     url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectEncounterTypeByEncounterID",
                     data: { EncounterDetailID: parseInt(globalobject.currentEncounter.EncounterDetailID), AppointmentEncounterTypeID: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID) }
                 };
                 sharedservices.xhrService(configs)
                    .then(function (response) {
                        if (response.data.d.IsOK) {
                            globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                            globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                            globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                            globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                            strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                            sharedservices.parseDates(response.data.d.Object[0]);
                            $scope.AppointmentTime = response.data.d.Object[0].TimeInOut;
                            if (globalobject.currentEncounter.FromSOAListScreen) {
                                $scope.EncounterDateFromSOA = response.data.d.Object[0].EncounterDate;
                            }
                            $scope.getexposureUrine();

                        }
                        else {
                            $scope.showLoadingOverlay = false;
                        }
                    });

             };
             // $scope.getEncounterDetails();

             ////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.GetRange = function () {
                 if (!utilityservices.ValidateField($scope.results.ULLUOMTypeID) && !utilityservices.ValidateField($scope.results.UllLevel)) {

                     var UllLevel = parseFloat($scope.getTwoDecimalPlace($scope.results.UllLevel));

                     if ($scope.results.ULLUOMTypeID == 1001)
                         UllLevel = $scope.getTwoDecimalPlace(UllLevel / 10);

                     var configs = {};
                     configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetRange",
                         data: { UllLevel: UllLevel }
                     };

                     sharedservices.xhrService(configs)
                  .success(getRangeDataSuccess)
                  .error(getRangeDataError);
                 }
                 else {
                     $scope.results.ResultPermissibleRangeID = null;
                 }
             };
             function getRangeDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.results.ResultPermissibleRangeID = data.d.Object.ResultPermissibleRangeID;
                 }
                 setTimeout(function () { $('#ddlResultPermissibleRange').val($scope.results.ResultPermissibleRangeID); }, 1000);

             };

             function getRangeDataError(data, status, headers, config) {

             };


             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.SetRangeType = function () {
                 if (!utilityservices.ValidateField($scope.results.ULLUOMTypeID) && !utilityservices.ValidateField($scope.results.UllLevel)) {

                     $scope.results.ResultPermissibleRangeUOM = 1000;
                     $scope.GetRange();

                     if ($scope.results.PreviousValue != null) {

                         $scope.results.DifferenceUOM = 1000;
                         $scope.getUOMDifference();
                     }
                     else
                         $scope.results.DifferenceUOM = null;

                 }
                 else {
                     $scope.results.ResultPermissibleRangeID = null;
                 }
             };

             ////////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.cancelULL = function (fromPage) {

                 if (fromPage == 'Details')
                     $scope.Dirty = $scope.frmUllDetails.$dirty;

                 if (fromPage == 'Results')
                     $scope.Dirty = $scope.frmUllResults.$dirty;

                 if ($scope.Dirty && !($scope.ResultSaved)) {

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

             $scope.getexposureUrine = function () {
                 $scope.showLoadingOverlay = true;
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetULLDetails",
                     data: { EncounterDetailID: strGlobalEncounterDetailID, ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };

             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     //toastr.success('call Success');
                     sharedservices.parseDates(data.d.Object);
                     $scope.exposureUrine = data.d.Object;
                     $scope.exposureUrine.Gender = globalobject.employee.GenderId;
                     $scope.ResultSaved = data.d.Object.ResultSaved;

                     if (data.d.Object.RemarkCodeID != null) {
                         $scope.InUsedIDs = data.d.Object.RemarkCodeID;
                     }

                     if ($scope.exposureUrine.ExposureEncounterSummaryID != 0 && $scope.exposureUrine.DrawTime != null) {
                         var d = new Date();
                         d.setHours($scope.exposureUrine.DrawTime.split(':')[0]);
                         d.setMinutes($scope.exposureUrine.DrawTime.split(':')[1]);
                         $scope.DrawTimet = d;
                     }

                     if ($scope.exposureUrine.ExposureEncounterSummaryID != 0) {
                         $scope.DrawDate = $scope.exposureUrine.DrawDate;
                     }

                     if ($scope.exposureUrine.NumberOfSample == null || $scope.exposureUrine.NumberOfSample == '') {
                         $scope.exposureUrine.NumberOfSample = 1;
                     }
                     $scope.ExpectedDueDate = $scope.exposureUrine.ExpectedDueDate;

                     if ($scope.exposureUrine.ExposureEncounterSummaryID != 0) {
                         GetRemarkCodeLookUp();
                         CheckForInUseIdsDetails();
                     }
                     globalobject.showHideResultsTab = data.d.Object.showHideResultsTab;
                 }
                 //  $scope.showLoadingOverlay = false;


             };

             function getDetailDataError(data, status, headers, config) {
                 $scope.showLoadingOverlay = false;
             };
             ////////////////////////////////////////////////////////////////////////////////////////////////////
             function GetRemarkCodeLookUp() {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRemarkCodeLookUp",
                     data: { IsMobile: false, InUsedIDs: $scope.InUsedIDs }
                 };
                 sharedservices.xhrService(configs)
                  .success(getRmarkCodeDataSuccess)
                  .error(getRmarkCodeDataError);
             }
             function getRmarkCodeDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.RemarksCodeList = data.d.Object
                     $scope.loading = false
                     setTimeout(function () { $scope.RemarkCodePicklist.Remarkcode = JSON.parse("[" + $scope.InUsedIDs.replace(/^,|,$/g, '') + "]"); $scope.loading = true; $("#ddlRemarkCode input").focus(); $("#ddlRemarkCode input").blur(); }, 1500);
                     loadingComplete();
                 }

             };

             function loadingComplete() {
                 if ($scope.loading) {
                     $scope.showLoadingOverlay = false
                 }
                 else {
                     setInterval(function () { loadingComplete(); }, 500);
                 }
             }

             function getRmarkCodeDataError(data, status, headers, config) {
                 $scope.showLoadingOverlay = false
             };


             $scope.getTwoDecimalPlace = function (value) {
                 if (value.toLocaleString().indexOf('.') > -1) {
                     var arr = '';
                     var numPart = '';
                     var decPart = '';
                     arr = value.toLocaleString().split('.')
                     if (arr.length > 0) {
                         numPart = arr[0];
                         decPart = arr[1];
                     }
                     if (decPart.length >= 2) {
                         return Number(numPart + '.' + decPart.substring(0, 2));
                     }
                 }
                 return value;
             };

             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.checkNum = function (itemID) {

                 var value_1 = Number($('#' + itemID).val());
                 if ((isNaN(value_1)) || value_1 < 0) {
                     $('#' + itemID).val('');
                     $('#' + itemID).focus();
                     utilityservices.notify("numbers");
                 }
                 else {
                     if ($('#' + itemID).val().indexOf('.') > -1) {
                         var arr = '';
                         var numPart = '';
                         var decPart = '';
                         arr = $('#' + itemID).val().split('.')
                         if (arr.length > 0) {
                             numPart = arr[0];
                             decPart = arr[1];
                         }
                         if (decPart.length > 2) {
                             $('#' + itemID).val(numPart + '.' + decPart.substring(0, 2));
                             if (itemID == 'ULL') {
                                 $scope.results.UllLevel = numPart + '.' + decPart.substring(0, 2);
                             }
                             $('#' + itemID).focus();
                         }
                     }

                 }

             };

             $scope.decimalValidation = function (itemID) {
                 var arr = ''
                 var decPart = ''
                 var value_1 = Number($('#' + itemID).val());
                 arr = value_1.split('.')
                 if (arr.length > 0) {
                     decPart = arr[1];
                 }
                 if (decPart.length > 2) {
                     return false
                 }
                 return true;
             };

             $scope.keyPress = function (e) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     utilityservices.notify("numbers");
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
             };

             $scope.saveExposureUrine = function () {
                 $scope.showLoadingOverlay = true;
                 var saveStatus = true;
                 var msg = '';
                 var msg1 = '';

                 //To Solve Server Date Time Issue.
                 $scope.exposureUrine.DrawDate = new Date($scope.DrawDate).toDateString();

                 if ($scope.ExpectedDueDate != null) {
                     $scope.exposureUrine.ExpectedDueDate = new Date($scope.ExpectedDueDate).toDateString();
                 }

                 $scope.exposureUrine.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
                 $scope.exposureUrine.DrawTime = $('#hdnTime').val();

                 if ($scope.exposureUrine.DateSenttoLab != null) {
                     $scope.exposureUrine.DateSenttoLab = new Date($scope.exposureUrine.DateSenttoLab).toDateString();
                 }

                 $scope.exposureUrine.ReasonforRefusal = ($scope.exposureUrine.RefuseSampling) ? ($scope.exposureUrine.ReasonforRefusal) : "";
                 if ($scope.exposureUrine.Gender == '1000') {
                     $scope.exposureUrine.Pregnant = null;
                     $scope.exposureUrine.NoOfWeeks = "";
                     $scope.exposureUrine.ExpectedDueDate = "";
                 }

                 if ($scope.exposureUrine.RefuseSampling) {
                     $scope.exposureUrine.NumberOfSample = "";
                     $scope.exposureUrine.PriorityID = "";
                     $scope.exposureUrine.SampleStatusID = "";
                     $scope.exposureUrine.LaboratorylID = "";
                     $scope.exposureUrine.RemarkCodeID = "";
                     $scope.exposureUrine.ApprovalForLabProcessing = false;


                 }

                 if ($scope.exposureUrine.SentToLab == false) { $scope.exposureUrine.DateSenttoLab = ""; }

                 if ($scope.exposureUrine.ApprovalForLabProcessing == false) {
                     $scope.exposureUrine.SentToLab = false;
                     $scope.exposureUrine.DateSenttoLab = "";
                 }

                 if ($scope.exposureUrine.Gender == null
                   || $scope.exposureUrine.DrawDate == null
                   || ($scope.exposureUrine.RefuseSampling && ($scope.exposureUrine.ReasonforRefusal == '' || $scope.exposureUrine.ReasonforRefusal == null))
                   || ($scope.exposureUrine.RefuseSampling == false && ($scope.exposureUrine.NumberOfSample == null || $scope.exposureUrine.NumberOfSample == ''
                   || $scope.exposureUrine.PriorityID == null || $scope.exposureUrine.PriorityID == ''
                   || $scope.exposureUrine.LaboratorylID == null || $scope.exposureUrine.LaboratorylID == ''))
                   || $scope.exposureUrine.Gender == '1001' && $scope.exposureUrine.Pregnant == 'Yes' && ($scope.exposureUrine.NoOfWeeks == null
                   || $scope.exposureUrine.NoOfWeeks == '') && ($scope.exposureUrine.ExpectedDueDate == null
                   || $scope.exposureUrine.ExpectedDueDate == '')) {

                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }





                 if (globalobject.currentEncounter.FromSOAListScreen) {
                     if (($scope.EncounterDateFromSOA != "" && (moment($scope.exposureUrine.DrawDate).isBefore(moment($scope.EncounterDateFromSOA))))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgDrawDateShouldbeGreaterthanAppointmentEncounterDate');
                     }
                 }
                 else {
                     if (globalobject.currentEncounter.EncounterDetailDate != "" && (moment($scope.exposureUrine.DrawDate).isBefore(moment(globalobject.currentEncounter.EncounterDetailDate)))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgDrawDateShouldbeGreaterthanAppointmentEncounterDate');

                     }
                 }
                 var DrawDate = new Date($scope.exposureUrine.DrawDate);
                 var EncounterDetailDate = new Date(globalobject.currentEncounter.EncounterDetailDate);

                 if (saveStatus && DrawDate.toDateString() == EncounterDetailDate.toDateString()) {

                     //  var date = new Date();
                     //                     if (DrawDate.toDateString() == date.toDateString()) {
                     //  var timeNow = date.getHours() + ":" + date.getMinutes()
                     $scope.Hour = $scope.AppointmentTime.split(':')[0];
                     $scope.Minut = $scope.AppointmentTime.split(':')[1];
                     if (parseInt($scope.exposureUrine.DrawTime.split(':')[0]) < parseInt($scope.Hour)) {
                         saveStatus = false;
                         msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                     }
                     else if (parseInt($scope.exposureUrine.DrawTime.split(':')[0]) == parseInt($scope.Hour)) {
                         if (parseInt($scope.exposureUrine.DrawTime.split(':')[1]) < parseInt($scope.Minut)) {
                             saveStatus = false;
                             msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                         }
                     }
                     //                     }

                 }

                 if (globalobject.currentEncounter.EncounterDetailDate != "" && (moment($scope.exposureUrine.ExpectedDueDate).isBefore(moment(globalobject.currentEncounter.EncounterDetailDate)))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgExpectedDateShouldbeGreaterthanCurrentDate');
                 }

                 if ($scope.exposureUrine.ExpectedDueDate != undefined && $scope.exposureUrine.ExpectedDueDate != null) {
                     var ExpectedDate = new Date($scope.exposureUrine.ExpectedDueDate); //create a new date obj
                     var ExpectedDueDate = ExpectedDate.valueOf(); //Get the value of the date
                 }
                 var CurrentDate = new Date();
                 var CurrentDateYear = CurrentDate.valueOf();
                 if (ExpectedDueDate <= CurrentDateYear) {
                     saveStatus = false;
                     msg = $filter('translate')('msgExpectedDateShouldbeGreaterthanCurrentDate');
                 }
                 //  $scope.exposureUrine.DateSenttoLab
                 if (saveStatus && $scope.exposureUrine.DateSenttoLab != "" && $scope.exposureUrine.DrawDate != "" && (moment($scope.exposureUrine.DateSenttoLab).isBefore(moment($scope.exposureUrine.DrawDate)))) {
                     saveStatus = false;
                     msg = $filter('translate')('msgDateSendtoLabShouldbeGreaterthanDrawDate');
                 }


                 $scope.exposureUrine.RemarkCodeID = (angular.isArray($scope.RemarkCodePicklist.Remarkcode)) ? $scope.RemarkCodePicklist.Remarkcode.join() : $scope.RemarkCodePicklist.Remarkcode;

                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/SaveULLDetails",
                         data: { ULLDetailsObj: $scope.exposureUrine }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                 }
                 else {
                     saveStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if (msg != "") {
                         toastr.warning(msg);
                     }
                 }

             };

             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.exposureUrine.DateSenttoLab = data.d.Object.DateSenttoLab;
                     if ($scope.exposureUrine.SampleStatusID == '1001') { $scope.IsDisable = true; }
                     $scope.exposureUrine.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                     globalobject.currentEncounter.SelectedEncounterTypeID = 1001;

                     if (!globalobject.currentEncounter.FromSOAListScreen)
                         $scope.$parent.getEncounterAccordians();

                     else {
                         strGlobalExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                         strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
                         $scope.getexposureUrine();
                     }

                     $scope.frmUllDetails.$dirty = false;
                     utilityservices.notify("saved");
                 }
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;

             };

             function saveDetailHistorySuccess(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 if (data.d.Object != "" || data.d.Object != null) { $scope.Check = true; }
                 sharedservices.parseDates(data.d.Object);
                 $scope.HistoryList = data.d.Object;
                 $scope.applyUllResultPermission();
             };


             $scope.getSenttoLabDate = function (val) {

                 if (val) {
                     $scope.exposureUrine.DateSenttoLab = new Date();
                 }

                 else {
                     $scope.exposureUrine.DateSenttoLab = null;
                 }
             }


             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.results = {
                 ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID
                , PriorityID: ""
                , BatchNumber: ""
                , SampleID: ""
                , SampleReceivedDate: ""
                , AnalysisDate: ""
                , AnalysisMethodID: ""
                , UllLevel: ""
                , ResultSampleStatusID: ""
                , ResultPermissibleRangeUOM: ""
                , ResultComments: ""
                , ResultPermissibleRangeID: ""
                , ULLUOMTypeID: ""
                , ResultReceivedDate: ""
                , PreviousULLValue: ""
                , CreatedBy: globalobject.currentSession.userid
                , PreviousValue: ""
                , DifferenceInValue: ""
                , Identifier: ""
                , PreviousUOMUnit: null
             };
             //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.ShowPrevResults = true;

             if (globalobject.currentEncounter.EmployeePK == 0 || globalobject.currentEncounter.EmployeePK == null) {

                 $scope.ShowPrevResults = false;
             }


             $scope.getUOMDifference = function () {

                 if ($scope.results.PreviousValue != null && !utilityservices.ValidateField($scope.results.ULLUOMTypeID) && !utilityservices.ValidateField($scope.results.UllLevel)) {

                     $scope.currentValue = $scope.results.UllLevel;
                     $scope.prevValue = $scope.results.PreviousValue;

                     if ($scope.results.PreviousUOMUnit == 1001) {

                         $scope.prevValue = parseFloat($scope.results.PreviousValue / 10);
                     }


                     if ($scope.results.ULLUOMTypeID == 1001) {

                         $scope.currentValue = parseFloat($scope.results.UllLevel / 10);
                     }

                     $scope.results.DifferenceInValue = ($scope.currentValue - $scope.prevValue).toFixed(2);

                     if ($scope.results.DifferenceInValue > 0)
                         $scope.results.Identifier = '+';

                     else if ($scope.results.DifferenceInValue < 0) {

                         $scope.results.DifferenceInValue = -($scope.results.DifferenceInValue);
                         $scope.results.Identifier = '-';
                     }

                     else
                         $scope.results.Identifier = '=';

                 }
             }

             function CheckForInUseIdsResults() {
                 var i, innerHTML, c = 0;
                 var ddlReplace = '<option value="? string: ?"></option>';
                 var ddlReplace1 = '<option value="? number:1000 ?"></option>';
                 if ($scope.results.AnalysisMethodID != null) {
                     for (i = $scope.AnalysisMethodList.length - 1; i > -1; i--) {
                         if ($scope.AnalysisMethodList[i].ID === $scope.results.AnalysisMethodID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlAnalysisMethod').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         innerHTML = innerHTML + '<option value="' + $scope.results.AnalysisMethodID + '" selected="selected" >' + $scope.results.AnalysisMethod + '</option>';
                         $('#ddlAnalysisMethod').html(innerHTML);
                     }

                     setTimeout(function () { $('#ddlAnalysisMethod').val($scope.results.AnalysisMethodID); }, 1000);
                 }

                 c = 0;
                 if ($scope.results.ResultPermissibleRangeID != null && $scope.results.ResultPermissibleRangeID != 0) {
                     for (i = $scope.ResultPermissibleRangeList.length - 1; i > -1; i--) {
                         if ($scope.ResultPermissibleRangeList[i].ID === $scope.results.ResultPermissibleRangeID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlResultPermissibleRange').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         innerHTML = innerHTML + '<option value="' + $scope.results.ResultPermissibleRangeID + '" selected="selected" >' + $scope.results.ResultPermissibleRange + '</option>';
                         $('#ddlResultPermissibleRange').html(innerHTML);
                     }

                     setTimeout(function () { $('#ddlResultPermissibleRange').val($scope.results.ResultPermissibleRangeID); }, 1000);
                 }

             }

             $scope.getULLResultDetails = function () {
                 $scope.showLoadingOverlay = true;
                 var configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetULLResults",
                     data: { AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID, ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID, EmployeePK: globalobject.currentEncounter.EmployeePK }
                 };

                 sharedservices.xhrService(configs)
                 .success(getDataSuccess)
                 .error(getDataError);
             };

             function getDataSuccess(data, status, headers, config) {
                 if (data.d.IsOK) {
                     //toastr.success('Call Success');
                     sharedservices.parseDates(data.d.Object);
                     $scope.results = data.d.Object;
                     if ($scope.results.UllLevel == 0) {
                         for (var i = $scope.AnalysisMethodList.length - 1; i > -1; i--) {
                             if ($scope.AnalysisMethodList[i].isDefault) {
                                 $scope.results.AnalysisMethodID = $scope.AnalysisMethodList[i].ID;
                             }
                         }
                         for (var i = $scope.UomtypeList.length - 1; i > -1; i--) {
                             if ($scope.UomtypeList[i].isDefault) {
                                 $scope.results.ULLUOMTypeID = $scope.UomtypeList[i].ID;
                             }
                         }
                     }
                     else
                         CheckForInUseIdsResults();

                     $scope.SetRangeType();
                     $scope.GetRange();
                     $scope.SampleReceivedDate = $scope.results.SampleReceivedDate;
                     $scope.AnalysisDate = $scope.results.AnalysisDate;
                     $scope.ResultReceivedDate = $scope.results.ResultReceivedDate;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetULLHistory",
                         data: { ExposureEncounterSummaryId: globalobject.currentEncounter.ExposureEncounterSummaryID }
                     };
                     sharedservices.xhrService(configs)
                  .success(saveDetailHistorySuccess)
                  .error(getDataError);
                 }
                 $scope.showLoadingOverlay = false;
             };


             function getDataError(data, status, headers, config) {
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };




             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.saveResults = function () {
                 $scope.showLoadingOverlay = true;
                 var saveStatus = true;
                 var msg = '';
                 $scope.GetRange();
                 $scope.results.SampleReceivedDate = new Date($scope.SampleReceivedDate).toDateString();
                 $scope.results.AnalysisDate = new Date($scope.AnalysisDate).toDateString();
                 $scope.results.ResultReceivedDate = new Date($scope.ResultReceivedDate).toDateString();
                 $scope.CurrentDate = new Date();

                 var SampleReceivedDate = $scope.SampleReceivedDate;
                 var AnalysisDate = $scope.AnalysisDate;
                 var ResultReceivedDate = $scope.ResultReceivedDate;

                 if ((SampleReceivedDate == null || SampleReceivedDate == '')
                 || (AnalysisDate == null || AnalysisDate == '')
                 || ($scope.results.ResultSampleStatusID == null)
                 || ($scope.results.ResultPermissibleRangeUOM == null || $scope.results.ResultPermissibleRangeUOM == '')
                 || ($scope.results.UllLevel == null || $scope.results.UllLevel == '')
                 || ($scope.results.ULLUOMTypeID == null || $scope.results.ULLUOMTypeID == '')
                 || (ResultReceivedDate == null || ResultReceivedDate == '')) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if (saveStatus && globalobject.currentEncounter.FromSOAListScreen) {
                     if (($scope.EncounterDateFromSOA != "" && (moment($scope.results.SampleReceivedDate).isBefore(moment($scope.EncounterDateFromSOA))))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanEncounterDate');
                     }
                 }
                 else {
                     if (saveStatus && (globalobject.currentEncounter.EncounterDetailDate != "" && (moment($scope.results.SampleReceivedDate).isBefore(moment(globalobject.currentEncounter.EncounterDetailDate))))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanEncounterDate');

                     }
                 }

                 if (saveStatus && ($scope.results.AnalysisDate != "" && (moment($scope.results.AnalysisDate).isBefore(moment($scope.results.SampleReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgAnalysisDateShouldbeGreaterthanSampleReceivedDate');

                 }
                 if (saveStatus && ($scope.results.SampleReceivedDate != "" && (moment($scope.results.ResultReceivedDate).isBefore(moment($scope.results.SampleReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldbeGreaterthanSampleReceivedDate');

                 }
                 if (saveStatus && ($scope.results.SampleReceivedDate != "" && $scope.exposureUrine.DateSenttoLab != "" && (moment($scope.results.SampleReceivedDate).isBefore(moment($scope.exposureUrine.DateSenttoLab))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanDateSendtoLab');

                 }
                 if (saveStatus && ($scope.results.AnalysisDate != "" && $scope.results.SampleReceivedDate != "" && (moment($scope.results.ResultReceivedDate).isBefore(moment($scope.results.AnalysisDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldbeGreaterthanAnalysisDate');

                 }
                 if (saveStatus && ($scope.results.ResultReceivedDate != "" && (moment($scope.CurrentDate).isBefore(moment($scope.results.ResultReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldntbeGreaterthanCurrentDate');

                 }
                 if (saveStatus && ($scope.exposureUrine.ExpectedDueDate != "" && (moment($scope.exposureUrine.ExpectedDueDate).isBefore(moment($scope.CurrentDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgExpectedDueDateShouldbeGreaterthanCurrentDate');

                 }

                 if (parseFloat($scope.results.UllLevel) >= 1000) {
                     saveStatus = false;
                     msg = $filter('translate')('msgUrineleadlevelshouldlessthen1000');
                 }

                 if (saveStatus && ($scope.results.UllLevel.toString().length > 6)) {
                     $scope.results.UllLevel = parseFloat($scope.results.UllLevel.toString().substring(0, 6));
                 }
                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;

                     $scope.results.UllLevel = parseFloat($scope.results.UllLevel).toFixed(2);

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/SaveULLResults",
                         data: { ULLResultsObj: $scope.results }
                     };
                     sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                 }
                 else {
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     saveStatus = true;
                     if (msg != "") {
                         toastr.warning(msg);
                     }
                 }

             };

             function saveDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     $scope.frmUllResults.$dirty = false;
                     utilityservices.notify("saved");
                     $scope.getULLResultDetails();

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetULLHistory",
                         data: { ExposureEncounterSummaryId: globalobject.currentEncounter.ExposureEncounterSummaryID }
                     }

                     sharedservices.xhrService(configs)
                  .success(saveDetailHistorySuccess)
                  .error(saveDataError);
                 }
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;

             };
             function saveDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };

             //To show-hide the Ull Value wrt Permission
             $scope.viewULLPermission = false;
             $scope.viewResultrangePermission = false;
             $scope.viewResultCommentsPermission = false;
             $scope.viewResultSampleStatusPermission = false;
             $scope.ullPrivacyInfo = false;

             $scope.applyUllResultPermission = function () {

                 if (!($scope.funPermissionCheck(450059, 'Any', $scope.results.CreatedBy))) {

                     $scope.results.UllLevel = $filter('translate')('lblPrivacyInformation');

                     angular.forEach($scope.HistoryList, function (item, index) {
                         item.PreviousULLValue = $filter('translate')('lblPrivacyInformation');
                     });

                     $scope.viewULLPermission = false;
                     $scope.ullPrivacyInfo = false;

                 }
                 else {
                     $scope.viewULLPermission = true;
                     $scope.ullPrivacyInfo = true;
                 }

                 if (!($scope.funPermissionCheck(450060, 'Any', $scope.results.CreatedBy))) {

                     $scope.viewResultSampleStatusPermission = false;
                 }
                 else {
                     $scope.viewResultSampleStatusPermission = true;
                 }

                 if (!($scope.funPermissionCheck(450061, 'Any', $scope.results.CreatedBy))) {

                     $scope.viewResultCommentsPermission = false;
                 }
                 else {
                     $scope.viewResultCommentsPermission = true;
                 }

                 if (!($scope.funPermissionCheck(450062, 'Any', $scope.results.CreatedBy))) {

                     $scope.viewResultrangePermission = false;
                 }
                 else {
                     $scope.viewResultrangePermission = true;
                 }

             }

             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         } ]);

