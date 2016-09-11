
$(document).ready(function () {
    var deleteStatus = "";

    var objDataTable1 = new DataTable({
        screenID: "450040",                             // Set screen ID for datatable to load multillingual.
        gridID: "450080",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
        dataTableID: "tblEquipmentList",                       // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
        showViewManager: false,
        showViewFilterTooltip: false,
        methodLoadData: GetEquipmentList,
        methodOnLoadComplete: LoadComplete,
        serverSideProcessing: true
    });



    function LoadComplete() {

        if (deleteStatus == "Success") {
            DisplayMessage("Success", GetMultilingualText("deletesuccess"));
        }

        else if (deleteStatus == "Failure") {
            DisplayMessage("Failure", GetMultilingualText("deleteFailure"));
        }

        else if (deleteStatus == "InUse") {
            DisplayMessage("Failure", GetMultilingualText("InuseEquipment"));
        }
        deleteStatus = "";
    }

    function GetEquipmentList() {
        var EquipmentList = [];
        EquipmentList.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Inventory.EquipmentService/SelectEquipmentList" });
        return EquipmentList;
    };


    $("#btnAdd").on("click", function () {
        var url = '/../../../../../OccHealth/Inventory/InventoryTypeBase.html?fromscreen=Equipment&EquipmentDetailID=0&LocationId=' + getURLParameter("LocationId") + '&Location_Id=' + getURLParameter("LocationId");
        DisplayModalPopup('Large', url, false);
    });

    $("#btnDelete").on("click", function () {
        var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblEquipmentList");

        if (selectedIDArray == '') {
            alert("Please Select atleast one record to delete");
            return;
        }

        pmapConfirm("You are about to delete equipment record(s). Continue?", DeleteDocokfun, DeleteDocCancelfun);

        function DeleteDocokfun() {
            CloseModalPopup();
            $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/Inventory/EquipmentService.asmx/DeleteEquipment",
                        data: "{EquipmentIDs:'" + selectedIDArray + "' }",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblEquipmentList");
                            deleteStatus = data.d.Object.Status.toString();
                        }
                    });
        }

        function DeleteDocCancelfun() {
            $('input:checkbox').removeAttr('checked');
        }
    });


});