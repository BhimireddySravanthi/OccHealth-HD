$(document).ready(function () {
    var LocationId = getURLParameter("LocationId") != "null" ? getURLParameter("LocationId") : "0";
    var GridID;

    var deleteStatus = "";

    var objDataTable1;
    $("#divBLLMonthlyResults").show();
    objDataTable1 = new DataTable({
        screenID: "450045",                              // Set screen ID for datatable to load multillingual.
        gridID: "4500116",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblBLLMonthlyResults",            // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
//        showViewManager: false,
//        showViewFilterTooltip: false,
        //methodLoadData: LoadLeaveListMethod,        // Set Callback method for dataTable library to load data
        methodLoadData: LoadLeaveListMethod,
        methodOnLoadComplete: LoadComplete,
        serverSideProcessing: true
    });
    GridID = "4500116";



    function LoadComplete() {
        var i;
        var LeaveScopeIDs = [];
        var storeHTML;
        if (deleteStatus == "Success") {
            pmapAlert("The selected record(s) has been deleted successfully", "Success");
        }
        else if (deleteStatus == "Failure") {
            pmapAlert("Unable to delete selected records", "Failure");
        }
        deleteStatus = "";
    }

    function LoadLeaveListMethod() {
        var LeaveListMethodDetails = [];
        LeaveListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.OccHealthService/BLLMonthlyResultsBaseList" });
        return LeaveListMethodDetails;
    }

  

   
});