$(document).ready(function () {


    var LocationId = getURLParameter("LocationId") != "null" ? getURLParameter("LocationId") : "0";
    var LevelId = getURLParameter("LevelId") != "null" ? getURLParameter("LevelId") : "0";
    var deleteStatus = "";
    var objDataTable1;
    objDataTable1 = new DataTable({

        screenID: "450040",
        gridID: "450071",
        dataTableID: "tblAppointmentList",
        methodLoadData: LoadAppointmentListMethod,
        serverSideProcessing: true
    });


    $(function () { /* Set Language to Date Picker */
        var selectedLanguage = GetLanguage();
        if (selectedLanguage == 'English') $.datepicker.setDefaults($.datepicker.regional['']);
        else $.datepicker.setDefaults($.datepicker.regional[selectedLanguage]);
    });
    function LoadAppointmentListMethod() {
        var AppointmentListMethodDetails = [];
        AppointmentListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Appointments.AppointmentService/SelectAppointmentListSOA" });
        AppointmentListMethodDetails.push({ "name": "methodParam1", "value": LocationId });
        AppointmentListMethodDetails.push({ "name": "methodParam2", "value": LevelId });
        return AppointmentListMethodDetails;
    }

});
