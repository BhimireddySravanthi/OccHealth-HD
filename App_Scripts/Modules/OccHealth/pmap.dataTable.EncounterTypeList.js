$(document).ready(function () {
    var DropVal = getURLParameter("DropVal");
    var chkViewResultVal = getURLParameter("chkViewResultVal");
    var SelectedDropVal = getURLParameter("SelectedDropVal");
    var EncounterTypeID;
    $("#spPrintNotificationGrid").hide();
    MultilingualViewModel(450042);
    $.ajax
    ({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/EncounterTypeDropDown",
        data: "{selectedOption:'" + DropVal + "'}",
        success: function (data) {
            var strInnerHTML = data.d;
            $("#ddlType").html(strInnerHTML);
            $("#ddlType").val(DropVal);
        }
    });
    var objDataTable1;

    //$("#chkViewResult").val(chkViewResultVal);
    if (Number(DropVal) == Number(SelectedDropVal)) {
        $('#chkViewResult').attr('checked', (chkViewResultVal == 'true'));
    }
    else {
        //        sessionStorage.removeItem('GridViewID');
        //        sessionStorage.removeItem('GridSettings');
        $('#chkViewResult').attr('checked', false);
    }

    if (Number(DropVal) == 1000 || Number(DropVal) == 1001) {
        $('#SelectResult').show();
    }
    else {
        $('#SelectResult').hide();
    }

    // For Multilingual implemntation

        var Encounter = GetMultilingualText('EncounterType');
        var Select = GetMultilingualText('Select');
        var List = GetMultilingualText('List');
        $('#lbl_LocationHeader').text(Encounter + ' ' + List);
        $('#lblSelectEncounterType').text(Select + ' ' + Encounter);

    //** Ends Here **

    switch (Number(DropVal)) {
        case 1000:
            $("#divEncounterTypeBLLList").show();
            MultilingualViewModel(450042);
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450070",
                dataTableID: "tblEncounterTypeBLLList",
                methodLoadData: LoadEncounterTypeBLLListMethod,
                //   methodOnLoadComplete: BllLoadComplete,
                serverSideProcessing: true
            });
            break;
        case 1001:
            $("#divEncounterTypeULLList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450072",
                dataTableID: "tblEncounterTypeULLList",
                methodLoadData: LoadEncounterTypeULLListMethod,
                serverSideProcessing: true
            });
            break;
        case 1002:
            $("#divAdministerImmunizationList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450077",
                dataTableID: "tblAdministerImmunizationList",
                methodLoadData: LoadAdministerImmunizationListMethod,
                serverSideProcessing: true
            });

            break;
        case 1003:
            $("#divEncounterTypeAdministerMedicationList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450081",
                dataTableID: "tblEncounterTypeAdministerMedicationList",
                methodLoadData: LoadEncounterTypeAdministerMedicationListMethod,
                serverSideProcessing: true
            });
            break;
        case 1004:
            $("#divEncounterTypeBIOList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450075",
                dataTableID: "tblEncounterTypeBIOList",
                methodLoadData: LoadEncounterTypeBIOListMethod,
                serverSideProcessing: true
            });
            break;
        case 1005:
            $("#divEncounterTypeFitTestList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450073",
                dataTableID: "tblEncounterTypeFitTestList",
                methodLoadData: LoadEncounterTypeFitTestListMethod,
                serverSideProcessing: true
            });
            break;
        case 1006:
            $("#divEncounterTypePostOfferPhysicalList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450076",
                dataTableID: "tblEncounterTypePostOfferPhysicalList",
                methodLoadData: LoadEncounterTypePostOfferPhysicalListMethod,
                serverSideProcessing: true
            });
            break;
        case 1007:
            $("#divHealthAnalysisList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450088",
                dataTableID: "tblHealthAnalysisList",
                methodLoadData: LoadHealthAnalysisListMethod,
                serverSideProcessing: true
            });
            break;
        case 1008:
            $("#divTiters").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500122",
                dataTableID: "tblTiters",
                methodLoadData: LoadTitersMethod,
                serverSideProcessing: true
            });
            break;
        case 1009:
            $("#divVitalsList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450085",
                dataTableID: "tblVitalsList",
                methodLoadData: LoadVitalsListMethod,
                serverSideProcessing: true
            });
            break;
        case 1010:
            $("#divWSList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500126",
                dataTableID: "tblWSList",
                methodLoadData: LoadWSListMethod,
                serverSideProcessing: true
            });
            break;
          
        case 1011:
            EncounterTypeID = 1011;
            $("#divEncounterTypeWorkconsultationList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450090",
                dataTableID: "tblEncounterTypeWorkconsultationList",
                methodLoadData: LoadEncounterTypeWorkconsultationListMethod,
                serverSideProcessing: true
            });
            break;
        case 1012:
            EncounterTypeID = 1012;
            $("#divEducationList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500124",
                dataTableID: "tblEducationList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1013:
            EncounterTypeID = 1013;
            $("#divSpecialConsultationList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500117",
                dataTableID: "tblSpecialConsultationList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1014:
            EncounterTypeID = 1014;
            $("#divWorkConditioningList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500123",
                dataTableID: "tblWorkConditioningList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1015:
            EncounterTypeID = 1015;
            $("#divEncounterTypeEIPList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450089",
                dataTableID: "tblEncounterTypeCommonEIPList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1016:
            EncounterTypeID = 1016;
            $("#divEncounterTypeEIPFollowUpList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500113",
                dataTableID: "tblEIPFollowUpList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1017:
            EncounterTypeID = 1017;
            $("#divEncounterTypeOthersList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500115",
                dataTableID: "tblOthersList",
                methodLoadData: LoadEncounterTypeCommonListMethod,
                serverSideProcessing: true
            });
            break;
        case 1018:
            EncounterTypeID = 1018;
            $("#divEncounterTypeEMRList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "4500120",
                dataTableID: "tblEMRList",
                methodLoadData: LoadEMRListMethod,
                serverSideProcessing: true
            });
            break;
        case 1019:
            $("#divEncounterTypeDATList").show();

            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450074",
                dataTableID: "tblEncounterTypeDATList",
                methodLoadData: LoadEncounterTypeDATListMethod,
                serverSideProcessing: true
            });
            break;
        case 1020:
            $("#divEncounterTypeAudiometricsList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450078",
                dataTableID: "tblEncounterTypeAudiometricsList",
                methodLoadData: LoadEncounterTypeAudiometricsListMethod,
                serverSideProcessing: true
            });
            break;
        case 1021:
            $("#divSpirometryList").show();
            objDataTable1 = new DataTable({
                screenID: "450042",
                gridID: "450079",
                dataTableID: "tblSpirometryList",
                methodLoadData: LoadSpirometryListMethod,
                serverSideProcessing: true
            });
            break;
        default:
            break;
    }
    $(function () { /* Set Language to Date Picker */
        var selectedLanguage = GetLanguage();
        if (selectedLanguage == 'English') $.datepicker.setDefaults($.datepicker.regional['']);
        else $.datepicker.setDefaults($.datepicker.regional[selectedLanguage]);
    });


    function LoadEncounterTypeBLLListMethod() {
        var EncounterTypeBLLListMethodDetails = [];

        var viewID = parseInt($("#spntblEncounterTypeBLLListSelectedView").attr('data-viewid'));
        var viewName = $("#spntblEncounterTypeBLLListSelectedView").text();

        if (viewName == 'Print Employee Notification Letter')
            $("#spPrintNotificationGrid").show();
        else {
            $("#spPrintNotificationGrid").hide();
        }

        EncounterTypeBLLListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.BLLService/SelectEncounterTypeBLLListSOA" });
        EncounterTypeBLLListMethodDetails.push({ "name": "methodParam1", "value": viewID });
        return EncounterTypeBLLListMethodDetails;
    }

    function LoadEncounterTypeULLListMethod() {
        var EncounterTypeULLListMethodDetails = [];

        var viewID = parseInt($("#spntblEncounterTypeULLListSelectedView").attr('data-viewid'));
        EncounterTypeULLListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.ULLService/SelectEncounterTypeULLListSOA" });
        EncounterTypeULLListMethodDetails.push({ "name": "methodParam1", "value": viewID });
        return EncounterTypeULLListMethodDetails;
    }
    function LoadEncounterTypeFitTestListMethod() {
        var EncounterTypeFitTestListMethodDetails = [];
        EncounterTypeFitTestListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.FitTestService/SelectEncounterTypeFitTestListSOA" });
        return EncounterTypeFitTestListMethodDetails;
    }
    function LoadEncounterTypePostOfferPhysicalListMethod() {
        var EncounterTypePostOfferPhysicalListMethodDetails = [];
        EncounterTypePostOfferPhysicalListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.POPService/SelectEncounterTypePostOfferPhysicalListSOA" });
        return EncounterTypePostOfferPhysicalListMethodDetails;
    }

    function LoadHealthAnalysisListMethod() {
        var EncounterTypeHealthAnalysisListMethodDetails = [];
        EncounterTypeHealthAnalysisListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.HealthAnalysisDetailService/SelectEncounterTypeHealthAnalysisSOA" });
        return EncounterTypeHealthAnalysisListMethodDetails;
    }


    function LoadEncounterTypeDATListMethod() {
        var EncounterTypeDATListMethodDetails = [];
        EncounterTypeDATListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.DATService/SelectEncounterTypeDATListSOA" });
        return EncounterTypeDATListMethodDetails;
    }
    function LoadEncounterTypeCommonListMethod() {
        var EncounterTypeDATListMethodDetails = [];
        EncounterTypeDATListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.CommonEncounterTypesService/SelectEncounterTypeCommonListSOA" });
        EncounterTypeDATListMethodDetails.push({ "name": "methodParam1", "value": EncounterTypeID });

        return EncounterTypeDATListMethodDetails;
    }
    //    function LoadEncounterTypeOthersListMethod() {
    //        var EncounterTypeDATListMethodDetails = [];
    //        EncounterTypeDATListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.CommonEncounterTypesService/SelectEncounterTypeCommonListSOA" });
    //        EncounterTypeDATListMethodDetails.push({ "name": "methodParam1", "value": EncounterTypeID });

    //        return EncounterTypeDATListMethodDetails;
    //    }
    function LoadEncounterTypeWorkconsultationListMethod() {
        var EncounterTypeDATListMethodDetails = [];
        EncounterTypeDATListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.CommonEncounterTypesService/SelectEncounterTypeCommonListSOA" });
        EncounterTypeDATListMethodDetails.push({ "name": "methodParam1", "value": EncounterTypeID });
        return EncounterTypeDATListMethodDetails;
    }


    function LoadEncounterTypeBIOListMethod() {
        var EncounterTypeBIOListMethodDetails = [];
        EncounterTypeBIOListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.BiometricsService/SelectEncounterTypeBIOListSOA" });
        return EncounterTypeBIOListMethodDetails;
    }
    function LoadEncounterTypeAudiometricsListMethod() {
        var EncounterTypeAudiometricsListMethodDetails = [];
        EncounterTypeAudiometricsListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.AudiometricService/SelectEncounterTypeAudiometricListSOA" });
        return EncounterTypeAudiometricsListMethodDetails;
    }

    function LoadAdministerImmunizationListMethod() {
        var LoadAdministerImmunizationListDetails = [];
        LoadAdministerImmunizationListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.AIService/SelectAIList" });
        return LoadAdministerImmunizationListDetails;
    }
    function LoadEncounterTypeAdministerMedicationListMethod() {
        var EncounterTypeAdministerMedicationListMethodDetails = [];
        EncounterTypeAdministerMedicationListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.AMService/SelectEncounterTypeAdministerMedicationListSOA" });
        return EncounterTypeAdministerMedicationListMethodDetails;
    }

    function LoadSpirometryListMethod() {
        var LoadSpirometryListDetails = [];
        LoadSpirometryListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.SpirometryService/SelectSpirometryList" });
        return LoadSpirometryListDetails;
    }
    function LoadVitalsListMethod() {
        var LoadVitalsListDetails = [];
        LoadVitalsListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.VitalsService/SelectVitalsList" });
        return LoadVitalsListDetails;
    }

    PrintEmployeeNotification = function () {
        var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblEncounterTypeBLLList")

        if (selectedIDArray == '') {
            var alertmsg = GetMultilingualText('PrintemployeenotificationAlert');
            alert(alertmsg);
            return;
        }

        var url = '/OccHealth/Encounters/EncounterTypes/NotificationLetter.aspx?ExposureIDs=' + selectedIDArray;
        window.open(url, 'Employee Notification Letter', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');

    };
    function LoadEMRListMethod() {
        var viewID = parseInt($("#spntblEMRListSelectedView").attr('data-viewid'));
        var LoadEMRListDetails = [];
        LoadEMRListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.EMRService/SelectEMRList" });
        LoadEMRListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadEMRListDetails;
    }

    //LoadTitersMethod

    function LoadTitersMethod() {
        var viewID = parseInt($("#spntblTitersSelectedView").attr('data-viewid'));
        var LoadTitersListDetails = [];
        LoadTitersListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.TiterService/SelectTitersList" });
        LoadTitersListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadTitersListDetails;
    }

    function LoadWSListMethod() {
        var viewID = parseInt($("#spntblWSListSelectedView").attr('data-viewid'));
        var LoadWSListDetails = [];
        LoadWSListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.WorkSimulationService/SelectWorkSimulationList" });
        LoadWSListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadWSListDetails;
    }

    $("#chkViewResult").change(function () {
        //        if ($(this).is(":checked")) {
        var chkViewResultVal = chkViewResult.checked;
        var SelectedDropVal = $('#ddlType').val();
        var url = window.location.href;
        url = url.replace("chkViewResultVal=" + chkViewResultVal + "&", "").replace("&chkViewResultVal=" + chkViewResultVal, "");
        url = url.replace("SelectedDropVal=" + SelectedDropVal + "&", "").replace("&SelectedDropVal=" + SelectedDropVal, "");
        sessionStorage.removeItem('GridSettings');
        sessionStorage.removeItem('ViewID');
        url = url + "&chkViewResultVal=" + chkViewResultVal;
        window.location.href = url + "&SelectedDropVal=" + SelectedDropVal;


        //        }
        //        else if ($(this).not(":checked")) {
        //            var chkViewResultVal = chkViewResult.checked;
        //            var url = window.location.href;
        //            url = url.replace("chkViewResultVal=" + chkViewResultVal + "&", "").replace("&chkViewResultVal=" + chkViewResultVal, "");
        //            sessionStorage.removeItem('GridSettings');
        //            sessionStorage.removeItem('ViewID');
        //            window.location.href = url + "&chkViewResultVal=" + chkViewResultVal;
        //        }
    });

    function LoadEMRListMethod() {
        var viewID = parseInt($("#spntblEMRListSelectedView").attr('data-viewid'));
        var LoadEMRListDetails = [];
        LoadEMRListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.EMRService/SelectEMRList" });
        LoadEMRListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadEMRListDetails;
    }
    
    function LoadTitersMethod() {
        var viewID = parseInt($("#spntblTitersSelectedView").attr('data-viewid'));
        var LoadTitersListDetails = [];
        LoadTitersListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.TiterService/SelectTitersList" });
        LoadTitersListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadTitersListDetails;
    }

    function LoadWSListMethod() {
        var viewID = parseInt($("#spntblWSListSelectedView").attr('data-viewid'));
        var LoadWSListDetails = [];
        LoadWSListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.EncounterTypes.WorkSimulationService/SelectWorkSimulationList" });
        LoadWSListDetails.push({ "name": "methodParam1", "value": viewID });
        return LoadWSListDetails;
    }


    $("#ddlType").change(function () {
        var NewDropVal = $('#ddlType').val();
        var url = window.location.href;
        url = url.replace("DropVal=" + DropVal + "&", "").replace("&DropVal=" + DropVal, "");
        sessionStorage.removeItem('GridSettings');
        sessionStorage.removeItem('ViewID');
        window.location.href = url + "&DropVal=" + NewDropVal;
    });

    //    function BllLoadComplete() {
    //        var innerHTML = "";
    //        var t = $("table[id*='List']")
    //        innerHTML = innerHTML.replace("Privacy Information", "<span style='color: red;font-weight:bold;'>Privacy Information </span>");
    //        for (var i = 0; i < t.length; i++) {
    //            innerHTML = t[i].innerHTML.replace(/Privacy Information/g, "<span style='color: red;font-weight:bold;'>Privacy Information </span>");
    //            t[i].innerHTML = innerHTML;
    //        }

    //    }


});
;
