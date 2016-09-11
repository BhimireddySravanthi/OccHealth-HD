
angular.module("app")
        .controller("LeaveDetailsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {



             $scope.LeaveDetailID = (sharedservices.getURLParameter().LeaveDetailID != undefined && sharedservices.getURLParameter().LeaveDetailID != null) ?
                                                                    parseInt(sharedservices.getURLParameter().LeaveDetailID) : 0;
             $scope.EmployeePK = (sharedservices.getURLParameter().EmployeePK != undefined && sharedservices.getURLParameter().EmployeePK != null) ?

                                                                    parseInt(sharedservices.getURLParameter().EmployeePK) : sharedservices.getURLParameter().EmployeePK;


             $scope.leaveDetails = {
                 PersonnelTypeID: "",
                 WorkRelated: false,
                 LeaveApproved: true,
                 DateLeaveBegan: "",
                 FirstDayOff: "",
                 AnticipatedWorkReturnDate: "",
                 WCApprovedThrough: "",
                 FLMAApprovedThrough: "",
                 STDApprovedThrough: "",
                 ApprovalOfFMLA: true,
                 ApprovalOfSTD: true,
                 TimeAndAttendanceWCUpdatedThrough: "",
                 TimeAndAttendanceFLMAUpdatedThrough: "",
                 TimeAndAttendanceSTDUpdatedThrough: "",
                 STDStatusID: null,
                 FMLAStatusID: null,
                 WorkConditioningRequired: false,
                 SAPApprovedLeave: true,
                 SAPRTW: true,
                 DrugScreenRequired: false,
                 EmployeePhoneNumber: "",
                 IndefiniteMedicalLayoffDate: "",
                 EmploymentStatus: ""


             }
             $scope.leaveDetails1 = {
                 EmploymentStatusLe: []
             }

             $scope.PersonalTypeChange = function (PersonnelTypeID) {
                 $scope.personnelTypeID = PersonnelTypeID;
                 $scope.leaveDetails.EmployeeName = null;
                 $scope.leaveDetails.EmployeePK = null;
                 $scope.leaveDetails.EmployeeID = null;
                 loadEmployeeList();

             }

             $scope.EmployeeIDs = null;
             //$scope.EmployeeStatus= [];




             $scope.isEmployeeSecurity = false;
             $scope.isEmployeeName = false;
             function checkSecurites() {

                 if ($scope.leaveDetails.EmployeePK == undefined || $scope.leaveDetails.EmployeePK == null || $scope.leaveDetails.EmployeePK == '') {
                     $scope.isEmployeeSecurity = false;
                 }
                 else {

                     $scope.isEmployeeSecurity = !$scope.funPermissionCheck(450037, 'Any', 0);
                     $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);

                 }
             }

             $scope.LeaveTypes = [];
             $scope.LeaveTypes = globalobject.LeaveTypes;

             $scope.getleaveDetails = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/LeaveManagement/LeaveManagementService.asmx/GetLeaveDetails",
                     data: { LeaveDetailID: $scope.LeaveDetailID, EmployeePK: $scope.EmployeePK }
                 };

                 sharedservices.xhrService(configs)
                .success(getDetailDataSuccess)
                .error(getDetailDataError);
             };

             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     sharedservices.parseDates(data.d.Object);
                     $scope.leaveDetails = data.d.Object;

                     $scope.leaveDetails.LeaveTypeIDs = JSON.parse("[" + $scope.leaveDetails.LeaveTypeIDs + "]");
                     $scope.personnelTypeID = $scope.leaveDetails.PersonnelTypeID;
                     //  loadEmployeeList();
                     checkSecurites();
                     if ($scope.leaveDetails.EmploymentStatus != null) {
                         $scope.leaveDetails1.EmploymentStatusLe = [];
                         $scope.leaveDetails1.EmploymentStatusLe.push($scope.leaveDetails.EmploymentStatus);
                     }
                     //data.d.Object.EmploymentStatus = data.d.Object.EmploymentStatus.split(",");
                     $scope.leaveDetails.TimeDaysOff = function () {

                         return getDaysDifference($scope.leaveDetails.FirstDayOff, $scope.leaveDetails.AnticipatedWorkReturnDate);

                     };
                 }
             };

             function getDetailDataError(data, status, headers, config) {

             };

             if ($scope.LeaveDetailID > 0) {
                 $scope.getleaveDetails();
                 getIncidentList();

             }

             function loadEmployeeList() {
                 var configs = {
                     url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                     data: { personnelTypeId: $scope.personnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: $scope.leaveDetails1.EmploymentStatusLe == null ? "Active" : $scope.leaveDetails1.EmploymentStatusLe.toString() }
                 };
                 sharedservices.xhrService(configs)
                   .success(function (data, status, headers, config) {
                       if (data.d.IsOK) {
                           $scope.findEmployeeList = data.d.Object == null ? [] : data.d.Object;
                           getIncidentList();
                           $scope.value = "";
                           angular.forEach($scope.findEmployeeList, function (value, key) {
                               if (value.EmployeeName == $scope.leaveDetails.EmployeeName) {
                                   $scope.value = "exists";
                               }
                           });
                           if ($scope.value == "" && $scope.findEmployeeList.length > 0) {
                               $scope.leaveDetails.EmployeeName = null;
                               $scope.leaveDetails.EmployeePK = null;
                               $scope.leaveDetails.EmployeeID = null;
                           }
                       }
                   })
                   .error(function () {
                       utilityservices.notify("error");
                   })
             }

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
                if ($scope.leaveDetails1.EmploymentStatusLe.length == 0 || $scope.leaveDetails1.EmploymentStatusLe == undefined) {
                    $scope.leaveDetails1.EmploymentStatusLe = [];
                    $scope.leaveDetails1.EmploymentStatusLe.push('Active');
                }
                if ($scope.personnelTypeID != undefined || $scope.personnelTypeID != null)
                    loadEmployeeList();
            }).error(function () {
                utilityservices.notify("error");
            })
             }
             loadEmployeeStatusList();

             $scope.$watch('leaveDetails1.EmploymentStatusLe', function (newValue, oldValue) {
                 if (newValue != oldValue) {
                     if ($scope.personnelTypeID != undefined || $scope.personnelTypeID != null)
                         loadEmployeeList();
                 }

             });


             $scope.goToEmployeeProfile = function (employee) {
                 $scope.leaveDetails.EmployeeName = employee.FirstName + ' ' + employee.LastName;
                 $scope.leaveDetails.EmployeeID = employee.OccHealthEmployeeId;
                 $scope.leaveDetails.EmployeePK = employee.ID;
                 $scope.leaveDetails.DepartmentID = employee.DeptId;
                 $scope.leaveDetails.DateOfInjury = null;
                 $scope.personnelTypeID = employee.EmployeeTypeId;
                 $scope.LocationID = employee.LocationId;
                 if (employee.DayPhone != null) {
                     $scope.leaveDetails.EmployeePhoneNumber = employee.DayPhone;
                 }
                 if (employee.DayPhone == null && (employee.NightPhone != null || employee.NightPhone != "")) {
                     $scope.leaveDetails.EmployeePhoneNumber = employee.NightPhone;
                 }
                 getIncidentList();
             };

             function getIncidentList() {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentListForRestrictions",
                     data: { PersonnelTypeID: $scope.personnelTypeID, EmployeePK: $scope.leaveDetails.EmployeePK, LocationID: 0 }
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

             $scope.getIncidentDetails = function (Incident) {
                 $scope.leaveDetails.DateOfInjury = Incident.INCIDENTDATE;
             };

             $scope.loadingAction = false;

             $scope.SaveLeaveDetails = function () {

                 //globalobject.selectEmployeeStatus.EmployeeStatus = $scope.leaveDetails.EmploymentStatus;
                 //$scope.leaveDetails.EmploymentStatus = "";

                 if ($scope.leaveDetails.DateOfInjury != "" && $scope.leaveDetails.DateOfInjury != null && $scope.leaveDetails.DateOfInjury != undefined) {
                     $scope.leaveDetails.DateOfInjury = new Date($scope.leaveDetails.DateOfInjury).toDateString();
                 }
                 if ($scope.leaveDetails.DateLeaveBegan != "" && $scope.leaveDetails.DateLeaveBegan != null && $scope.leaveDetails.DateLeaveBegan != undefined) {
                     $scope.leaveDetails.DateLeaveBegan = new Date($scope.leaveDetails.DateLeaveBegan).toDateString();
                 }
                 if ($scope.leaveDetails.FirstDayOff != "" && $scope.leaveDetails.FirstDayOff != null && $scope.leaveDetails.FirstDayOff != undefined) {
                     $scope.leaveDetails.FirstDayOff = new Date($scope.leaveDetails.FirstDayOff).toDateString();
                 }
                 if ($scope.leaveDetails.AnticipatedWorkReturnDate != "" && $scope.leaveDetails.AnticipatedWorkReturnDate != null && $scope.leaveDetails.AnticipatedWorkReturnDate != undefined) {
                     $scope.leaveDetails.AnticipatedWorkReturnDate = new Date($scope.leaveDetails.AnticipatedWorkReturnDate).toDateString();
                 }
                 //                 if ($scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != undefined) {
                 //                     $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough).toDateString();
                 //                 }
                 //                 if ($scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != undefined) {
                 //                     $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough).toDateString();
                 //                 }
                 //                 if ($scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != undefined) {
                 //                     $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough).toDateString();
                 //                 }
                 //                 if ($scope.leaveDetails.WCApprovedThrough != "" && $scope.leaveDetails.WCApprovedThrough != null && $scope.leaveDetails.WCApprovedThrough != undefined) {
                 //                     $scope.leaveDetails.WCApprovedThrough = new Date($scope.leaveDetails.WCApprovedThrough).toDateString();
                 //                 }
                 //                 if ($scope.leaveDetails.FLMAApprovedThrough != "" && $scope.leaveDetails.FLMAApprovedThrough != null && $scope.leaveDetails.FLMAApprovedThrough != undefined) {
                 //                     $scope.leaveDetails.FLMAApprovedThrough = new Date($scope.leaveDetails.FLMAApprovedThrough).toDateString();
                 //                 }
                 //                 if ($scope.leaveDetails.STDApprovedThrough != "" && $scope.leaveDetails.STDApprovedThrough != null && $scope.leaveDetails.STDApprovedThrough != undefined) {
                 //                     $scope.leaveDetails.STDApprovedThrough = new Date($scope.leaveDetails.STDApprovedThrough).toDateString();
                 //                 }
                 if ($scope.leaveDetails.IndefiniteMedicalLayoffDate != "" && $scope.leaveDetails.IndefiniteMedicalLayoffDate != null && $scope.leaveDetails.IndefiniteMedicalLayoffDate != undefined) {
                     $scope.leaveDetails.IndefiniteMedicalLayoffDate = new Date($scope.leaveDetails.IndefiniteMedicalLayoffDate).toDateString();
                 }
                 //  sharedservices.parseDates($scope.leaveDetails);
                 if ($scope.leaveDetails.LeaveTypeIDs != undefined) {
                     $scope.leaveDetails.LeaveTypeIDs = $scope.leaveDetails.LeaveTypeIDs.toString();
                 }
                 var saveStatus = true;
                 $scope.showLoadingOverlay = true;
                 //Validations for all fields 
                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1003) != -1)) {
                     if ($scope.leaveDetails.WCApprovedThrough != "" && $scope.leaveDetails.WCApprovedThrough != null && $scope.leaveDetails.WCApprovedThrough != undefined) {
                         $scope.leaveDetails.WCApprovedThrough = new Date($scope.leaveDetails.WCApprovedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.WCApprovedThrough = null;
                 }

                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1000) != -1)) {
                     if ($scope.leaveDetails.FLMAApprovedThrough != "" && $scope.leaveDetails.FLMAApprovedThrough != null && $scope.leaveDetails.FLMAApprovedThrough != undefined) {
                         $scope.leaveDetails.FLMAApprovedThrough = new Date($scope.leaveDetails.FLMAApprovedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.FLMAApprovedThrough = null;
                 }

                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1002) != -1)) {
                     if ($scope.leaveDetails.STDApprovedThrough != "" && $scope.leaveDetails.STDApprovedThrough != null && $scope.leaveDetails.STDApprovedThrough != undefined) {
                         $scope.leaveDetails.STDApprovedThrough = new Date($scope.leaveDetails.STDApprovedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.STDApprovedThrough = null;
                 }

                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1003) != -1)) {
                     if ($scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough != undefined) {
                         $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.TimeAndAttendanceWCUpdatedThrough = null;
                 }

                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1000) != -1)) {
                     if ($scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough != undefined) {
                         $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.TimeAndAttendanceFLMAUpdatedThrough = null;
                 }

                 if ($scope.leaveDetails.LeaveApproved && ($scope.leaveDetails.LeaveTypeIDs != null && $scope.leaveDetails.LeaveTypeIDs != undefined && $scope.leaveDetails.LeaveTypeIDs.indexOf(1002) != -1)) {
                     if ($scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != "" && $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != null && $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough != undefined) {
                         $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough = new Date($scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough).toDateString();
                     }
                     else {
                         saveStatus = false;
                         msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                     }
                 }
                 else {
                     $scope.leaveDetails.TimeAndAttendanceSTDUpdatedThrough = null;
                 }

                 if ($scope.leaveDetails.WageStatusID == "" || $scope.leaveDetails.EmployeePhoneNumber == "" || $scope.leaveDetails.LeaveTypeIDs == "") {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 //                 if ($scope.leaveDetails.WorkRelated && ($scope.leaveDetails.DateOfInjury == "" || $scope.leaveDetails.DateOfInjury == null)) {
                 //                     saveStatus = false;
                 //                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 //                 }
                 if ($scope.leaveDetails.LeaveApproved == false && ($scope.leaveDetails.Reasonnotapproved == "" || $scope.leaveDetails.Reasonnotapproved == null || $scope.leaveDetails.Reasonnotapproved == undefined)) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                 }
                 if (($scope.leaveDetails.LeaveApproved == true && ($scope.leaveDetails.DateLeaveBegan == "" || $scope.leaveDetails.DateLeaveBegan == null || $scope.leaveDetails.FirstDayOff == "" || $scope.leaveDetails.FirstDayOff == null ||
                     $scope.leaveDetails.AnticipatedWorkReturnDate == "" || $scope.leaveDetails.AnticipatedWorkReturnDate == null || $scope.leaveDetails.IndefiniteMedicalLayoffDate == null || $scope.leaveDetails.STDStatusID == null || $scope.leaveDetails.FMLAStatusID == null || $scope.leaveDetails.IndefiniteMedicalLayoffDate == ""))) {
                     saveStatus = false;
                     msg = $filter('translate')('msgRequiredfieldmustbecompleted');

                 }

                 if (saveStatus && !$scope.loadingAction) {
                     $scope.loadingAction = true;

                     var configs = {};
                     configs = {
                         url: "/WebServices/OccupationalHealth/LeaveManagement/LeaveManagementService.asmx/SaveLeaveDetails",
                         data: { data: $scope.leaveDetails }

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
                         // $scope.leaveDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
                     }
                 }
             };

             function saveDataSuccess(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 if (data.d.IsOK) {
                     $scope.frmLeaveDetail.$dirty = false;
                     sharedservices.parseDates(data.d.Object);
                     $scope.LeaveDetails = data.d.Object;
                     utilityservices.notify("saved");
                     $scope.LeaveDetailID = data.d.Object.LeaveDetailID;
                     $scope.getleaveDetails();
                     checkSecurites();
                     // $scope.leaveDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
                 }

             }
             function saveDataError(data, status, headers, config) {
                 $scope.loadingAction = false;
                 $scope.showLoadingOverlay = false;
                 utilityservices.notify("error");
                 // $scope.leaveDetails.EmploymentStatus = globalobject.selectEmployeeStatus.EmployeeStatus;
             }


             $scope.EmployeePhoneNum = function (PhoneNum) {
                 if (PhoneNum == undefined || isNaN(PhoneNum)) {
                     $('#PhoneNum').val("");
                     // utilityservices.notify("numbers");
                     toastr.warning("Please enter numbers only.");
                 }
                 else if (PhoneNum != '' && PhoneNum != "" && PhoneNum < 0) {
                     $('#PhoneNum').val("");
                     toastr.warning("Nagative values are not allowed.");
                 }
                 else if (PhoneNum.length >= 15) {
                     $('#PhoneNum').val("");
                     toastr.warning("Value should be less than 15 charecters.");
                 }

             };

             var getDaysDifference = function (dateFrom, dateTo) {
                 var oneDay = 24 * 60 * 60 * 1000;
                 if (dateFrom != "" & dateTo != "") {
                     var firstDate = new Date(dateFrom);
                     var secondDate = new Date(dateTo);

                     var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                     return diffDays
                 }
                 return 0
             };
             $scope.leaveDetails.TimeDaysOff = function () {
                 //  if ($scope.leaveDetails.FirstDayOff < $scope.leaveDetails.AnticipatedWorkReturnDate) {
                 return getDaysDifference($scope.leaveDetails.FirstDayOff, $scope.leaveDetails.AnticipatedWorkReturnDate);
                 // }
                 //  else

                 //     return 0


             };            
             $scope.cancel = function () {
                 if ($scope.frmLeaveDetail.$dirty) {
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

             //             $scope.onSelected = function (selectedItem) {
             //                 alert($scope.leaveDetails.LeaveTypeIDs);
             //             }


         } ]);
