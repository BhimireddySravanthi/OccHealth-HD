
angular.module("app")
        .controller("BLLCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "$window", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {


             $scope.changeSubView = sharedservices.changeSubView;




             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLDetails" : 1000,
                 resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLResults" : 2004,
                 investigationFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/BLLInvestigation" : 2005
             };
             $scope.IsDisable = false;
             $scope.investigationCollection = [];
             var configs = undefined;
             $scope.Check = false;

             $scope.EncounterDateFromSOA = null;

             $scope.showSubNavbars = true;

             var strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
             var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
             var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;

             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.exposureBLL = {
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
            , NumberofSample: 1
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

             $scope.exposureBLL.DrawDate = date;

             $scope.BindDefaultDateTime = (function () {
                 var date = new Date();
                 var timeNow = date.getHours() + ":" + date.getMinutes()
                 $scope.Hour = timeNow.split(':')[0];
                 $scope.Minut = timeNow.split(':')[1];

                 $scope.exposureBLL.DrawDate = date;
                 $scope.DrawDate = date;
                 $scope.DrawTimet = sharedservices.setTime($scope.Hour, $scope.Minut);
                 $scope.hourStep = sharedservices.hourStep;
                 $scope.minuteStep = sharedservices.minuteStep;
             })();

             ///////////////////////////////////////////////////////////////////////////////////////////////
             $scope.GoToPreviousPage = function () {
                 $window.history.back();
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////
             function CheckForInUseIdsDetails() {
                 var i, innerHTML, c = 0;
                 var ddlReplace = '<option value="? string: ?"></option>';
                 var ddlReplace1 = '<option value="? number:1000 ?"></option>';
                 if ($scope.exposureBLL.LaboratorylID != null) {
                     for (i = $scope.LabList.length - 1; i > -1; i--) {
                         if ($scope.LabList[i].ID === $scope.exposureBLL.LaboratorylID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlLab').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         searchString = '<option value="' + $scope.exposureBLL.LaboratorylID + '" selected="selected">';
                         if (($scope.exposureBLL.LaboratorylID != null || $scope.exposureBLL.LaboratorylID != undefined) && (innerHTML.indexOf(searchString) <= -1)) {
                             innerHTML = innerHTML + '<option value="' + $scope.exposureBLL.LaboratorylID + '" selected="selected" >' + $scope.exposureBLL.LaboratoryName + '</option>';
                             $('#ddlLab').html(innerHTML);
                         }
                         else
                             $('#ddlLab').html(innerHTML);
                     }
                 }
                 //                 c = 0;
                 //                 if ($scope.exposureBLL.RemarkCodeID != null) {
                 //                     for (i = $scope.RemarksCodeList.length - 1; i > -1; i--) {
                 //                         if ($scope.RemarksCodeList[i].ID === $scope.exposureBLL.RemarkCodeID) {
                 //                             c++;
                 //                         }
                 //                     }
                 //                     if (c == 0) {
                 //                         innerHTML = $('#ddlRemarkCode').html();
                 //                         innerHTML = innerHTML.replace(ddlReplace, "");
                 //                         innerHTML = innerHTML.replace(ddlReplace1, "");
                 //                         searchString = '<option value="' + $scope.exposureBLL.RemarkCodeID + '" selected="selected">';
                 //                         if (($scope.exposureBLL.RemarkCodeID != null || $scope.exposureBLL.RemarkCodeID != undefined) && (innerHTML.indexOf(searchString) <= -1)) {
                 //                             innerHTML = innerHTML + '<option value="' + $scope.exposureBLL.RemarkCodeID + '" selected="selected" >' + $scope.exposureBLL.RemarkCodeName + '</option>';
                 //                             $('#ddlRemarkCode').html(innerHTML);
                 //                         }
                 //                         else
                 //                             $('#ddlRemarkCode').html(innerHTML);
                 //                     }
                 //                 }

                 setTimeout(function () { $('#ddlLab').val($scope.exposureBLL.LaboratorylID); }, 1000);
                 //                 setTimeout(function () { $('#ddlRemarkCode').val($scope.exposureBLL.RemarkCodeID); }, 1000);
             }
             // Function to Get the Details ******************
             $scope.getEncounterDetails = function () {

                 $scope.showLoadingOverlay = true;
                 globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);
                 globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

                 globalobject.currentEncounter.EmployeePK = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ?
                                                                    parseInt(sharedservices.getURLParameter().EmployeePK) : parseInt(globalobject.currentEncounter.EmployeePK);
                 var configs = {
                     url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectEncounterTypeByEncounterID",
                     data: { EncounterDetailID: parseInt(globalobject.currentEncounter.EncounterDetailID), AppointmentEncounterTypeID: parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID) }
                 };
                 sharedservices.xhrService(configs)
                    .then(function (response) {
                        if (response.data.d.IsOK) {
                            sharedservices.parseDates(response.data.d.Object[0]);
                            globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                            globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                            globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                            globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                            strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                            strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                            $scope.AppointmentTime = response.data.d.Object[0].TimeInOut;
                            if (globalobject.currentEncounter.FromSOAListScreen) {
                                $scope.EncounterDateFromSOA = response.data.d.Object[0].EncounterDate;
                            }
                            $scope.getexposureBLLDetails();
                        }
                        else {
                            $scope.showLoadingOverlay = false;
                        }
                    });

             };
             // $scope.getEncounterDetails();
             setTimeout(function () { $scope.getEncounterDetails(); }, 100);

             ////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.GetRange = function () {
                 if (!utilityservices.ValidateField($scope.BLLresults.BLLUOMTypeID) && !utilityservices.ValidateField($scope.BLLresults.BloodLeadLevel)) {

                     var BloodLeadLevel = parseFloat($scope.getTwoDecimalPlace($scope.BLLresults.BloodLeadLevel));

                     if ($scope.BLLresults.BLLUOMTypeID == 1001)
                         BloodLeadLevel = $scope.getTwoDecimalPlace(BloodLeadLevel / 10);

                     var configs = {};
                     configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/ULLService.asmx/GetRange",
                         data: { UllLevel: BloodLeadLevel }
                     };

                     sharedservices.xhrService(configs)
                  .success(getRangeDataSuccess)
                  .error(getRangeDataError);
                 }

                 else {
                     $scope.BLLresults.ResultPermissibleRangeID = null;
                 }

             };
             function getRangeDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.BLLresults.ResultPermissibleRangeID = data.d.Object.ResultPermissibleRangeID;
                 }
                 setTimeout(function () { $('#ddlResultPermissibleRange').val($scope.BLLresults.ResultPermissibleRangeID); }, 1000);

             };

             function getRangeDataError(data, status, headers, config) {

             };


             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.SetRangeType = function () {

                 if (!utilityservices.ValidateField($scope.BLLresults.BLLUOMTypeID) && !utilityservices.ValidateField($scope.BLLresults.BloodLeadLevel)) {

                     $scope.BLLresults.ResultPermissibleRangeUOM = 1000;
                     $scope.GetRange();

                     if ($scope.BLLresults.PreviousValue != null) {

                         $scope.BLLresults.DifferenceUOM = 1000;
                         $scope.getUOMDifference();
                     }
                     else
                         $scope.BLLresults.DifferenceUOM = null;
                 }

                 else {
                     $scope.BLLresults.ResultPermissibleRangeID = null;
                 }

             };

             ////////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.cancelBLL = function (fromPage) {

                 if (fromPage == 'Details')
                     $scope.Dirty = $scope.frmBllDetails.$dirty && !($scope.ResultSaved);

                 if (fromPage == 'Results')
                     $scope.Dirty = $scope.frmBllResults.$dirty;

                 if ($scope.Dirty) {

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

             $scope.getexposureBLLDetails = function () {
                 $scope.showLoadingOverlay = true;
                 var configs = {};
                 sharedservices.parseDates(globalobject.currentEncounter);
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/GetBLLDetails",
                     data: { EncounterDetailID: strGlobalEncounterDetailID, ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };



             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.exposureBLL = data.d.Object;
                     $scope.exposureBLL.Gender = globalobject.employee.GenderId;

                     $scope.ResultSaved = data.d.Object.ResultSaved;

                     if (data.d.Object.RemarkCodeID != null) {
                         $scope.InUsedIDs = data.d.Object.RemarkCodeID;
                     }

                     if ($scope.exposureBLL.ExposureEncounterSummaryID != 0 && $scope.exposureBLL.DrawTime != null) {
                         var d = new Date();
                         d.setHours($scope.exposureBLL.DrawTime.split(':')[0]);
                         d.setMinutes($scope.exposureBLL.DrawTime.split(':')[1]);
                         $scope.DrawTimet = d;
                     }
                     if ($scope.exposureBLL.NumberofSample == null || $scope.exposureBLL.NumberofSample == '') {
                         $scope.exposureBLL.NumberofSample = 1;
                     }

                     if ($scope.exposureBLL.ExposureEncounterSummaryID != 0) {
                         $scope.DrawDate = $scope.exposureBLL.DrawDate;
                     }

                     $scope.ExpectedDueDate = $scope.exposureBLL.ExpectedDueDate;
                     if ($scope.exposureBLL.ExposureEncounterSummaryID != 0) {
                         GetRemarkCodeLookUp();
                         CheckForInUseIdsDetails();
                     }

                     globalobject.showHideResultsTab = data.d.Object.showHideResultsTab;
                 }
                 $scope.showLoadingOverlay = false;

             };

             function getDetailDataError(data, status, headers, config) {
                 $scope.showLoadingOverlay = false;
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
                     if (decPart.length > 2) {
                         return Number(numPart + '.' + decPart.substring(0, 2));
                     }
                 }
                 return value;
             };

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
                         if (decPart.length >= 2) {
                             $('#' + itemID).val(numPart + '.' + decPart.substring(0, 2));
                             if (itemID == 'Blood1') {
                                 $scope.BLLresults.BloodLeadLevel = numPart + '.' + decPart.substring(0, 2);
                             }
                             $('#' + itemID).focus();
                         }
                     }

                 }


             };
             ////////////////////////////////////////////////////////////////////////////////////////////////////
             function GetRemarkCodeLookUp() {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRemarkCodeLookUp",
                     data: { IsMobile: false, InUsedIDs: $scope.InUsedIDs.toString() }
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


             ////////////////////////////////////////////////////////////////////////////////////////////////////////////

             if ($scope.exposureBLL.DrawDate == 'Thu Jan 01 1970' || $scope.exposureBLL.DrawDate == 'Jan 01 1970') { $scope.exposureBLL.DrawDate = null; }

             $scope.getUOMDifference = function () {

                 if ($scope.BLLresults.PreviousValue != null && !utilityservices.ValidateField($scope.BLLresults.BLLUOMTypeID) && !utilityservices.ValidateField($scope.BLLresults.BloodLeadLevel)) {

                     $scope.currentValue = $scope.BLLresults.BloodLeadLevel;
                     $scope.PrevValue = $scope.BLLresults.PreviousValue;

                     if ($scope.BLLresults.BLLUOMTypeID == 1001) {

                         $scope.currentValue = parseFloat($scope.BLLresults.BloodLeadLevel / 10);
                     }

                     if ($scope.BLLresults.PreviousUOMUnit == 1001) {

                         $scope.PrevValue = parseFloat($scope.BLLresults.PreviousValue / 10);
                     }

                     $scope.BLLresults.DifferenceInValue = ($scope.currentValue - $scope.PrevValue).toFixed(2);

                     if ($scope.BLLresults.DifferenceInValue > 0)
                         $scope.BLLresults.Identifier = '+';

                     else if ($scope.BLLresults.DifferenceInValue < 0) {

                         $scope.BLLresults.DifferenceInValue = -($scope.BLLresults.DifferenceInValue);
                         $scope.BLLresults.Identifier = '-';
                     }

                     else
                         $scope.BLLresults.Identifier = '=';
                 }
             }

             $scope.saveExposureBLL = function () {
                 $scope.showLoadingOverlay = true;
                 var saveStatus = true;
                 var msg = '';
                 var msg1 = '';

                 //   $scope.appointmentDetails.AppointmentTimeIn = $('#hdnTimeIn').val();

                 //var CurrentDate = new date();
                 //To Solve Server Date Time Issue.
                 $scope.exposureBLL.DrawDate = new Date($scope.DrawDate).toDateString();

                 if ($scope.ExpectedDueDate != null) {
                     $scope.exposureBLL.ExpectedDueDate = new Date($scope.ExpectedDueDate).toDateString();
                 }

                 $scope.exposureBLL.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID; //globalobject.currentEncounter.AppointmentEncounterTypeID;
                 $scope.exposureBLL.DrawTime = $('#hdnTime').val();
                 if ($scope.exposureBLL.DateSenttoLab != null) {
                     $scope.exposureBLL.DateSenttoLab = new Date($scope.exposureBLL.DateSenttoLab).toDateString();
                 }

                 $scope.exposureBLL.ReasonforRefusal = ($scope.exposureBLL.RefuseSampling) ? ($scope.exposureBLL.ReasonforRefusal) : "";
                 if ($scope.exposureBLL.Gender == '1000') {
                     $scope.exposureBLL.Pregnant = null;
                     $scope.exposureBLL.NoOfWeeks = null;
                     $scope.exposureBLL.ExpectedDueDate = "";
                 }

                 if ($scope.exposureBLL.RefuseSampling) {
                     $scope.exposureBLL.NumberofSample = null;
                     $scope.exposureBLL.PriorityID = null;
                     $scope.exposureBLL.SampleStatusID = null;
                     $scope.exposureBLL.LaboratorylID = null;
                     $scope.exposureBLL.RemarkCodeID = null;
                     $scope.exposureBLL.ApprovalForLabProcessing = false;


                 }
                 if ($scope.exposureBLL.SentToLab == false) { $scope.exposureBLL.DateSenttoLab = ""; }

                 if ($scope.exposureBLL.ApprovalForLabProcessing == false) {
                     $scope.exposureBLL.SentToLab = false;
                     $scope.exposureBLL.DateSenttoLab = "";
                 }

                 if (globalobject.currentEncounter.FromSOAListScreen) {
                     if (($scope.EncounterDateFromSOA != "" && (moment($scope.exposureBLL.DrawDate).isBefore(moment($scope.EncounterDateFromSOA))))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgDrawDateShouldbeGreaterthanAppointmentEncounterDate');
                     }
                 }
                 else {
                     if (globalobject.currentEncounter.EncounterDetailDate != "" && (moment($scope.exposureBLL.DrawDate).isBefore(moment(globalobject.currentEncounter.EncounterDetailDate)))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgDrawDateShouldbeGreaterthanAppointmentEncounterDate');

                     }
                 }
                 var DrawDate = new Date($scope.exposureBLL.DrawDate);
                 var EncounterDetailDate = new Date(globalobject.currentEncounter.EncounterDetailDate);
                 if ($scope.exposureBLL.DrawDate == 'Thu Jan 01 1970' || $scope.exposureBLL.DrawDate == 'Jan 01 1970') { $scope.exposureBLL.DrawDate = null; }

                 if ($scope.exposureBLL.Gender == null
                   || $scope.exposureBLL.DrawDate == null
                   || $scope.exposureBLL.DrawDate == ''
                   || ($scope.exposureBLL.RefuseSampling && ($scope.exposureBLL.ReasonforRefusal == '' || $scope.exposureBLL.ReasonforRefusal == null))
                   || ($scope.exposureBLL.RefuseSampling == false && ($scope.exposureBLL.NumberofSample == null || $scope.exposureBLL.NumberofSample == ''
                   || $scope.exposureBLL.PriorityID == null || $scope.exposureBLL.PriorityID == ''
                   || $scope.exposureBLL.LaboratorylID == null || $scope.exposureBLL.LaboratorylID == ''))
                   || $scope.exposureBLL.Gender == '1001' && $scope.exposureBLL.Pregnant == 'Yes' && ($scope.exposureBLL.NoOfWeeks == null
                   || $scope.exposureBLL.NoOfWeeks == '') && ($scope.exposureBLL.ExpectedDueDate == null
                   || $scope.exposureBLL.ExpectedDueDate == '')) {

                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                 }
                 else if (DrawDate.toDateString() == EncounterDetailDate.toDateString()) {
                     // var date = new Date();
                     //                     if (DrawDate.toDateString() == date.toDateString()) {
                     //  var timeNow = date.getHours() + ":" + date.getMinutes()
                     $scope.Hour = $scope.AppointmentTime.split(':')[0];
                     $scope.Minut = $scope.AppointmentTime.split(':')[1];

                     // $scope.currentTime = sharedservices.setTime($scope.Hour, $scope.Minut);
                     // if ($scope.DrawTimet <= $scope.currentTime){
                     if (parseInt($scope.exposureBLL.DrawTime.split(':')[0]) < parseInt($scope.Hour)) {
                         saveStatus = false;
                         msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                     }
                     else if (parseInt($scope.exposureBLL.DrawTime.split(':')[0]) == parseInt($scope.Hour)) {
                         if (parseInt($scope.exposureBLL.DrawTime.split(':')[1]) < parseInt($scope.Minut)) {
                             saveStatus = false;
                             msg = $filter('translate')('msgTimeshouldtobelessthanappointmenttime');
                         }
                     }
                     //                     }

                 }
                 if (saveStatus && $scope.exposureBLL.DateSenttoLab != "" && $scope.exposureBLL.DrawDate != "" && (moment($scope.exposureBLL.DateSenttoLab).isBefore(moment($scope.exposureBLL.DrawDate)))) {
                     saveStatus = false;
                     msg = $filter('translate')('msgDateSendtoLabShouldbeGreaterthanDrawDate');
                 }

                 if ($scope.exposureBLL.ExpectedDueDate != undefined && $scope.exposureBLL.ExpectedDueDate != null && $scope.exposureBLL.ExpectedDueDate != '') {
                     var ExpectedDate = new Date($scope.exposureBLL.ExpectedDueDate); //create a new date obj
                     var ExpectedDueDate = ExpectedDate.valueOf(); //Get the value of the date
                 }
                 var CurrentDate = new Date();
                 var CurrentDateYear = CurrentDate.valueOf();
                 if (ExpectedDueDate <= CurrentDateYear) {
                     saveStatus = false;
                     msg = $filter('translate')('msgExpectedDateShouldbeGreaterthanCurrentDate');
                 }

                 $scope.exposureBLL.RemarkCodeID = (angular.isArray($scope.RemarkCodePicklist.Remarkcode)) ? $scope.RemarkCodePicklist.Remarkcode.join() : $scope.RemarkCodePicklist.Remarkcode;

                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/SaveBLLDetails",
                         data: { bLLObj: $scope.exposureBLL }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
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
             //             $scope.callsaveExposureBLL()
             //             {
             //                 if (!$scope.IsDisable) {
             //                     $scope.saveExposureBLL();
             //                 }
             //             };

             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     if ($scope.exposureBLL.SampleStatusID == '1001') { $scope.IsDisable = true; }
                     $scope.exposureBLL.DateSenttoLab = data.d.Object.DateSenttoLab;
                     $scope.exposureBLL.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                     globalobject.currentEncounter.SelectedEncounterTypeID = 1000;

                     if (!globalobject.currentEncounter.FromSOAListScreen)
                         $scope.$parent.getEncounterAccordians();

                     else {
                         strGlobalExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                         strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
                         $scope.getexposureBLLDetails();
                     }

                     $scope.frmBllDetails.$dirty = false;
                     utilityservices.notify("saved");

                 }
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;

             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };

             function saveDetailHistorySuccess(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 if (data.d.Object != "" || data.d.Object != null) { $scope.Check = true; }
                 sharedservices.parseDates(data.d.Object);
                 $scope.HistoryList = data.d.Object;

                 $scope.applyBllResultPermission();
             };


             $scope.getSenttoLabDate = function (val) {

                 if (val) {
                     $scope.exposureBLL.DateSenttoLab = new Date();
                 }

                 else {
                     $scope.exposureBLL.DateSenttoLab = null;
                 }
             }


             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.BLLresults = {
                 ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID
        , PriorityID: ""
        , BatchNumber: ""
        , SampleID: ""
        , SampleReceivedDate: ""
        , AnalysisDate: ""
        , AnalysisMethodID: ""
        , BloodLeadLevel: ""
        , ZincProtoporphyrin: ""
        , ResultSampleStatusID: ""
        , ResultPermissibleRangeUOM: ""
        , ResultComments: ""
        , ResultPermissibleRangeID: ""
        , BLLUOMTypeID: ""
        , ZPPUOMTypeID: ""
        , ResultReceivedDate: ""
        , UpdatedDate: ""
        , PreviousBllValue: ""
        , PreviousZppValue: ""
        , PreviousValue: ""
        , DifferenceInValue: ""
        , Identifier: ""
        , PreviousUOMUnit: null
        , CreatedBy: globalobject.currentSession.userid
        , IsResultSave: false
             };




             //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             function CheckForInUseIdsResults() {
                 var i, innerHTML, c = 0;
                 var ddlReplace = '<option value="? string: ?"></option>';
                 var ddlReplace1 = '<option value="? number:1000 ?"></option>';
                 if ($scope.BLLresults.AnalysisMethodID != null) {
                     for (i = $scope.AnalysisMethodList.length - 1; i > -1; i--) {
                         if ($scope.AnalysisMethodList[i].ID === $scope.BLLresults.AnalysisMethodID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlAnalysisMethod').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         if (($scope.BLLresults.AnalysisMethodID != null || $scope.BLLresults.AnalysisMethodID != undefined)) {
                             innerHTML = innerHTML + '<option value="' + $scope.BLLresults.AnalysisMethodID + '" selected="selected" >' + $scope.BLLresults.AnalysisMethod + '</option>';
                             $('#ddlAnalysisMethod').html(innerHTML);
                         }
                         else
                             $('#ddlAnalysisMethod').html(innerHTML);
                     }
                 }

                 c = 0;
                 if ($scope.BLLresults.ResultPermissibleRangeID != null) {
                     for (i = $scope.ResultPermissibleRangeList.length - 1; i > -1; i--) {
                         if ($scope.ResultPermissibleRangeList[i].ID === $scope.BLLresults.ResultPermissibleRangeID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlResultPermissibleRange').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML.replace(ddlReplace1, "");
                         if (($scope.exposureBLL.ResultPermissibleRangeID != null || $scope.exposureBLL.ResultPermissibleRangeID != undefined) && $scope.exposureBLL.ResultPermissibleRangeID.length > 0) {
                             innerHTML = innerHTML + '<option value="' + $scope.BLLresults.ResultPermissibleRangeID + '" selected="selected" >' + $scope.BLLresults.ResultPermissibleRange + '</option>';
                             $('#ddlResultPermissibleRange').html(innerHTML);
                         }
                         else
                             $('#ddlResultPermissibleRange').html(innerHTML);
                     }
                 }

                 setTimeout(function () { $('#ddlAnalysisMethod').val($scope.BLLresults.AnalysisMethodID); }, 1000);
                 setTimeout(function () { $('#ddlResultPermissibleRange').val($scope.BLLresults.ResultPermissibleRangeID); }, 1000);
             }

             $scope.BLLresults.Identifier = '=';

             $scope.ShowPrevResults = true;

             if (globalobject.currentEncounter.EmployeePK == 0 || globalobject.currentEncounter.EmployeePK == null) {

                 $scope.ShowPrevResults = false;
             }

             $scope.getBLLResultDetails = function () {
                 $scope.showLoadingOverlay = true;
                 var configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/GetBLLResults",
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

                     $scope.BLLresults = data.d.Object;

                     if ($scope.BLLresults.BloodLeadLevel == 0) {
                         for (var i = $scope.AnalysisMethodList.length - 1; i > -1; i--) {
                             if ($scope.AnalysisMethodList[i].isDefault) {
                                 $scope.BLLresults.AnalysisMethodID = $scope.AnalysisMethodList[i].ID;
                             }
                         }
                         for (var i = $scope.UomtypeList.length - 1; i > -1; i--) {
                             if ($scope.UomtypeList[i].isDefault) {
                                 $scope.BLLresults.BLLUOMTypeID = $scope.UomtypeList[i].ID;
                                 $scope.BLLresults.ZPPUOMTypeID = $scope.UomtypeList[i].ID;
                             }
                         }
                     }
                     else
                         CheckForInUseIdsResults();

                     $scope.SetRangeType();
                     $scope.GetRange();
                     $scope.SampleReceivedDate = $scope.BLLresults.SampleReceivedDate;
                     $scope.AnalysisDate = $scope.BLLresults.AnalysisDate;
                     $scope.ResultReceivedDate = $scope.BLLresults.ResultReceivedDate;
                     $scope.BLLresults.IsResultSave = !utilityservices.ValidateField($scope.BLLresults.ResultReceivedDate)

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/GetBLLHistory",
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

             $scope.keyPress = function (e) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     utilityservices.notify("numbers");
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
             };


             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.saveResults = function () {
                 $scope.showLoadingOverlay = true;
                 var saveStatus = true;
                 var msg = '';

                 $scope.GetRange();
                 $scope.BLLresults.SampleReceivedDate = new Date($scope.SampleReceivedDate).toDateString();
                 $scope.BLLresults.AnalysisDate = new Date($scope.AnalysisDate).toDateString();
                 $scope.BLLresults.ResultReceivedDate = new Date($scope.ResultReceivedDate).toDateString();
                 $scope.CurrentDate = new Date();
                 var SampleReceivedDate = $scope.SampleReceivedDate;
                 var AnalysisDate = $scope.AnalysisDate;
                 var ResultReceivedDate = $scope.ResultReceivedDate;

                 if (($scope.BLLresults.SampleReceivedDate == null || $scope.BLLresults.SampleReceivedDate == '')
                  || (AnalysisDate == null || AnalysisDate == '')
                  || ($scope.BLLresults.ResultSampleStatusID == null)
                  || ($scope.BLLresults.ResultPermissibleRangeUOM == null || $scope.BLLresults.ResultPermissibleRangeUOM == '')
                  || ($scope.BLLresults.BloodLeadLevel == null || $scope.BLLresults.BloodLeadLevel == '')
                 //|| ($scope.BLLresults.ZincProtoporphyrin == null || $scope.BLLresults.ZincProtoporphyrin == '')
                  || ($scope.BLLresults.BLLUOMTypeID == null || $scope.BLLresults.BLLUOMTypeID == '')
                 //|| ($scope.BLLresults.ZPPUOMTypeID == null || $scope.BLLresults.ZPPUOMTypeID == '')
                  || (ResultReceivedDate == null || ResultReceivedDate == '')) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if (saveStatus && globalobject.currentEncounter.FromSOAListScreen) {
                     if ($scope.EncounterDateFromSOA != "" && (moment($scope.BLLresults.SampleReceivedDate).isBefore(moment($scope.EncounterDateFromSOA)))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanAppointmentEncounterDate');
                     }
                 }
                 else {
                     if (saveStatus && (globalobject.currentEncounter.EncounterDetailDate != "" && (moment($scope.BLLresults.SampleReceivedDate).isBefore(moment(globalobject.currentEncounter.EncounterDetailDate))))) {
                         saveStatus = false;
                         msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanAppointmentEncounterDate');

                     }
                 }
                 if (saveStatus && ($scope.BLLresults.AnalysisDate != "" && (moment($scope.BLLresults.AnalysisDate).isBefore(moment($scope.BLLresults.SampleReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgAnalysisDateShouldbeGreaterthanSampleReceivedDate');

                 }
                 if (saveStatus && ($scope.BLLresults.SampleReceivedDate != "" && $scope.exposureBLL.DateSenttoLab != "" && (moment($scope.BLLresults.SampleReceivedDate).isBefore(moment($scope.exposureBLL.DateSenttoLab))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgSampleReceivedDateShouldbeGreaterthanDateSendtoLab');

                 }

                 if (saveStatus && ($scope.BLLresults.SampleReceivedDate != "" && (moment($scope.BLLresults.ResultReceivedDate).isBefore(moment($scope.BLLresults.SampleReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldbeGreaterthanSampleReceivedDate');

                 }
                 if (saveStatus && ($scope.BLLresults.ResultReceivedDate != "" && (moment($scope.CurrentDate).isBefore(moment($scope.BLLresults.ResultReceivedDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldntbeGreaterthanCurrentDate');

                 }
                 if (saveStatus && ($scope.BLLresults.AnalysisDate != "" && $scope.BLLresults.SampleReceivedDate != "" && (moment($scope.BLLresults.ResultReceivedDate).isBefore(moment($scope.BLLresults.AnalysisDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgResultReceivedDateShouldbeGreaterthanAnalysisDate');

                 }
                 if (saveStatus && ($scope.BLLresults.ExpectedDueDate != "" && (moment($scope.BLLresults.ExpectedDueDate).isBefore(moment($scope.CurrentDate))))) {
                     saveStatus = false;

                     msg = $filter('translate')('msgExpectedDueDateShouldbeGreaterthanCurrebDate');

                 }
                 if (saveStatus && ($scope.BLLresults.BloodLeadLevel.toString().length > 6)) {
                     $scope.BLLresults.BloodLeadLevel = parseFloat($scope.BLLresults.BloodLeadLevel.toString().substring(0, 6));
                 }
                 if ($scope.BLLresults.ZincProtoporphyrin == null) {
                 }
                 else {
                     if (saveStatus && ($scope.BLLresults.ZincProtoporphyrin.toString().length > 6)) {
                         $scope.BLLresults.ZincProtoporphyrin = parseFloat($scope.BLLresults.ZincProtoporphyrin.toString().substring(0, 6));
                     }
                 }
                 if (parseFloat($scope.BLLresults.BloodLeadLevel) >= 1000 || parseFloat($scope.BLLresults.ZincProtoporphyrin) >= 1000) {
                     saveStatus = false;
                     msg = $filter('translate')('msgBloodLeadLevelZincProtoporphyrinshouldlessthen1000');
                 }

                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;

                     $scope.BLLresults.BloodLeadLevel = parseFloat($scope.BLLresults.BloodLeadLevel).toFixed(2);

                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/SaveBLLResults",
                         data: { BLLresultsObj: $scope.BLLresults }
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
                     utilityservices.notify("saved");
                     $scope.frmBllResults.$dirty = false;
                     $scope.getBLLResultDetails();
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/BLLService.asmx/GetBLLHistory",
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

             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.getEmpNotfiyLetter = function () {
                 var url = '/OccHealth/Encounters/EncounterTypes/NotificationLetter.aspx?ExposureEncounterSummaryID=' + globalobject.currentEncounter.ExposureEncounterSummaryID.toString();
                 window.open(url, 'Employee Notification Letter', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
             }

             $scope.viewBLLPermission = false;
             $scope.viewZppPermission = false;
             $scope.viewResultrangePermission = false;
             $scope.viewResultCommentsPermission = false;
             $scope.viewResultSampleStatusPermission = false;
             $scope.bllPrivacyInfo = false;
             $scope.zincPrivacyInfo = false;

             //To show-hide the Bll Value wrt Permission
             $scope.applyBllResultPermission = function () {

                 if (!($scope.funPermissionCheck(450057, 'Any', $scope.BLLresults.CreatedBy))) {

                     $scope.BLLresults.BloodLeadLevel = $filter('translate')('lblPrivacyInformation');

                     angular.forEach($scope.HistoryList, function (item, index) {
                         item.PreviousBllValue = $filter('translate')('lblPrivacyInformation');
                     });

                     $scope.viewBLLPermission = false;
                     $scope.bllPrivacyInfo = false;
                 }
                 else {
                     $scope.viewBLLPermission = true;
                     $scope.bllPrivacyInfo = true;
                 }

                 if (!($scope.funPermissionCheck(450058, 'Any', $scope.BLLresults.CreatedBy))) {

                     $scope.BLLresults.ZincProtoporphyrin = $filter('translate')('lblPrivacyInformation');

                     angular.forEach($scope.HistoryList, function (item, index) {
                         item.PreviousZppValue = $filter('translate')('lblPrivacyInformation');
                     });

                     $scope.viewZppPermission = false;
                     $scope.zincPrivacyInfo = false;

                 } else {
                     $scope.viewZppPermission = true;
                     $scope.zincPrivacyInfo = true;
                 }

                 if (!($scope.funPermissionCheck(450060, 'Any', $scope.BLLresults.CreatedBy))) {

                     $scope.viewResultSampleStatusPermission = false;
                 }
                 else {
                     $scope.viewResultSampleStatusPermission = true;
                 }

                 if (!($scope.funPermissionCheck(450061, 'Any', $scope.BLLresults.CreatedBy))) {

                     $scope.viewResultCommentsPermission = false;
                 }
                 else {
                     $scope.viewResultCommentsPermission = true;
                 }

                 if (!($scope.funPermissionCheck(450062, 'Any', $scope.BLLresults.CreatedBy))) {

                     $scope.viewResultrangePermission = false;
                 }
                 else {
                     $scope.viewResultrangePermission = true;
                 }
             }


         } ]);



       
