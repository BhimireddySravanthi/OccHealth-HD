angular.module("app")
        .controller("RestrictionDetailsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices", "$q",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices, $q) {


             globalobject.SupervisorPermission = "0";
             $scope.RestrictionID = (sharedservices.getURLParameter().RestrictionID != undefined && sharedservices.getURLParameter().RestrictionID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().RestrictionID) : 0;

             $scope.restrictionDetails = {
                 PersonnelTypeID: 1000,
                 WorkRelated: null,
                 RestrictedHours: null,
                 RestrictionPeriod: null,
                 MedicineSideEffect: null,
                 Height: null,
                 Treatment: "",
                 TimeFrame: null,
                 TimeFrameWk: null,
                 RestrictionTypeIds: "",
                 OfficialMedicalDiagnosisID: "",
                 DateofReceiptofForm: "",
                 ActionTaken: "",
                 EmploymentStatus: ""

             }
             $scope.restrictionDetails1 = {
                 EmploymentStatusRes: []
             }

             if ($scope.RestrictionID == 0) {
                 $scope.restrictionDetails.PersonnelTypeID = 0;
             }
             $scope.PersonalTypeChange = function (PersonnelTypeID) {
                 $scope.restrictionDetails.PersonnelTypeID = PersonnelTypeID;

                 $scope.restrictionDetails.EmployeeName = null;
                 $scope.restrictionDetails.EmployeePK = null;
                 $scope.restrictionDetails.EmployeeID = null;
                 loadEmployeeList();
             }

             var defer = null;
             function initPromises() {

                 defer = $q.defer();
                 var promise = defer.promise;
                 $scope.showLoadingOverlay = true;
                 promise.then(loadRestrictionDetail, EmployeestatuslistFailed);
             }


             function loadRestrictionDetail() {

                 $scope.getRistrictionDetails();
             }

             function EmployeestatuslistFailed() {

                 console.log('Error');
                 $scope.showLoadingOverlay = false;
             }


             $scope.isEmployeeSecurity = false;
             $scope.isEmployeeName = false;
             function checkSecurites() {

                 if ($scope.restrictionDetails.EmployeeID == undefined || $scope.restrictionDetails.EmployeeID == null || $scope.restrictionDetails.EmployeeID == '') {
                     $scope.isEmployeeSecurity = false;
                 }
                 else {

                     $scope.isEmployeeSecurity = !$scope.funPermissionCheck(450037, 'Any', 0);
                     $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);

                 }
             }

             $scope.RestrictionsFields = utilityservices.GetCustomKeyValue('45', 'ShowRestrictionsFields');

             $scope.getRistrictionDetails = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRistrictionDetails",
                     data: { PersonnelTypeID: 0, RestrictionID: $scope.RestrictionID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDataSuccess)
                  .error(getDataError);
             };

             //             if ($scope.RestrictionID > 0) {
             //                 $scope.getRistrictionDetails();
             //             }

             function getDataSuccess(data, status, headers, config) {


                 if (data.d.IsOK) {
                     console.log("call Success...");
                     sharedservices.parseDates(data.d.Object);
                     $scope.restrictionDetails = data.d.Object;
                     setTimeout(function () { $scope.attachmentinit() }, 100);
                     setTimeout(function () { $scope.loadAttachments() }, 1000);
                     var arrayResTaskIDs = [];
                     for (var indx = 0; indx < $scope.restrictionDetails.RstrictionTasks.length; indx++) {
                         arrayResTaskIDs.push($scope.restrictionDetails.RstrictionTasks[indx].RestrictionTaskID);
                     }
                     $scope.restrictionDetails.RestrictionTypeIds = arrayResTaskIDs;
                     $scope.EmployeeType = $scope.restrictionDetails.PersonnelTypeID;
                     if ($scope.RestrictionID > 0) {
                         if ($scope.restrictionDetails.PersonnelTypeID != undefined || $scope.restrictionDetails.PersonnelTypeID != null)
                             loadEmployeeList();
                         getIncidentList();

                     }
                     checkSecurites();
                     $scope.showLoadingOverlay = false;
                     if ($scope.restrictionDetails.EmploymentStatus != null) {
                         $scope.restrictionDetails1.EmploymentStatusRes = [];
                         $scope.restrictionDetails1.EmploymentStatusRes.push($scope.restrictionDetails.EmploymentStatus);
                         $scope.previousStatus = $scope.restrictionDetails1.EmploymentStatusRes.toString();
                     }

                     //data.d.Object.EmploymentStatus = data.d.Object.EmploymentStatus.split(",");
                     //                     if (data.d.Object != null && data.d.Object.EmploymentStatus != "" && data.d.Object.EmploymentStatus != null) {
                     //                         $scope.restrictionDetails.EmploymentStatus = [];
                     //                         $scope.restrictionDetails.EmploymentStatus.push(data.d.Object.EmploymentStatus);
                     //                     }
                 }
             }
             function getDataError() {
                 utilityservices.notify("error");
                 $scope.showLoadingOverlay = false;
             }
             OfficialDiagnosis();
             function loadEmployeeList() {

                 if ($scope.restrictionDetails1.EmploymentStatusRes) {

                     var configs = {
                         url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                         data: { personnelTypeId: $scope.restrictionDetails.PersonnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: $scope.restrictionDetails1.EmploymentStatusRes == null ? "Active" : $scope.restrictionDetails1.EmploymentStatusRes.toString() }
                     };
                     sharedservices.xhrService(configs)
                   .success(function (data, status, headers, config) {
                       if (data.d.IsOK) {
                           $scope.findEmployeeList = data.d.Object == null ? [] : data.d.Object;
                           $scope.value = "";
                           angular.forEach($scope.findEmployeeList, function (value, key) {
                               if (value.EmployeeName == $scope.restrictionDetails.EmployeeName) {
                                   $scope.value = "exists";
                               }
                           });
                           if ($scope.value == "" && $scope.findEmployeeList.length > 0) {
                               $scope.restrictionDetails.EmployeeName = null;
                               $scope.restrictionDetails.EmployeePK = null;
                               $scope.restrictionDetails.EmployeeID = null;
                           }

                           if ($scope.previousStatus.length > 0 && $scope.previousStatus !== $scope.restrictionDetails1.EmploymentStatusRes.toString()) {
                               if ($scope.findEmployeeList.length === 0) {
                                   $scope.restrictionDetails.EmployeeName = null;
                                   $scope.restrictionDetails.EmployeePK = null;
                                   $scope.restrictionDetails.EmployeeID = null;
                               }
                               $scope.previousStatus = $scope.restrictionDetails1.EmploymentStatusRes.toString();
                           }


                       }
                   })
                   .error(function () {
                       utilityservices.notify("error");
                   })
                 }
               else {
                   $scope.restrictionDetails.EmployeeName = null;
                   $scope.restrictionDetails.EmployeePK = null;
                   $scope.restrictionDetails.EmployeeID = null;

                 }
             }




             $scope.previousStatus = "";
             $scope.findEmployeeStatusList = [];
             function loadEmployeeStatusList() {
                 // Show loader
                 $scope.employeeLoader = true;

                 var configs = {
                     url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeStatusList"
                 };
                 sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.findEmployeeStatusList = data.d.Object;
                defer.resolve();
                if ($scope.restrictionDetails1.EmploymentStatusRes.length == 0 || $scope.restrictionDetails1.EmploymentStatusRes == undefined) {
                    $scope.restrictionDetails1.EmploymentStatusLe = [];
                    if ($scope.RestrictionID === 0) {
                        $scope.restrictionDetails1.EmploymentStatusRes.push('Active');
                    }
                }
                if ($scope.restrictionDetails.PersonnelTypeID != undefined || $scope.restrictionDetails.PersonnelTypeID != null)
                    loadEmployeeList();
            }).error(function () {
                utilityservices.notify("error");
                defer.reject();
            })
             }

             initPromises();
             loadEmployeeStatusList();

             $scope.$watch('restrictionDetails1.EmploymentStatusRes', function (newValue, oldValue) {
                 if (newValue != oldValue) {
                     if ($scope.restrictionDetails.PersonnelTypeID != undefined || $scope.restrictionDetails.PersonnelTypeID != null)
                         loadEmployeeList();

                 }

             });
             $scope.OfficialDiagnosis = [];


             function OfficialDiagnosis() {
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRestrictionLookUpLists"
                 };
                 sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.OfficialDiagnosis = data.d.Object;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
             }

             $scope.UserList = [];
             RowNum();
             function RowNum() {
                 configs = {
                     url: "/WebServices/Foundation/OrganizationComponentService.asmx/GetDepartmentsWithID",
                     data: { showDeptBreadCrum: false }
                 };
                 sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.UserList = data.d.Object;
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
             }
             $scope.goToEmployeeProfile = function (employee) {
                 $scope.restrictionDetails.EmployeeName = employee.EmployeeName;
                 $scope.restrictionDetails.EmployeeID = employee.OccHealthEmployeeId;
                 $scope.restrictionDetails.EmployeePK = employee.ID;
                 $scope.EmployeeType = employee.EmployeeTypeId;
                 $scope.LocationID = employee.LocationId;
                 $scope.restrictionDetails.FirstDayofRestrictedDuty = null;
                 $scope.restrictionDetails.LastDayofRestrictedDuty = null;
                 getIncidentList();
             }

             function getIncidentList() {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentListForRestrictions",
                     data: { PersonnelTypeID: $scope.EmployeeType, EmployeePK: $scope.restrictionDetails.EmployeePK, LocationID: 0 }
                 };
                 sharedservices.xhrService(configs)
                     .success(function (data, status, headers, config) {
                         if (data.d.IsOK) {
                             sharedservices.parseDates(data.d.Object);
                             $scope.IncidentIdList = data.d.Object;

                         }
                     })
                     .error(function (data, status, headers, config) {

                     });
             }


             $scope.checkNum = function (e, obj) {
                 if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                     var msg = $filter('translate')('msgPleaseEnterOnlyNumbers');
                     toastr.error(msg);
                     e.keyCode = 0;
                     if (e.preventDefault) e.preventDefault();
                     return false;
                 }
             };

             $scope.CheckDuration = function (item) {
                 if (item == "-" || item < 0) {
                     item = "";
                     var msg = $filter('translate')('msgPleaseEnterOnlyNumbers');
                     toastr.error(msg);
                 }

             }




             $scope.getIncidentDetails = function (Incident) {
                 $scope.restrictionDetails.FirstDayofRestrictedDuty = Incident.RESTRICTEDDUTYSTARTDATE;
                 $scope.restrictionDetails.LastDayofRestrictedDuty = Incident.RESTRICTEDDUTYCOMPLETEDATE;
             };


             $scope.checkStuff = function (id) {
                 if (id == 'No') {
                     $scope.restrictionDetails.FirstDayofRestrictedDuty = null;
                     $scope.restrictionDetails.LastDayofRestrictedDuty = null;
                     $scope.restrictionDetails.IncidentID = 0;
                 }
             }
             $scope.back = function () {
                 var modalInstance = $modal.open({
                     animation: $scope.animationsEnabled,
                     templateUrl: '/OccHealth/modals/confirmation-modal.html',
                     controller: 'AddEmployeeCancelModalCtrl',
                     size: 'sm',
                     scope: $scope
                 });

             };
             $scope.Days = [
                { id: 1000, name: 'Lifting' },
                { id: 1001, name: ' No Use' },
                { id: 1002, name: 'Sitting' },
                { id: 1003, name: 'Standing' },
                { id: 1004, name: 'Carrying' },
                { id: 1005, name: 'Kneeling' },
                { id: 1006, name: 'Pulling' },
                { id: 1007, name: 'Handling (Grasping)' },
                { id: 1008, name: 'Fingering (Fine Manipulation) Reaching - Forward' },
                { id: 1009, name: 'Reaching - Overhead' },
                { id: 1010, name: 'Walking' },
                { id: 1011, name: 'Rotation (Twisting) - Cervical/ Lumbar' },
                { id: 1012, name: 'Crawling' },
                { id: 1013, name: 'Climbing (Ladders/ Stairs)' },
                { id: 1014, name: 'Crouching' },
                { id: 1015, name: 'Stooping/ Bending' },
                { id: 1016, name: 'Pushing' }
            ];
             $scope.Frequency = [
                { id: 1000, name: 'Never' },
                { id: 1001, name: 'Frequent' },
                { id: 1002, name: 'Occasional' },
                { id: 1003, name: 'Constant' }
            ];
             $scope.StandardOrAnthropometric = [
                { id: 1000, name: 'Standard' },
                { id: 1001, name: 'Anthropometric' }
            ];
             $scope.HeightFrom = [
                 { id: 1000, name: 'Waist' },
                { id: 1001, name: 'Floor' },
                { id: 1002, name: 'Shoulder' },
                { id: 1003, name: 'Overhead' }
            ];
             $scope.HeightTo = [
                 { id: 1000, name: 'Waist' },
                { id: 1001, name: 'Floor' },
                { id: 1002, name: 'Shoulder' },
                { id: 1003, name: 'Overhead' }
            ];
             $scope.Side = [
                { id: 1000, name: 'Left' },
                { id: 1001, name: 'Right' },
                { id: 1002, name: 'Both' }
            ];
             $scope.AddRestrictionTask = function (restrictionTaskID) {
                 var restrictionTaskType1 = {
                     RestrictionDetailID: $scope.RestrictionID,
                     RestrictionTaskID: restrictionTaskID,
                     StatusTypeID: 1000,
                     BodyPartSideID: 1000,
                     Duration: null,
                     Frequency: 1000,
                     HeightFrom: 1000,
                     HeightTo: 1000,
                     WeightOrForce: null,
                     Distance: null,
                     StandardOrAnthropometric: 1000
                 };
                 var restrictionTaskType2 = {
                     RestrictionDetailID: $scope.RestrictionID,
                     RestrictionTaskID: restrictionTaskID,
                     StatusTypeID: 1000,
                     BodyPartSideID: 1000,
                     Duration: null,
                     Frequency: 1000,
                     HeightFrom: 1000,
                     HeightTo: 1000,
                     WeightOrForce: null,
                     Distance: null,
                     StandardOrAnthropometric: 1000
                 };
                 var restrictionTaskType3 = {
                     RestrictionDetailID: $scope.RestrictionID,
                     RestrictionTaskID: restrictionTaskID,
                     StatusTypeID: 1000,
                     BodyPartSideID: 1000,
                     Duration: null,
                     Frequency: 1000,
                     HeightFrom: 1000,
                     HeightTo: 1000,
                     WeightOrForce: null,
                     Distance: null,
                     StandardOrAnthropometric: 1000
                 };
                 switch (restrictionTaskID) {
                     case 1000:
                         $scope.restrictionDetails.RstrictionTasks.push(restrictionTaskType1);
                         break;
                     case 1004: case 1006: case 1007: case 1008: case 1009: case 1016:
                         $scope.restrictionDetails.RstrictionTasks.push(restrictionTaskType2);
                         break;
                     case 1001: case 1002: case 1003: case 1005: case 1010: case 1011: case 1012: case 1013: case 1014: case 1015:
                         $scope.restrictionDetails.RstrictionTasks.push(restrictionTaskType3);
                         break;
                 }
             };


             $scope.UpdateRestrictionTask = function (restrictionTaskID) {
                 var indexOfResTask = 0;
                 indexOfResTask = $scope.getRestictionTaskIndex(restrictionTaskID);
                 switch (restrictionTaskID) {
                     case 1000:
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].WeightOrForce = $("#trResposeType" + restrictionTaskID + " [name='txtweightOrLoad']").attr("value");
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Frequency = $("#trResposeType" + restrictionTaskID + " [name='ddlFrequency']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Duration = $("#trResposeType" + restrictionTaskID + " [name='txtDuration']").attr("value");
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].StandardOrAnthropometric = $("#trResposeType" + restrictionTaskID + " [name='ddlStandardOrAnthropometric']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].HeightFrom = $("#trResposeType" + restrictionTaskID + " [name='ddlHeightFrom']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].HeightTo = $("#trResposeType" + restrictionTaskID + " [name='ddlHeightTo']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].BodyPartSideID = $("#trResposeType" + restrictionTaskID + " [name='ddlBodyPartSide']").val();
                         break;
                     case 1004: case 1006: case 1007: case 1008: case 1009: case 1016:
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].WeightOrForce = $("#trResposeType" + restrictionTaskID + " [name='txtweightOrLoad']").attr("value");
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Frequency = $("#trResposeType" + restrictionTaskID + " [name='ddlFrequency']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Distance = $("#trResposeType" + restrictionTaskID + " [name='txtDistance']").attr("value");
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].BodyPartSideID = $("#trResposeType" + restrictionTaskID + " [name='ddlBodyPartSide']").val();
                         break;
                     case 1001: case 1002: case 1003: case 1005: case 1010: case 1011: case 1012: case 1013: case 1014: case 1015:
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Frequency = $("#trResposeType" + restrictionTaskID + " [name='ddlFrequency']").val();
                         $scope.restrictionDetails.RstrictionTasks[indexOfResTask].Distance = $("#trResposeType" + restrictionTaskID + " [name='txtDistance']").attr("value");
                         break;
                 }
             };
             $scope.DeleteRestrictionTask = function (restrictionTaskID) {
                 var indexOfResTaskToBeDeleted = 0;
                 indexOfResTaskToBeDeleted = $scope.getRestictionTaskIndex(restrictionTaskID);
                 $scope.restrictionDetails.RstrictionTasks.splice(indexOfResTaskToBeDeleted, 1);
             };

             $scope.getRestictionTaskIndex = function (restrictionTaskID) {
                 var indexOfResTaskToBeDeleted = -1;
                 for (i = 0; i < $scope.restrictionDetails.RstrictionTasks.length; i++) {
                     if (restrictionTaskID == $scope.restrictionDetails.RstrictionTasks[i].RestrictionTaskID) {
                         indexOfResTaskToBeDeleted = i;
                         break;
                     }
                 }
                 return indexOfResTaskToBeDeleted;
             };
             var type1 = "<td>test</td><td><input type='Number' name='txtweightOrLoad' class='form-control' style='width: 64px' value='asda'></td> <td><select name='ddlFrequency' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td><td><input name='txtDuration' class='form-control' style='width: 64px' value='sss'></td>";
             type1 = type1 + "<td><select name='ddlStandardOrAnthropometric' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td><td><select name='ddlHeightFrom' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td>";
             type1 = type1 + "<td><select name='ddlHeightTo' class='form-control' style='width: auto'><option>10</option> <option>20</option></select></td>";
             type1 = type1 + "<td></td> <td><select name='ddlBodyPartSide' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td></tr>";


             var type2 = "<td>test</td><td><input type='Number' name='txtweightOrLoad' class='form-control' style='width: 64px' value='asda'></td> <td><select name='ddlFrequency' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td><td></td>";
             type2 = type2 + "<td></td><td></td>";
             type2 = type2 + "<td></td>";
             type2 = type2 + "<td><input name='txtDistance' class='form-control' style='width: 64px' value='asda'></td><td><select name='ddlBodyPartSide' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td></tr>";

             var type3 = "<td>test</td><td></td><td><select name='ddlFrequency' class='form-control' style='width: auto'><option>10</option><option>20</option></select></td><td></td>";
             type3 = type3 + "<td></td><td></td>";
             type3 = type3 + "<td></td>";
             type3 = type3 + "<td><input name='txtDistance' class='form-control' style='width: 64px' value='asda'></td><td></td></tr>";

             $scope.RestrictionTypeChange = function (RestrictionTypeIds) {
                 var trResponseTypeID;
                 var resposeTypeIDsArrey = RestrictionTypeIds;
                 for (i = 0; i < resposeTypeIDsArrey.length; i++) {
                     switch (resposeTypeIDsArrey[i]) {
                         case 1000:
                             if ($("#trResposeType" + resposeTypeIDsArrey[i]).length == 1) {
                                 //$scope.UpdateRestrictionTask(resposeTypeIDsArrey[i]);
                             }
                             else {
                                 $scope.AddRestrictionTask(resposeTypeIDsArrey[i]);
                                 //trResponseTypeID = "<tr" + " id='trResposeType" + resposeTypeIDsArrey[i] + "'>";
                                 //$("#tbodyTask").append(trResponseTypeID + type1);
                             }
                             break;

                         case 1004: case 1006: case 1007: case 1008: case 1009: case 1016:
                             if ($("#trResposeType" + resposeTypeIDsArrey[i]).length == 1) {
                                 //$scope.UpdateRestrictionTask(resposeTypeIDsArrey[i]);
                             }
                             else {
                                 $scope.AddRestrictionTask(resposeTypeIDsArrey[i]);
                                 //trResponseTypeID = "<tr" + " id='trResposeType" + resposeTypeIDsArrey[i] + "'>";
                                 //$("#tbodyTask").append(trResponseTypeID + type2);
                             }
                             break;

                         case 1001: case 1002: case 1003: case 1005: case 1010: case 1011: case 1012: case 1013: case 1014: case 1015:
                             if ($("#trResposeType" + resposeTypeIDsArrey[i]).length == 1) {
                                 //$scope.UpdateRestrictionTask(resposeTypeIDsArrey[i]);
                             }
                             else {
                                 $scope.AddRestrictionTask(resposeTypeIDsArrey[i]);
                                 //trResponseTypeID = "<tr" + " id='trResposeType" + resposeTypeIDsArrey[i] + "'>";
                                 //$("#tbodyTask").append(trResponseTypeID + type3);
                             }
                             break;


                     }

                 }
                 $("[id^=trResposeType]").each(function (key, value) {
                     var temtrResponseTypeID = $(this).attr("id");
                     var isthisResponseTypeunSelected = true;
                     var temResponseTypeID = temtrResponseTypeID.substring($(this).attr("id").length, 13);
                     for (i = 0; i < resposeTypeIDsArrey.length; i++) {
                         if (temResponseTypeID == resposeTypeIDsArrey[i]) {
                             isthisResponseTypeunSelected = false;
                             break;
                         }
                     }
                     if (isthisResponseTypeunSelected == true) {
                         $scope.DeleteRestrictionTask(temResponseTypeID);
                         //$(this).remove();
                     }
                 });



             };
             $scope.SelectFrequencyValue = function (itemid, item) {
                 var itemSelected = {};
                 for (var i = 0; i < $scope.Frequency.length; i++) {
                     if (itemid == 0) {
                         itemSelected = $scope.Frequency[0];
                         item.Frequency = $scope.Frequency[0].id;
                         break;
                     }
                     if (itemid == $scope.Frequency[i].id) {
                         itemSelected = $scope.Frequency[i];
                         break;
                     }
                 }
                 return itemSelected;
             };

             $scope.FrequencyValueChange = function (SelectedValue, item) {
                 item.Frequency = SelectedValue.id;
             };
             $scope.SelectStandardOrAnthropometricValue = function (itemid, item) {
                 var itemSelected = {};
                 for (var i = 0; i < $scope.StandardOrAnthropometric.length; i++) {
                     if (itemid == 0) {
                         itemSelected = $scope.StandardOrAnthropometric[0];
                         item.StandardOrAnthropometric = $scope.StandardOrAnthropometric[0].id;
                         break;
                     }
                     if (itemid == $scope.StandardOrAnthropometric[i].id) {
                         itemSelected = $scope.StandardOrAnthropometric[i];
                         break;
                     }
                 }
                 return itemSelected;
             };
             $scope.StandardOrAnthropometricValueChange = function (SelectedValue, item) {
                 item.StandardOrAnthropometric = SelectedValue.id;
             };
             $scope.SelectHeightFromValue = function (itemid, item) {
                 var itemSelected = {};
                 for (var i = 0; i < $scope.HeightFrom.length; i++) {
                     if (itemid == 0) {
                         itemSelected = $scope.HeightFrom[0];
                         item.HeightFrom = $scope.HeightFrom[0].id;
                         break;
                     }
                     if (itemid == $scope.HeightFrom[i].id) {
                         itemSelected = $scope.HeightFrom[i];
                         break;
                     }
                 }
                 return itemSelected;
             };
             $scope.HeightFromValueChange = function (SelectedValue, item) {
                 item.HeightFrom = SelectedValue.id;
             };
             $scope.SelectHeightToValue = function (itemid, item) {
                 var itemSelected = {};
                 for (var i = 0; i < $scope.HeightTo.length; i++) {
                     if (itemid == 0) {
                         itemSelected = $scope.HeightTo[0];
                         item.HeightFrom = $scope.HeightTo[0].id;
                         break;
                     }
                     if (itemid == $scope.HeightTo[i].id) {
                         itemSelected = $scope.HeightTo[i];
                         break;
                     }
                 }
                 return itemSelected;
             };
             $scope.HeightToValueChange = function (SelectedValue, item) {
                 item.HeightTo = SelectedValue.id;
             };
             $scope.SelectSideValue = function (itemid, item) {
                 var itemSelected = {};
                 for (var i = 0; i < $scope.Side.length; i++) {
                     if (itemid == 0) {
                         itemSelected = $scope.Side[0];
                         item.BodyPartSideID = $scope.Side[0].id;
                         break;
                     }
                     if (itemid == $scope.Side[i].id) {
                         itemSelected = $scope.Side[i];
                         break;
                     }
                 }
                 return itemSelected;
             };
             $scope.SideValueChange = function (SelectedValue, item) {
                 item.BodyPartSideID = SelectedValue.id;
             };
             $scope.getTaskName = function (taskId) {
                 var obj = _.where($scope.Days, { 'id': taskId })[0];
                 return obj.name;
             };


             $scope.NumericCheckForDuration = function (resTask, previousValue) {
                 if (resTask.Duration == undefined || isNaN(resTask.Duration)) {
                     resTask.Duration = previousValue;
                     toastr.warning("Please enter numbers only.");
                 }
                 else if (resTask.Duration != '' && resTask.Duration != "" && resTask.Duration < 0) {
                     resTask.Duration = previousValue;
                     toastr.warning("Nagative values are not allowed.");
                 }
                 else if (resTask.Duration >= 1000) {
                     resTask.Duration = previousValue;
                     toastr.warning("Value should be less than 1000.");
                 }
             };
             $scope.NumericCheckForWeightOrForce = function (resTask, previousValue) {
                 if (resTask.WeightOrForce == undefined || isNaN(resTask.WeightOrForce)) {
                     resTask.WeightOrForce = previousValue;
                     toastr.warning("Please enter numbers only.");
                 }
                 else if (resTask.WeightOrForce != '' && resTask.WeightOrForce != "" && resTask.WeightOrForce < 0) {
                     resTask.WeightOrForce = previousValue;
                     toastr.warning("Nagative values are not allowed.");
                 }
                 else if (resTask.WeightOrForce >= 1000) {
                     resTask.WeightOrForce = previousValue;
                     toastr.warning("Value should be less than 1000.");
                 }

             };

             $scope.NumericCheckForHeight = function (Height) {
                 if (Height == undefined || isNaN(Height)) {
                     $('#txtHeight').val("");
                     toastr.warning("Please enter numbers only.");
                 }
                 else if (Height != '' && Height != "" && Height < 0) {
                     $('#txtHeight').val("");
                     toastr.warning("Nagative values are not allowed.");
                 }
                 else if (Height >= 1000) {
                     $('#txtHeight').val("");
                     toastr.warning("Value should be less than 1000.");
                 }

             };
             $scope.attachmentinit = function () {

                 $scope.attachmentConfig = {
                     MaxFileSize: '',
                     ProhibitedFileExtensions: '',
                     LocationID: '',
                     AttachmentType: 'Restriction',
                     Module: 'OccHealth',
                     ID: $scope.RestrictionID,
                     Attachments: [],
                     showUpload: true,
                     getServiceConfig: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectAttachmentsByEncounterID",
                         data: { EncounterDetailID: $scope.RestrictionID, DocType: 'Restriction' }
                     },
                     saveService: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                         data: { ID: $scope.RestrictionID, DocumentIds: '', DocType: 'Restriction' }
                     },
                     deleteService: {
                         url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                         data: { ID: $scope.RestrictionID, DocumentIds: '', DocType: 'Restriction' }
                     }
                 };
                 //$scope.loadAttachments();
             }

             $scope.loadingAction = false;
             $scope.saveRistrictionDetails = function () {
                 sharedservices.parseDates($scope.restrictionDetails);
                 $scope.showLoadingOverlay = true;
                 var saveStatus = true;
                 // globalobject.selectEmployeeStatus.EmployeeStatus = $scope.restrictionDetails.EmploymentStatus;
                 //$scope.restrictionDetails.EmploymentStatus = "";
                 if (($scope.restrictionDetails.FirstDayofRestrictedDuty == undefined || $scope.restrictionDetails.FirstDayofRestrictedDuty == null || $scope.restrictionDetails.FirstDayofRestrictedDuty == '')
                   || ($scope.restrictionDetails.WorkRelated == null || $scope.restrictionDetails.RestrictionPeriod == null)
                 // || ($scope.restrictionDetails.RestrictionTypeIds == "" || $scope.restrictionDetails.RestrictionTypeIds == null || $scope.restrictionDetails.RestrictionTypeIds == undefined)
                 //                   || ($scope.restrictionDetails.RestrictedHours == true && ($scope.restrictionDetails.TimeFrame == "" || $scope.restrictionDetails.TimeFrame == null || $scope.restrictionDetails.TimeFrame == undefined))
                   || ($scope.restrictionDetails.OfficialMedicalDiagnosisID == "" || $scope.restrictionDetails.OfficialMedicalDiagnosisID == null || $scope.restrictionDetails.OfficialMedicalDiagnosisID == undefined)
                 //                   || ($scope.RestrictionsFields == "Yes" && $scope.restrictionDetails.Treatment == null || $scope.restrictionDetails.Treatment == undefined || $scope.restrictionDetails.Treatment == '')
                   || ($scope.restrictionDetails.OfficialMedicalDiagnosisID == null || $scope.restrictionDetails.OfficialMedicalDiagnosisID == undefined || $scope.restrictionDetails.OfficialMedicalDiagnosisID == '')
                   || ($scope.restrictionDetails.DateofReceiptofForm == undefined || $scope.restrictionDetails.DateofReceiptofForm == null || $scope.restrictionDetails.DateofReceiptofForm == '')
                   || ($scope.restrictionDetails.ActionTaken == "" || $scope.restrictionDetails.ActionTaken == null)) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 else if ($scope.RestrictionsFields == "Yes") {
                     if (($scope.restrictionDetails.Treatment == "" || $scope.restrictionDetails.Treatment == null || $scope.restrictionDetails.Treatment == undefined)
                      || ($scope.restrictionDetails.FirstDateofOnset == "" || $scope.restrictionDetails.FirstDateofOnset == null || $scope.restrictionDetails.FirstDateofOnset == undefined)) {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }

                 //               if ($scope.restrictionDetails.LastDayofRestrictedDuty != null) {
                 //                     sharedservices.parseDates($scope.restrictionDetails.FirstDayofRestrictedDuty);
                 //                     sharedservices.parseDates($scope.restrictionDetails.LastDayofRestrictedDuty);
                 //                     if ($scope.restrictionDetails.FirstDayofRestrictedDuty > $scope.restrictionDetails.LastDayofRestrictedDuty) {
                 //                         saveStatus = false;
                 //                         toastr.warning("Last Day of Restricted Duty Not Less than First Day of Restricted Duty.")
                 //                     }
                 //                     saveStatus = true;
                 //                 }
                 if (($scope.restrictionDetails.Height == null || $scope.restrictionDetails.Height == '')) {
                     saveStatus = false;
                     toastr.warning("Plase enter valid Height")
                 }

                 if ($scope.restrictionDetails.MedicineSideEffect == 'Yes' && ($scope.restrictionDetails.RestrictionComment == "" || $scope.restrictionDetails.RestrictionComment == null)) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                 }
                 if ($scope.restrictionDetails.RestrictionTypeIds.length > 0) {
                     for (i = 0; i < $scope.restrictionDetails.RstrictionTasks.length; i++) {

                         switch ($scope.restrictionDetails.RstrictionTasks[i]["RestrictionTaskID"]) {

                             case 1000:
                                 if ($scope.restrictionDetails.RstrictionTasks[i]["Duration"] == null || $scope.restrictionDetails.RstrictionTasks[i]["WeightOrForce"] == null) {
                                     saveStatus = false;
                                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                                 }
                                 break;

                             case 1001: case 1002: case 1003: case 1005: case 1010: case 1011: case 1012: case 1013: case 1014: case 1015:
                                 if ($scope.restrictionDetails.RstrictionTasks[i]["Distance"] == "") {
                                     saveStatus = false;
                                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                                 }
                                 break;
                             case 1004: case 1006: case 1007: case 1008: case 1009: case 1016:
                                 if ($scope.restrictionDetails.RstrictionTasks[i]["Distance"] == "" || $scope.restrictionDetails.RstrictionTasks[i]["Distance"] == null || $scope.restrictionDetails.RstrictionTasks[i]["WeightOrForce"] == null || $scope.restrictionDetails.RstrictionTasks[i]["WeightOrForce"] == "") {
                                     saveStatus = false;
                                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                                 }
                                 break;
                         }
                     }
                 }


                 if (!($scope.Attachments.length > 0 || $scope.uploadAttachments.length > 0)) {
                     saveStatus = false;
                     $scope.showLoadingOverlay = false;
                     $scope.loadingAction = false;
                     msg = $filter('translate')('msgAttachmentisRequired');

                 }



                 if (saveStatus && !$scope.loadingAction) {

                     $scope.restrictionDetails.FirstDateofOnset = new Date($scope.restrictionDetails.FirstDateofOnset).toDateString();
                     $scope.restrictionDetails.FirstDayofRestrictedDuty = new Date($scope.restrictionDetails.FirstDayofRestrictedDuty).toDateString();

                     if ($scope.restrictionDetails.LastDayofRestrictedDuty != "" && $scope.restrictionDetails.LastDayofRestrictedDuty != null && $scope.restrictionDetails.LastDayofRestrictedDuty != undefined) {
                         $scope.restrictionDetails.LastDayofRestrictedDuty = new Date($scope.restrictionDetails.LastDayofRestrictedDuty).toDateString();
                     }
                     $scope.restrictionDetails.DateofReceiptofForm = new Date($scope.restrictionDetails.DateofReceiptofForm).toDateString();

                     if ($scope.restrictionDetails.RestrictedHours === false) {

                         $scope.restrictionDetails.TimeFrame = null;
                         $scope.restrictionDetails.TimeFrameWk = null;
                     }
                     $scope.loadingAction = true;
                     var configs = {};
                     configs = {
                         url: "/WebServices/OccupationalHealth/OccHealthService.asmx/SaveRistrictionDetails",
                         data: { data: $scope.restrictionDetails }
                     };

                     sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                 }
                 else {
                     saveStatus = true;
                     $scope.loadingAction = false;
                     $scope.showLoadingOverlay = false;
                     if (msg != "") {
                         toastr.warning(msg);
                         // $scope.restrictionDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
                     }
                 }
             }


             function saveDataSuccess(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 if (data.d.IsOK) {
                     console.log("call Success...");
                     $scope.frmRestrictions.$dirty = false;
                     $scope.restrictionDetails = data.d.Object;

                     $scope.RestrictionID = $scope.restrictionDetails.RestrictionDetailID;
                     sharedservices.parseDates($scope.restrictionDetails);
                     $scope.attachmentinit();
                     $scope.saveAttachments();
                     toastr.success('Successully Saved');
                     $scope.getRistrictionDetails();
                     checkSecurites();
                     //  $scope.restrictionDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
                 }

             }
             function saveDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 // $scope.restrictionDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
                 console.log("call failed...");
             }



             $scope.cancel = function () {
                 if ($scope.frmRestrictions.$dirty) {
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

         }
        ]) 
        