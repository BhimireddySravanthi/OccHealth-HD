
angular.module("app")
        .controller("equipmentCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.ScreenID = "450047";
             $scope.Equipment =
             {
                 EquipmentDetailID: 0
                , EquipmentCategoryID: ""
                , EquipmentTypeID: ""
                , EquipmentModelID: ""
                , SerialNumber: ""
                , CalibrationRequired: ""
                , CalibrationDate: ""
                , MonitoringTypeID: ""
                , CalibrationNotes: ""
                , NotifyTo: ""
                , MaintainedBy: ""
                , SAR: ""
                , SupplierDetailID: ""
                , ManufacturerDetailID: ""
                , StorageLocation: ""

             };

             $scope.newfileAdded = false;
             $scope.OwnerList = [];
             $scope.OwnerList.SelectedOwners = [];

             $scope.MonitoringTypeList = [];
             $scope.EquipmentCategoryList = [];
             $scope.EquipmentTypeList = [];
             $scope.UserList = [];
             $scope.ManufactureDetailList = [];
             $scope.SupplierDetailList = [];
             $scope.SupplyItemList = [];
             $scope.EquipmentModelList = [];

             //globalobject.TempEquipmentDetail = {};

             $scope.showHideAddLookup = utilityservices.GetCustomKeyValue('45', 'AddOcchealthLookup');
             globalobject.fromScreen = 'Equipment';

             ////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.cancelEquipment = function () {

                 if ($scope.frmEquipment.$dirty || $scope.newfileAdded) {
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



             if ($scope.Equipment.CalibrationDate == 'Thu Jan 01 1970') { $scope.Equipment.CalibrationDate = null; }

             $scope.resetValue = function () {
                 $scope.Equipment.EquipmentTypeID = null;
                 $scope.Equipment.EquipmentModelID = null;
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////////

             $scope.getEquipmentDetails = function () {
                 var configs = {};
                 sharedservices.parseDates($scope.Equipment);
                 $scope.Equipment.EquipmentDetailID = (sharedservices.getURLParameter().EquipmentDetailID != undefined && sharedservices.getURLParameter().EquipmentDetailID != null) ? parseInt(sharedservices.getURLParameter().EquipmentDetailID) : 0;

                 //$scope.attachmentinit();

                 configs = {
                     url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/GetEquipmentDetail",
                     data: { EquipmentDetailID: $scope.Equipment.EquipmentDetailID }
                 };

                 sharedservices.xhrService(configs)
                .success(getDetailDataSuccess)
                .error(getDetailDataError);


             };
             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     setTimeout(function () { $('#MonitoringTypeID').val($scope.Equipment.MonitoringTypeID); }, 1000);
                     setTimeout(function () { $('#EquipmentCategoryID').val($scope.Equipment.EquipmentCategoryID); }, 1000);
                     setTimeout(function () { $('#EquipmentModelID').val($scope.Equipment.EquipmentModelID); }, 1000);
                     setTimeout(function () { $scope.attachmentinit() }, 100); //$scope.attachmentinit();$scope.loadAttachments();
                     setTimeout(function () { $scope.loadAttachments() }, 1000);
                     $scope.UserList = globalobject.UserList;
                     $scope.ManufactureDetailList = globalobject.ManufactureDetailList;
                     $scope.SupplierDetailList = globalobject.SupplierDetailList;
                     $scope.MonitoringTypeList = globalobject.MonitoringTypeList;
                     $scope.EquipmentCategoryList = globalobject.EquipmentCategoryList;
                     $scope.EquipmentTypeList = globalobject.EquipmentTypeList;
                     $scope.EquipmentModelList = globalobject.EquipmentModelList;

                     sharedservices.parseDates(data.d.Object);
                     $scope.OwnerList.SelectedOwners = JSON.parse("[" + data.d.Object.NotifyTo.replace(/^,|,$/g, '') + "]");
                     $scope.Equipment = data.d.Object;
                     $scope.CalibrationDate = $scope.Equipment.CalibrationDate;


                     var lookupexist = null;
                     lookupexist = _.where($scope.EquipmentTypeList, { ID: parseInt($scope.Equipment.EquipmentTypeID) })[0];
                     if ($scope.Equipment.EquipmentTypeID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.EquipmentTypeList.push({ ID: parseInt($scope.Equipment.EquipmentTypeID), Text: $scope.Equipment.EquipmentTypeName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.SupplierDetailList, { ID: parseInt($scope.Equipment.SupplierDetailID) })[0];
                     if ($scope.Equipment.SupplierDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.SupplierDetailList.push({ ID: parseInt($scope.Equipment.SupplierDetailID), Text: $scope.Equipment.SupplierDetailName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.ManufactureDetailList, { ID: parseInt($scope.Equipment.ManufacturerDetailID) })[0];
                     if ($scope.Equipment.ManufacturerDetailID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.ManufactureDetailList.push({ ID: parseInt($scope.Equipment.ManufacturerDetailID), Text: $scope.Equipment.ManufacturerDetailName });
                         lookupexist = null;
                     }

                     lookupexist = _.where($scope.EquipmentModelList, { ID: parseInt($scope.Equipment.EquipmentModelID) })[0];
                     if ($scope.Equipment.EquipmentModelID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.EquipmentModelList.push({ ID: parseInt($scope.Equipment.EquipmentModelID), Text: $scope.Equipment.EquipmentModalName });
                         lookupexist = null;
                     }


                     lookupexist = _.where($scope.EquipmentCategoryList, { ID: parseInt($scope.Equipment.EquipmentCategoryID) })[0];
                     if ($scope.Equipment.EquipmentCategoryID != null && (lookupexist == undefined || lookupexist == null)) {
                         $scope.EquipmentCategoryList.push({ ID: parseInt($scope.Equipment.EquipmentCategoryID), Text: $scope.Equipment.EquipmentCategoryName });
                         lookupexist = null;
                     }



                     if (globalobject.redirected) {

                         $scope.Equipment = globalobject.TempEquipmentDetail;
                         $scope.CalibrationDate = globalobject.TempEquipmentDetail.CalibrationDate;
                     }

                     if (globalobject.SupplierDetailID != null || globalobject.SupplierDetailID != undefined) {
                         $scope.Equipment.SupplierDetailID = globalobject.SupplierDetailID;
                     }

                     if (globalobject.EquipmentCategoryID != null || globalobject.EquipmentCategoryID != undefined) {
                         $scope.Equipment.EquipmentCategoryID = globalobject.EquipmentCategoryID;
                     }

                     if (globalobject.EquipmentTypeID != null || globalobject.EquipmentTypeID != undefined) {
                         $scope.Equipment.EquipmentTypeID = globalobject.EquipmentTypeID;
                     }

                     if (globalobject.EquipmentModelID != null || globalobject.EquipmentModelID != undefined) {
                         $scope.Equipment.EquipmentModelID = globalobject.EquipmentModelID;
                     }

                     if (globalobject.Equipment != null) {
                         $scope.Equipment = globalobject.Equipment;
                         $scope.Equipment.ManufacturerDetailID = globalobject.ManufacturerDetaillD;
                         $scope.CalibrationDate = globalobject.TempEquipmentDetail.CalibrationDate;
                         globalobject.Equipment = null;
                         globalobject.ManufacturerDetaillD = null;
                     }
                     if (globalobject.EquipmentCategoryID != null) {
                         globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                         globalobject.EquipmentCategoryID = null;
                     }

                 }
             };

             function getDetailDataError(data, status, headers, config) {

             };
             $scope.loadingAction = false;
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             $scope.saveEquipmentDetails = function () {
                 var saveStatus = true;
                 $scope.showLoadingOverlay = true;
                 $scope.Equipment.CalibrationDate = new Date($scope.CalibrationDate).toDateString();


                 if ($scope.Equipment.CalibrationRequired == false) {
                     $scope.Equipment.CalibrationDate = null;
                     $scope.Equipment.MonitoringTypeID = null;
                     $scope.OwnerList.SelectedOwners = null;
                     $scope.CalibrationDate = null;
                     $scope.Equipment.CalibrationNotes = '';
                 }
                 if ($scope.Equipment.EquipmentCategoryID != 1002) { $scope.Equipment.EquipmentTypeID = null; $scope.Equipment.EquipmentModelID = null; }

                 if ($scope.Equipment.EquipmentCategoryID == ''
                 || $scope.Equipment.EquipmentCategoryID == null
                  || $scope.Equipment.StorageLocation == null
                   || $scope.Equipment.StorageLocation == ''

                 || ($scope.Equipment.EquipmentCategoryID == 1002 &&
                  ($scope.Equipment.EquipmentTypeID == ''
                  || $scope.Equipment.EquipmentTypeID == null
                  || $scope.Equipment.EquipmentModelID == ''
                  || $scope.Equipment.EquipmentModelID == null))

                  || $scope.Equipment.SerialNumber == ''
                  || $scope.Equipment.SerialNumber == null

                  || $scope.Equipment.CalibrationRequired === ''
                  || $scope.Equipment.CalibrationRequired === null

                  || ($scope.Equipment.CalibrationRequired == true &&
                  ($scope.Equipment.CalibrationDate == ''
                  || $scope.Equipment.CalibrationDate == null
                  || $scope.OwnerList.SelectedOwners == ''
                  || $scope.OwnerList.SelectedOwners == ''
                  || $scope.Equipment.MonitoringTypeID == ''
                  || $scope.Equipment.MonitoringTypeID == null))
                  ) {
                     saveStatus = false;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     toastr.warning($filter('translate')('msgRequiredfieldmustbecompleted'));
                 }

                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;
                     $scope.Equipment.NotifyTo = (angular.isArray($scope.OwnerList.SelectedOwners)) ? $scope.OwnerList.SelectedOwners.join() : $scope.OwnerList.SelectedOwners;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/Inventory/MedicationVaccineService.asmx/SaveEquipmentDetail",
                         data: { obj: $scope.Equipment }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(saveDetailDataError);
                 }
             };

             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     if (data.d.Object.DoesExists == 1) { toastr.warning($filter('translate')('msgSerialNumberAlreadyExists')); }
                     else {
                         $scope.Equipment.EquipmentDetailID = data.d.Object.EquipmentDetailID;
                         sharedservices.parseDates(data.d.Object);
                         $scope.frmEquipment.$dirty = false;
                         $scope.newfileAdded = false;
                         $scope.attachmentinit();
                         $scope.saveAttachments();

                         utilityservices.notify("saved");
                     }

                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                 }
             };

             function saveDetailDataError(data, status, headers, config) {

                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
             };


             $scope.addEquipmentCategory = function () {
                 globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                 globalobject.TempEquipmentDetail = $scope.Equipment;
                 globalobject.TempEquipmentDetail.CalibrationDate = $scope.CalibrationDate;
                 $location.path("/EquipmentCategory");
             }

             $scope.addSupplier = function () {
                 globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                 globalobject.TempEquipmentDetail = $scope.Equipment;
                 globalobject.TempEquipmentDetail.CalibrationDate = $scope.CalibrationDate;
                 $location.path("/SupplierDetail");
             }

             $scope.addEquipmentModel = function () {
                 globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                 globalobject.TempEquipmentDetail = $scope.Equipment;
                 globalobject.TempEquipmentDetail.CalibrationDate = $scope.CalibrationDate;
                 $location.path("/EquipmentModel");
             }

             $scope.addEquipmentType = function () {
                 globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                 globalobject.TempEquipmentDetail = $scope.Equipment;
                 globalobject.TempEquipmentDetail.CalibrationDate = $scope.CalibrationDate;
                 $location.path("/EquipmentType");
             }
             $scope.AddNewManufacturer = function () {
                 globalobject.EquipmentCategoryID = $scope.Equipment.EquipmentCategoryID;
                 globalobject.TempEquipmentDetail = $scope.Equipment;
                 globalobject.Equipment = $scope.Equipment;
                 globalobject.TempEquipmentDetail.CalibrationDate = $scope.CalibrationDate;
                 $location.path("/Manufacturer");
             }


             $scope.attachmentinit = function () {

                 $scope.attachmentConfig = {
                     MaxFileSize: '',
                     ProhibitedFileExtensions: '',
                     LocationID: '',
                     AttachmentType: 'Equipment',
                     Module: 'OccHealth',
                     ID: $scope.Equipment.EquipmentDetailID,
                     Attachments: [],
                     showUpload: true,
                     getServiceConfig: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectAttachmentsByEncounterID",
                         data: { EncounterDetailID: $scope.Equipment.EquipmentDetailID, DocType: 'Equipment' }
                     },
                     saveService: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                         data: { ID: $scope.Equipment.EquipmentDetailID, DocumentIds: '', DocType: 'Equipment' }
                     },
                     deleteService: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                         data: { ID: $scope.Equipment.EquipmentDetailID, DocumentIds: '', DocType: 'Equipment' }
                     }
                 };
                 //$scope.loadAttachments();
             }
         } ]);
