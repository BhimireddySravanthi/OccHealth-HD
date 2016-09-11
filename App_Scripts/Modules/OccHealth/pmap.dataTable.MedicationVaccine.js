$(document).ready(function () {
    var ScreenName = getURLParameter("ScreenName") != "null" ? getURLParameter("ScreenName") : "0";
    var LocationId = getURLParameter("LocationId") != "null" ? getURLParameter("LocationId") : "0";
    var GridID;

    if (ScreenName == "Vaccine") {
        $('#lbl_Header').text("Vaccine List");
       
    }
    else if (ScreenName == "Medication") {
        $('#lbl_Header').text("Medication List");
    }

    else if (ScreenName == "Supply") {
        $('#lbl_Header').text("Supply List");
    }

    var deleteStatus = "";

    var objDataTable1;
    if (ScreenName == "Vaccine") {
        $("#divVaccineList").show();
        objDataTable1 = new DataTable({
            screenID: "450047",                              // Set screen ID for datatable to load multillingual.
            gridID: "450082",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
            dataTableID: "tblManageVaccineList",            // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
            showViewManager: false,
            showViewFilterTooltip: false,
            //methodLoadData: LoadVaccineListMethod,        // Set Callback method for dataTable library to load data
            methodLoadData: LoadVaccineListMethod,
            methodOnLoadComplete: LoadComplete,
            serverSideProcessing: true
        });
        GridID = "450082";
    }
    else if (ScreenName == "Medication") {
        $("#divMedicationList").show();
        objDataTable1 = new DataTable({
            screenID: "450047",                              // Set screen ID for datatable to load multillingual.
            gridID: "450083",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
            dataTableID: "tblManageMedicationList",
            showViewManager: false,
            showViewFilterTooltip: false,               // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
            //methodLoadData: LoadMedicationListMethod,         // Set Callback method for dataTable library to load data
            methodLoadData: LoadMedicationListMethod,
            methodOnLoadComplete: LoadComplete,
            serverSideProcessing: true
        });
        GridID = "450083";
    }

    else if (ScreenName == "Supply") {
        $("#divSupplyList").show();
        objDataTable1 = new DataTable({
            screenID: "450047",                              // Set screen ID for datatable to load multillingual.
            gridID: "450086",                               // Set Grid ID which has been created in SQL Table 'Controls' for this grid  to apply grid & view settings
            dataTableID: "tblManageSupplyList",
            showViewManager: false,
            showViewFilterTooltip: false,               // Set HTML ID of table element specified in aspx file which will be loaded with dataTable.
            //methodLoadData: LoadMedicationListMethod,         // Set Callback method for dataTable library to load data
            methodLoadData: LoadSupplyListMethod,
            methodOnLoadComplete: LoadComplete,
            serverSideProcessing: true
        });
        GridID = "450086";
    }

    function LoadComplete() {
        var i;
        var VaccineScopeIDs = [];
        var storeHTML;
        if (deleteStatus == "Success") {
            pmapAlert("The selected record(s) has been deleted successfully", "Success");
        }
        else if (deleteStatus == "Failure") {
            pmapAlert("Unable to delete selected records", "Failure");
        }
        deleteStatus = "";
    }

    function LoadVaccineListMethod() {
        var VaccineListMethodDetails = [];
        VaccineListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Inventory.MedicationVaccineService/SelectMedicationtVaccineListSOA" });
        VaccineListMethodDetails.push({ "name": "methodParam1", "value": GridID });
        return VaccineListMethodDetails;
    }
    function LoadSupplyListMethod() {
        var SupplyListMethodDetails = [];
        SupplyListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Inventory.MedicationVaccineService/SelectSupplyListSOA" });
        SupplyListMethodDetails.push({ "name": "methodParam1", "value": GridID });
        return SupplyListMethodDetails;
    }

    function LoadMedicationListMethod() {
        var MedicationListMethodDetails = [];
        MedicationListMethodDetails.push({ "name": "webService", "value": "ProcessMAP.WebServices.OccupationalHealth.Inventory.MedicationVaccineService/SelectMedicationtVaccineListSOA" });
        MedicationListMethodDetails.push({ "name": "methodParam1", "value": GridID });
        return MedicationListMethodDetails;
    }

    $("#btnAdd").on("click", function () {
        var GridIDforDelete = objDataTable1.gridID;
        if (GridIDforDelete == "450082") {
            DisplayModalPopup('Large', 'InventoryTypeBase.html?fromscreen=Vaccine&InventoryDetailID=0&InventoryTypeID=1003&LocationId=' + LocationId + '&Location_Id=' + LocationId, false);
            }
        else if (GridIDforDelete == "450083") {
            DisplayModalPopup('Large', 'InventoryTypeBase.html?fromscreen=Medication&InventoryDetailID=0&InventoryTypeID=1001&LocationId=' + LocationId + '&Location_Id=' + LocationId, false);
        }

        else if (GridIDforDelete == "450086") {
            DisplayModalPopup('Large', 'InventoryTypeBase.html?fromscreen=Supply&InventoryDetailID=0&InventoryTypeID=1002&LocationId=' + LocationId + '&Location_Id=' + LocationId, false);
        }
    });

    $("#btnDelete").on("click", function () {

        var GridIDforDelete = objDataTable1.gridID;

        if (GridIDforDelete == "450082") {
            var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblManageVaccineList");
            if (selectedIDArray == '') {
                alert("Please Select atleast one record to delete");
                return;
            }
            pmapConfirm("You are about to delete Vaccine record(s). Continue?", DeleteDocVaccokfun, DeleteDocVaccCancelfun);

            function DeleteDocVaccokfun() {
                CloseModalPopup();
                //SelectIDArray contains list of incident IDs to delete. Need to make call to webservice to delete those incidents.
                $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/DeleteVaccine",
                        data: "{VaccineIDs:'" + selectedIDArray + "',LocationId:'" + LocationId + "' }",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblManageVaccineList");
                            deleteStatus = data.d.Object.Status;
                            //pmapAlert("The selected record(s) has been deleted successfully", "Success");
                            //alertSuccess("The selected record(s) has been deleted successfully.");
                        }
                    });
            }

            function DeleteDocVaccCancelfun() {
                $('input:checkbox').removeAttr('checked');
                // alert('delete');
            }
        }
        if (GridIDforDelete == "450086") {
            var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblManageSupplyList");
            if (selectedIDArray == '') {
                alert("Please Select atleast one record to delete");
                return;
            }
            pmapConfirm("You are about to delete Supply record(s). Continue?", DeleteDocSupplyokfun, DeleteDocSupplyCancelfun);

            function DeleteDocSupplyokfun() {
                CloseModalPopup();
                //SelectIDArray contains list of incident IDs to delete. Need to make call to webservice to delete those incidents.
                $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/DeleteSupply",
                        data: "{SupplyIDs:'" + selectedIDArray + "',LocationId:'" + LocationId + "' }",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblManageSupplyList");
                            deleteStatus = data.d.Object.Status;
                            //pmapAlert("The selected record(s) has been deleted successfully", "Success");
                            //alertSuccess("The selected record(s) has been deleted successfully.");
                        }
                    });
            }

            function DeleteDocSupplyCancelfun() {
                $('input:checkbox').removeAttr('checked');
                // alert('delete');
            }
        }

        if (GridIDforDelete == "450083") {
            var selectedIDArray = objDataTable1.GetSelectedRowIDs("tblManageMedicationList");
            if (selectedIDArray == '') {
                alert("Please Select atleast one record to delete");
                return;
            }
            pmapConfirm("You are about to delete Medication record(s). Continue?", DeleteDocMedokfun, DeleteDocMedCancelfun);

            function DeleteDocMedokfun() {
                CloseModalPopup();
                //SelectIDArray contains list of incident IDs to delete. Need to make call to webservice to delete those incidents.
                $.ajax
                    ({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/DeleteMedication",
                        data: "{MedicationIDs:'" + selectedIDArray + "',LocationId:'" + LocationId + "' }",
                        success: function (data) {
                            objDataTable1.DeselectAllRows(selectedIDArray.join());
                            objDataTable1.RefreshDataTable("tblManageMedicationList");
                            deleteStatus = data.d.Object.Status;
                            //pmapAlert("The selected record(s) has been deleted successfully", "Success");
                            //alertSuccess("The selected record(s) has been deleted successfully.");
                        }
                    });
            }

            function DeleteDocMedCancelfun() {
                $('input:checkbox').removeAttr('checked');
                // alert('delete');
            }
        }
    });

});