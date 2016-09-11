$(document).ready(function () {
    var objDataTable1; 
    var deleteStatus = "";
    objDataTable1 = new DataTable({
        screenID: "450010",                              // Set screen ID for datatable to load multillingual.
        gridID: "450010",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblRestrictionsList",                 // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.     
        //methodLoadData: LoadRestrictionData,         // Set Callback method for dataTable library to load data
        methodLoadData: LoadRestrictionMethod,
        methodOnLoadComplete: LoadComplete,
        serverSideProcessing: true
    });

    function LoadComplete() {
        if (deleteStatus == "Success") {
            pmapAlert("The selected record(s) has been deleted successfully", "Success");
        }
        else if (deleteStatus == "Failure") {
            pmapAlert("Unable to delete selected records", "Failure");
        }
        deleteStatus = "";

//        var innerHTML = $("#tblRestrictionsList").html();
//        innerHTML = innerHTML.split(">false</td>").join(">No</td>");
//        innerHTML = innerHTML.split(">true</td>").join(">Yes</td>");
//        $("#tblRestrictionsList").html(innerHTML);
    }

    function LoadRestrictionMethod() {
        var RestrictionMethodDetails = [];
        RestrictionMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Restrictions.RestrictionsService/GetRestrictionList" });
        return RestrictionMethodDetails;
    }

    $("#btnAdd").on("click", function () {
        var url = '../../../OccHealth/Ristrictions/RestrictionBase.html?fromscreen=RestrictionDetails&RestrictionID=0#/RestrictionDetails';
        DisplayModalPopup('Large', url, false);
    });

    $("#btnDelete").on("click", function () {
        var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblRestrictionsList");

        if (selectedIDArray == '') {
            alert("Please Select atleast one record to delete");
            return;
        }

        pmapConfirm("You are about to delete Restriction record(s). Continue?", DeleteDocokfun, DeleteDocCancelfun);

        function DeleteDocokfun() {
            CloseModalPopup();


            //SelectIDArray contains list of incident IDs to delete. Need to make call to webservice to delete those incidents.
            $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/Restrictions/RestrictionsService.asmx/DeleteRestriction",
                        data: "{RestrictionIDs:'" + selectedIDArray + "'}",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblRestrictionsList");
                            deleteStatus = data.d.toString();
                        }
                    });
        }

        function DeleteDocCancelfun() {
            $('input:checkbox').removeAttr('checked');
            // alert('delete');
        }
    });
});
