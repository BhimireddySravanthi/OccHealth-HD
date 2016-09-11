$(document).ready(function () {
    var objDataTable1;
    objDataTable1 = new DataTable({
        screenID: "450054",                              // Set screen ID for datatable to load multillingual.
        gridID: "450054",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblManageLabFeed",                  // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
        showViewManager: false,
        showViewFilterTooltip: false,
        //methodLoadData: LoadLabSummaryData,         // Set Callback method for dataTable library to load data
        methodLoadData: LoadLabSummaryMethod,
        serverSideProcessing: true
    });

    function LoadLabSummaryMethod() {
        var LabSummaryMethodDetails = [];
        LabSummaryMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.OccHealthService/SelectLabSummary" });
        return LabSummaryMethodDetails;
    }
});
