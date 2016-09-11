$(document).ready(function () {
    var objDataTable1;
    MultilingualViewModel(450054);
    objDataTable1 = new DataTable({
        screenID: "450054",                              // Set screen ID for datatable to load multillingual.
        gridID: "450087",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblQueuedSamplesList",                  // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
        showViewManager: false,
        showViewFilterTooltip: false,
        //methodLoadData: LoadLabSummaryData,         // Set Callback method for dataTable library to load data
        methodLoadData: QueuedSamplesListMethod,
        serverSideProcessing: true
    });

    function QueuedSamplesListMethod() {
        var QueuedSamplesListDetails = [];
        QueuedSamplesListDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.OccHealthService/SelectQueuedSamplesList" });
        return QueuedSamplesListDetails;
    }

    var Instructions = GetMultilingualText('Instructions');
    var Manual = GetMultilingualText('Manual');
    $('#spninstManual').text(Instructions + ' ' + Manual);

});
