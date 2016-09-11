
angular.module("app")
        .controller("medicationCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.ScreenID = "450047";
             $scope.medicationvaccine = {
                 InventoryDetailID: 0
                 , InventoryTypeID: ""
                 , StockStatus: ""
                 , BulkOrder: ""
                 , DateReceived: null
                 , TimeReceived: ""
                 , BrandDetailID: ""
                 , DrugDetailID: ""
                 , SupplierDetailID: ""
                 , LotNumber: ""
                 , ReceivedBy: ""
                 , InventoryID: ""
                 , ManufacturerDetailID: ""
                 , LotNumber: ""
                 , ExpirationDate: ""
                 , MedicineForm: ""
                 , Strength: ""

                 , NumberOfContainer: ""  //Medication
                 , NumberOfPack: ""      //Vaccine

                 , QuantityPerContainer: "" //Medication
                 , QuantityPerPack: ""      //Vaccine

                 , ContainerQuantity: ""
                 , PackQuantity: ""

                 , DosePerVial: ""
                 , DosePerMedication: ""

                 , DosageMedication: ""
                 , DosageVial: ""

                 , MedicationCurrentDosage: ""
                 , VialCurrentDosage: ""

                 , StorageLocation: ""
                 , TimeRestored: ""
                 , WasRecalled: false
                 , RecallDate: ""
                 , RecallReason: ""

                 , DosePerMedicationUnitOfMeasurementID: ""
                 , DosePerVialUnitOfMeasurementID: ""

                 , DosageMedicationUnitOfMeasurementID: ""
                 , DosageVialUnitOfMeasurementID: ""

                 , MedicationCurrentDosageUnitOfMeasurementID: ""
                 , VialCurrentDosageUnitOfMeasurementID: ""

                 , Vaccine: ""
                 , VaccineTypeID: ""
                 , VaccineUsageID: ""
                 , OrderBy: ""
                 , PricePerUnit: ""
                , ItemNameID: ""
                , ItemNumber: ""
                , NumberOfSupplyContainer: ""
                , NoOfUnitsPerContainer: ""
                , PricePerSupplyUnit: ""
                , TotalQuantityOfUnits: ""

             };
             $scope.isEditableM = false;
             $scope.isEditableV = false;
             $scope.UserList = [];
             $scope.ManufactureDetailList = [];
             $scope.VaccineTypeList = [];
             $scope.BrandDetailList = [];
             $scope.DrugDetailList = [];
             $scope.SupplierDetailList = [];
             $scope.MedicineFormList = [];
             $scope.VaccineUsageList = [];
             $scope.UnitOfMeasurementList = [];
             $scope.UnitOfMeasurementList1 = [];
             $scope.SupplyItemList = [];
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.myDate = new Date();

             $scope.hourStep = sharedservices.hourStep;
             $scope.minuteStep = sharedservices.minuteStep;
             var date = new Date();
             var timeNow = date.getHours() + ":" + date.getMinutes()

             $scope.Hour = timeNow.split(':')[0];
             $scope.Minut = timeNow.split(':')[1];
             date.setHours($scope.Hour);
             date.setMinutes($scope.Minut);

             $scope.DrawTimet = date;
             $scope.DrawTimet1 = date;

             $scope.showHideAddLookup = utilityservices.GetCustomKeyValue('45', 'AddOcchealthLookup');
             globalobject.fromScreen = 'Medication'
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.checkNum = function (itemID) {

                 var value_1 = Number($('#' + itemID).val());
                 if ((isNaN(value_1)) || value_1 < 0) {
                     $('#' + itemID).val('');
                     $('#' + itemID).focus();
                     utilityservices.notify("numbers");
                 }


             };
             $scope.keyPress = function (e) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     utilityservices.notify("decimal");
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
             };
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.SetMedicationRangeType = function () {
                 if ($scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID != null && $scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID != "") {
                     $scope.medicationvaccine.DosageMedicationUnitOfMeasurementID = $scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID;
                     $scope.medicationvaccine.MedicationCurrentDosageUnitOfMeasurementID = $scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID;
                 }
             };


             ////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.SetVialRangeType = function () {
                 if ($scope.medicationvaccine.DosePerVialUnitOfMeasurementID != null && $scope.medicationvaccine.DosePerVialUnitOfMeasurementID != "") {
                     $scope.medicationvaccine.DosageVialUnitOfMeasurementID = $scope.medicationvaccine.DosePerVialUnitOfMeasurementID;
                     $scope.medicationvaccine.VialCurrentDosageUnitOfMeasurementID = $scope.medicationvaccine.DosePerVialUnitOfMeasurementID;
                 }
             };

             $scope.AddNewBrand = function () {
                 restoreValues();
                 $location.path("/BrandName");
             }

             $scope.AddNewDrug = function () {
                 restoreValues();
                 $location.path("/DrugName");
             }
             $scope.AddNewVaccineType = function () {
                 restoreValues();
                 $location.path("/VaccineType");
             }
             $scope.AddNewManufacturer = function () {
                 restoreValues();
                 $location.path("/Manufacturer");
             }
             $scope.AddNewItemName = function () {
                 restoreValues();
                 $location.path("/ItemName");
             }
             function restoreValues() {
                 globalobject.medicationvaccine = $scope.medicationvaccine;
                 globalobject.medicationvaccine.TimeReceived = $('#hdnTime').val();
                 globalobject.medicationvaccine.TimeRestored = $('#hdnTime1').val();
                 globalobject.medicationvaccine.DateReceived = $scope.DateReceived;
                 globalobject.medicationvaccine.ExpirationDate = $scope.ExpirationDate;
             }
             $scope.addSupplier = function () {

                 restoreValues();
                 $location.path("/SupplierDetail");
             }

             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.cancelmedication = function () {

                 if ($scope.frmmedication.$dirty) {
                     var modalInstance = $modal.open({
                         animation: $scope.animationsEnabled,
                         templateUrl: '/OccHealth/modals/confirmation-modal.html',
                         controller: 'CancelModalCtrl',
                         size: 'sm',
                         scope: $scope
                     });
                 }
                 else {

                     sharedservices.reloadParent();

                 }
             }
             if ($scope.medicationvaccine.RecallDate == 'Thu Jan 01 1970') { $scope.medicationvaccine.RecallDate = null; }
             if ($scope.medicationvaccine.ExpirationDate == 'Thu Jan 01 1970') { $scope.medicationvaccine.ExpirationDate = null; }
             if ($scope.medicationvaccine.DateReceived == 'Thu Jan 01 1970') { $scope.medicationvaccine.DateReceived = null; }
             $scope.loadingAction = false;
             //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.saveMedication = function () {
                 var saveStatus = true;
                 var msg = '';
                 $scope.showLoadingOverlay = true;
                 $scope.medicationvaccine.DateReceived = new Date($scope.DateReceived).toDateString();
                 $scope.medicationvaccine.RecallDate = new Date($scope.RecallDate).toDateString();
                 $scope.medicationvaccine.ExpirationDate = new Date($scope.ExpirationDate).toDateString();
                 $scope.medicationvaccine.TimeReceived = $('#hdnTime').val();
                 $scope.medicationvaccine.TimeRestored = $('#hdnTime1').val();

                 $scope.medicationvaccine.PackQuantity = $('#Numberofvialsreceived').val();
                 $scope.medicationvaccine.ContainerQuantity = $('#Volume').val();

                 $scope.medicationvaccine.DosageMedication = $('#DosageMedication').val();
                 $scope.medicationvaccine.DosageVial = $('#Dosage').val();

                 $scope.medicationvaccine.MedicationCurrentDosage = $('#MedicationCurrentDosage').val();
                 $scope.medicationvaccine.VialCurrentDosage = $('#CurrentDosage').val();
                 $scope.medicationvaccine.TotalQuantityOfUnits = $('#TotalQuantityOfUnits').val();

                 if ($scope.medicationvaccine.RecallDate == 'Thu Jan 01 1970') { $scope.medicationvaccine.RecallDate = null; }
                 if ($scope.medicationvaccine.ExpirationDate == 'Thu Jan 01 1970') { $scope.medicationvaccine.ExpirationDate = null; }
                 if ($scope.medicationvaccine.DateReceived == 'Thu Jan 01 1970') { $scope.medicationvaccine.DateReceived = null; }


                 if ($scope.medicationvaccine.WasRecalled == false) { $scope.medicationvaccine.RecallDate = null; $scope.medicationvaccine.RecallReason = ''; $scope.RecallDate = null; }
                 if ($scope.medicationvaccine.RecallDate == 'Thu Jan 01 1970') { $scope.medicationvaccine.RecallDate = null; }



                 if ($scope.medicationvaccine.StockStatus === ''
                    || $scope.medicationvaccine.StockStatus === null
                    || $scope.medicationvaccine.BulkOrder === ''
                    || $scope.medicationvaccine.BulkOrder === null
                    || $scope.medicationvaccine.DateReceived == ''
                    || $scope.medicationvaccine.DateReceived == null
                    || $scope.medicationvaccine.InventoryID == ''
                    || $scope.medicationvaccine.InventoryID == null
                    || $scope.medicationvaccine.ReceivedBy == ''
                    || $scope.medicationvaccine.ReceivedBy == null
                    || $scope.medicationvaccine.SupplierDetailID == ''
                    || $scope.medicationvaccine.SupplierDetailID == null
                    || $scope.medicationvaccine.ManufacturerDetailID == ''
                  || $scope.medicationvaccine.ManufacturerDetailID == null
                   || ($scope.medicationvaccine.InventoryTypeID != 1002 && (
                     $scope.medicationvaccine.LotNumber == ''
                    || $scope.medicationvaccine.LotNumber == null))
                    || $scope.medicationvaccine.ExpirationDate == ''
                    || $scope.medicationvaccine.ExpirationDate == null

                    || ($scope.medicationvaccine.InventoryTypeID == 1001
                    &&
                        ($scope.medicationvaccine.NumberOfContainer == '' || $scope.medicationvaccine.NumberOfContainer == null
                     || $scope.medicationvaccine.QuantityPerContainer == '' || $scope.medicationvaccine.QuantityPerContainer == null
                     || $scope.medicationvaccine.DosePerMedication == '' || $scope.medicationvaccine.DosePerMedication == null
                     || $scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID == '' || $scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID == null
                     || $scope.medicationvaccine.MedicationCurrentDosage == '' || $scope.medicationvaccine.MedicationCurrentDosage == null
                     || $scope.medicationvaccine.MedicationCurrentDosageUnitOfMeasurementID == '' || $scope.medicationvaccine.MedicationCurrentDosageUnitOfMeasurementID == null
                     || $scope.medicationvaccine.BrandDetailID == ''
                     || $scope.medicationvaccine.BrandDetailID == null
                     || $scope.medicationvaccine.DrugDetailID == ''
                     || $scope.medicationvaccine.DrugDetailID == null
                     || $scope.medicationvaccine.MedicineForm == ''
                     || $scope.medicationvaccine.MedicineForm == null))

                     || ($scope.medicationvaccine.InventoryTypeID == 1003
                    &&
                         ($scope.medicationvaccine.NumberOfPack == '' || $scope.medicationvaccine.NumberOfPack == null
                     || $scope.medicationvaccine.QuantityPerPack == '' || $scope.medicationvaccine.QuantityPerPack == null
                     || $scope.medicationvaccine.DosePerVial == '' || $scope.medicationvaccine.DosePerVial == null
                     || $scope.medicationvaccine.DosePerVialUnitOfMeasurementID == '' || $scope.medicationvaccine.DosePerVialUnitOfMeasurementID == null
                     || $scope.medicationvaccine.VialCurrentDosage == '' || $scope.medicationvaccine.VialCurrentDosage == null
                     || $scope.medicationvaccine.VialCurrentDosageUnitOfMeasurementID == '' || $scope.medicationvaccine.VialCurrentDosageUnitOfMeasurementID == null
                     || $scope.medicationvaccine.OrderBy == ''
                     || $scope.medicationvaccine.OrderBy == null
                     || $scope.medicationvaccine.VaccineUsageID == ''
                     || $scope.medicationvaccine.VaccineUsageID == null
                     || $scope.medicationvaccine.VaccineTypeID == ''
                     || $scope.medicationvaccine.VaccineTypeID == null
                     || $scope.medicationvaccine.Vaccine == ''
                     || $scope.medicationvaccine.Vaccine == null))
                       || ($scope.medicationvaccine.InventoryTypeID == 1002
                    &&
                                          ($scope.medicationvaccine.ItemNameID == '' || $scope.medicationvaccine.ItemNameID == null
                     || $scope.medicationvaccine.ItemNumber == '' || $scope.medicationvaccine.ItemNumber == null
                     || $scope.medicationvaccine.NumberOfSupplyContainer == '' || $scope.medicationvaccine.NumberOfSupplyContainer == null
                     || $scope.medicationvaccine.NoOfUnitsPerContainer == '' || $scope.medicationvaccine.NoOfUnitsPerContainer == null))

                     || ($scope.medicationvaccine.InventoryTypeID != 1002 && $scope.medicationvaccine.WasRecalled == true
                    &&
                     ($scope.medicationvaccine.RecallDate == ''
                    || $scope.medicationvaccine.RecallDate == null
                    || $scope.medicationvaccine.RecallReason == ''
                    || $scope.medicationvaccine.RecallReason == null))
                    ) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }

                 if ($scope.medicationvaccine.DateReceived != undefined && $scope.medicationvaccine.DateReceived != null) {
                     var DateReceived = new Date($scope.medicationvaccine.DateReceived); //create a new date obj
                     var DateReceived1 = DateReceived.valueOf(); //Get the value of the date
                 }
                 var CurrentDate = new Date();
                 var CurrentDateYear = CurrentDate.valueOf();
                 if (DateReceived1 > CurrentDateYear) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgDateReceivedcannotbegreaterthancurrentdate');
                 }

                 if ($scope.medicationvaccine.RecallDate != undefined && $scope.medicationvaccine.RecallDate != null) {
                     var RecallDate = new Date($scope.medicationvaccine.RecallDate); //create a new date obj
                     var RecallDate1 = RecallDate.valueOf(); //Get the value of the date
                 }
                 var CurrentDate = new Date();
                 var CurrentDateYear = CurrentDate.valueOf();
                 if (RecallDate1 > CurrentDateYear) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgRecalldatecannotbegreaterthancurrentdate');
                 }



                 if (parseFloat($scope.medicationvaccine.PricePerUnit) > 99999.99 || parseFloat($scope.medicationvaccine.PricePerSupplyUnit) > 99999.99) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgPricePerUnitshouldbelessthen1000');
                 }
                 if (parseFloat($scope.medicationvaccine.DosePerVial) > 999.99 || parseFloat($scope.medicationvaccine.DosePerMedication) > 999.99) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgDoseshouldbelessthan1000');
                 }
                 if (parseInt($scope.medicationvaccine.NumberOfContainer) > 999 || parseInt($scope.medicationvaccine.NumberOfPack) > 999 || parseInt($scope.medicationvaccine.QuantityPerContainer) > 999 || parseInt($scope.medicationvaccine.QuantityPerPack) > 999 || parseInt($scope.medicationvaccine.NoOfUnitsPerContainer) > 999) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     msg = $filter('translate')('msgNumberCannotBemorethan3digits');
                 }

                 if (isNaN($scope.medicationvaccine.TotalQuantityOfUnits)) { saveStatus = false; msg = $filter('translate')('msgPleaseEnterAValidNumber'); }
                 if (isNaN($scope.medicationvaccine.PricePerSupplyUnit)) { saveStatus = false; msg = $filter('translate')('msgPleaseEnterAValidNumber'); }

                 if (isNaN($scope.medicationvaccine.DosageMedication) || isNaN($scope.medicationvaccine.DosageVial))
                 { saveStatus = false; msg = $filter('translate')('msgPleaseEnterAValidNumber'); }
                 //                 if (isNaN($scope.medicationvaccine.PricePerSupplyUnit)) { saveStatus = false; utilityservices.notify("numbers"); }



                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/SaveInventoryDetails",
                         data: { obj: $scope.medicationvaccine }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                 }
                 else {
                     saveStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if (msg != "") {
                         toastr.warning(msg);
                     }
                 }

             };

             function saveDetailDataSuccess(data, status, headers, config) {


                 if (data.d.IsOK) {
                     if (data.d.Object.DoesExists == 1) {
                         if (data.d.Object.InventoryTypeID != 1002) {
                             toastr.warning($filter('translate')('msgLotNumberAlreadyExists'));
                         }
                         else
                             toastr.warning($filter('translate')('msgItemNumberAlreadyExists'));
                     }
                     else {
                         $scope.medicationvaccine.InventoryDetailID = data.d.Object.InventoryDetailID;
                         sharedservices.parseDates(data.d.Object);
                         utilityservices.notify("saved");
                     }
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     $scope.frmmedication.$dirty = false;
                 }
             };

             function saveDetailDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };
             
          


             //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.getMedicationVaccineDetails = function () {
                 var configs = {};
                 sharedservices.parseDates($scope.medicationvaccine);
                 $scope.medicationvaccine.InventoryDetailID = (sharedservices.getURLParameter().InventoryDetailID != undefined && sharedservices.getURLParameter().InventoryDetailID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().InventoryDetailID) : 0;
                 $scope.medicationvaccine.InventoryTypeID = (sharedservices.getURLParameter().InventoryTypeID != undefined && sharedservices.getURLParameter().InventoryTypeID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().InventoryTypeID) : sharedservices.getURLParameter().InventoryTypeID;
                 configs = {
                     url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetInventoryDetails",
                     data: { InventoryDetailID: $scope.medicationvaccine.InventoryDetailID, InventoryTypeID: $scope.medicationvaccine.InventoryTypeID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };
             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.medicationvaccine = data.d.Object;
                     setTimeout(function () { $('#VaccineOrMedicineDescription').val($scope.medicationvaccine.VaccineUsageID); }, 1000);
                     setTimeout(function () { $('#ddlVaccineType').val($scope.medicationvaccine.VaccineTypeID); }, 1000);
                     setTimeout(function () { $('#DosePerVialUnitOfMeasurementID').val($scope.medicationvaccine.DosePerVialUnitOfMeasurementID); }, 1000);
                     setTimeout(function () { $('#DosageVialUnitOfMeasurementID').val($scope.medicationvaccine.DosageVialUnitOfMeasurementID); }, 1000);
                     setTimeout(function () { $('#VialCurrentDosageUnitOfMeasurementID').val($scope.medicationvaccine.VialCurrentDosageUnitOfMeasurementID); }, 1000);
                     setTimeout(function () { $('#MedicineForm').val($scope.medicationvaccine.MedicineForm); }, 1000);
                     setTimeout(function () { $('#DosePerMedicationUnitOfMeasurementID').val($scope.medicationvaccine.DosePerMedicationUnitOfMeasurementID); }, 1000);
                     setTimeout(function () { $('#DosageMedicationUnitOfMeasurementID').val($scope.medicationvaccine.DosageMedicationUnitOfMeasurementID); }, 1000);
                     setTimeout(function () { $('#MedicationCurrentDosageUnitOfMeasurementID').val($scope.medicationvaccine.MedicationCurrentDosageUnitOfMeasurementID); }, 1000);
                     $scope.UserList = globalobject.UserList;
                     $scope.ManufactureDetailList = globalobject.ManufactureDetailList;
                     $scope.VaccineTypeList = globalobject.VaccineTypeList;
                     $scope.BrandDetailList = globalobject.BrandDetailList;
                     $scope.DrugDetailList = globalobject.DrugDetailList;
                     $scope.SupplierDetailList = globalobject.SupplierDetailList;
                     $scope.MedicineFormList = globalobject.MedicineFormList;
                     $scope.VaccineUsageList = globalobject.VaccineUsageList;
                     $scope.UnitOfMeasurementList = globalobject.UnitOfMeasurementList;
                     $scope.SupplyItemList = globalobject.SupplyItemList;
                     $scope.UnitOfMeasurementList1 = _.where($scope.UnitOfMeasurementList, { Text: 'mL' });
                     $scope.UnitOfMeasurementList1.push({ ID: 1000, Text: 'cc' });

                     var lookupexist = null;
                     lookupexist = _.where($scope.BrandDetailList, { ID: parseInt($scope.medicationvaccine.BrandDetailID) })[0];
                     if ($scope.medicationvaccine.BrandDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.BrandDetailList.push({ ID: parseInt($scope.medicationvaccine.BrandDetailID), Text: $scope.medicationvaccine.BrandName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.VaccineTypeList, { ID: parseInt($scope.medicationvaccine.VaccineTypeID) })[0];
                     if ($scope.medicationvaccine.VaccineTypeID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.VaccineTypeList.push({ ID: parseInt($scope.medicationvaccine.VaccineTypeID), Text: $scope.medicationvaccine.VaccineTypeName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.DrugDetailList, { ID: parseInt($scope.medicationvaccine.DrugDetailID) })[0];
                     if ($scope.medicationvaccine.DrugDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.DrugDetailList.push({ ID: parseInt($scope.medicationvaccine.DrugDetailID), Text: $scope.medicationvaccine.DrugName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.SupplierDetailList, { ID: parseInt($scope.medicationvaccine.SupplierDetailID) })[0];
                     if ($scope.medicationvaccine.SupplierDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.SupplierDetailList.push({ ID: parseInt($scope.medicationvaccine.SupplierDetailID), Text: $scope.medicationvaccine.SupplierDetailName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.ManufactureDetailList, { ID: parseInt($scope.medicationvaccine.ManufacturerDetailID) })[0];
                     if ($scope.medicationvaccine.ManufacturerDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.ManufactureDetailList.push({ ID: parseInt($scope.medicationvaccine.ManufacturerDetailID), Text: $scope.medicationvaccine.ManufacturerDetailName });
                         lookupexist = null;
                     }


                     var lookupexist = _.where($scope.SupplyItemList, { ID: parseInt($scope.medicationvaccine.ItemNameID) })[0];
                     if ($scope.medicationvaccine.ItemNameID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.SupplyItemList.push({ ID: parseInt($scope.medicationvaccine.ItemNameID), Text: $scope.medicationvaccine.ItemName });
                         lookupexist = null;
                     }




                     sharedservices.parseDates(data.d.Object);
                     $scope.medicationvaccine = data.d.Object;
                     if (globalobject.medicationvaccine != null) {
                         $scope.medicationvaccine = globalobject.medicationvaccine;
                         globalobject.medicationvaccine = null;
                     }
                     if (globalobject.BrandDetailID != null) {
                         $scope.medicationvaccine.BrandDetailID = globalobject.BrandDetailID;
                         globalobject.BrandDetailID = null;
                     }
                     if (globalobject.DrugDetailID != null) {
                         $scope.medicationvaccine.DrugDetailID = globalobject.DrugDetailID;
                         globalobject.DrugDetailID = null;
                     }
                     if (globalobject.VaccineTypeID != null) {
                         $scope.medicationvaccine.VaccineTypeID = globalobject.VaccineTypeID;
                         //  setTimeout(function () { $('#ddlVaccineType').val($scope.medicationvaccine.VaccineUsageID); }, 1000);
                         globalobject.VaccineTypeID = null;
                     }
                     if (globalobject.ManufacturerDetaillD != null) {
                         $scope.medicationvaccine.ManufacturerDetailID = globalobject.ManufacturerDetaillD;
                         globalobject.ManufacturerDetaillD = null;
                     }

                     $scope.DateReceived = $scope.medicationvaccine.DateReceived;
                     $scope.ExpirationDate = $scope.medicationvaccine.ExpirationDate;
                     $scope.RecallDate = $scope.medicationvaccine.RecallDate;

                     if (data.d.Object.MedicationCurrentDosage != data.d.Object.DosageMedication) {
                         $('#MedicationCurrentDosage').val(data.d.Object.MedicationCurrentDosage);
                         $scope.isEditableM = true;
                     }

                     if (data.d.Object.VialCurrentDosage != data.d.Object.DosageVial) {
                         $('#CurrentDosage').val(data.d.Object.VialCurrentDosage);
                         $scope.isEditableV = true;
                     }
                     if ($scope.medicationvaccine.InventoryDetailID != 0 && $scope.medicationvaccine.TimeReceived != null) {
                         var d = new Date();
                         d.setHours($scope.medicationvaccine.TimeReceived.split(':')[0]);
                         d.setMinutes($scope.medicationvaccine.TimeReceived.split(':')[1]);
                         $scope.DrawTimet = d;
                     }

                     if ($scope.medicationvaccine.InventoryDetailID != 0 && $scope.medicationvaccine.TimeRestored != null) {
                         var d1 = new Date();
                         d1.setHours($scope.medicationvaccine.TimeRestored.split(':')[0]);
                         d1.setMinutes($scope.medicationvaccine.TimeRestored.split(':')[1]);
                         $scope.DrawTimet1 = d1;
                     }

                     if (globalobject.redirected && globalobject.TempInventoryDetail != null && globalobject.TempInventoryDetail != undefined) {

                         $scope.medicationvaccine = globalobject.TempInventoryDetail;
                         globalobject.redirected = false;
                     }

                     if (globalobject.SupplierDetailID != null || globalobject.SupplierDetailID != undefined) {
                         $scope.medicationvaccine.SupplierDetailID = globalobject.SupplierDetailID;
                     }
                 }
             };

             function getDetailDataError(data, status, headers, config) {

             };


         } ]);
