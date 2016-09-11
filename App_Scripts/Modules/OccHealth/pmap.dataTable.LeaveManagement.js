$(document).ready(function () {
    var LocationId = getURLParameter("LocationId") != "null" ? getURLParameter("LocationId") : "0";
    var GridID;

    var deleteStatus = "";

    var objDataTable1;
    $("#divLeaveManagementList").show();
    objDataTable1 = new DataTable({
        screenID: "450078",                              // Set screen ID for datatable to load multillingual.
        gridID: "450084",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblLeaveManagement",            // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
//        showViewManager: false,
//        showViewFilterTooltip: false,
        //methodLoadData: LoadLeaveListMethod,        // Set Callback method for dataTable library to load data
        methodLoadData: LoadLeaveListMethod,
        methodOnLoadComplete: LoadComplete,
        serverSideProcessing: true
    });
    GridID = "450084";



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
        LeaveListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.LeaveManagement.LeaveManagementService/SelectLeaveManagmentList" });
        return LeaveListMethodDetails;
    }

    $("#btnAdd").on("click", function () {
        var GridIDforDelete = objDataTable1.gridID;
        DisplayModalPopup('Large', 'LeaveMgmtBase.html?fromscreen=LeaveDetails&LeaveDetailID=0&EmployeePK=0&LocationId=' + LocationId + '&Location_Id=' + LocationId, false);

    });

    $("#btnDelete").on("click", function () {

        var GridIDforDelete = objDataTable1.gridID;

        if (GridIDforDelete == "450084") {
            var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblLeaveManagement");
            if (selectedIDArray == '') {
                alert("Please Select atleast one record to delete");
                return;
            }
            pmapConfirm("You are about to delete Leave record(s). Continue?", DeleteDocVaccokfun, DeleteDocVaccCancelfun);

            function DeleteDocVaccokfun() {
                CloseModalPopup();
                //SelectIDArray contains list of incident IDs to delete. Need to make call to webservice to delete those incidents.
                $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/LeaveManagement/LeaveManagementService.asmx/DeleteLeave",
                        data: "{IDs:'" + selectedIDArray + "',LocationId:'" + LocationId + "' }",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblManageLeaveList");
                            deleteStatus = data.d.Object.Status;
                        }
                    });
            }

            function DeleteDocVaccCancelfun() {
                $('input:checkbox').removeAttr('checked');
            }
        }
    });
});