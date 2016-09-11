angular.module("app")
        .controller("ohEditEmployeeInformationCtrl", ["$scope", "$filter", "$location", "$modal", "$log", "sharedservices", "utilityservices", "toastr", "$http", "globalobject", "$window", "$timeout"
        , function ohEditEmployeeInformationCtrl($scope, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject, $window, $timeout) {

            $scope.Employee = {
                OccEmployeePk: 0
                , OccHealthEmployeeId: null
                , FirstName: null
                , MiddleName: null
                , LastName: null
                , Suffix: null
                , SocialSecurityNumber: null
                , DateOfBirth: null
                , Gender: null
                , EmployeeType: 1001
                , MaritalStatus: null
                , NoOfDependants: null
                , OccEmploymentStatus: null
                , PrimaryLanguage: null
                , SecondaryLanguages: null
                , Address: null
                , City: null
                , CountryId: null
                , StateId: null
                , Zip: null
                , DayPhone: null
                , NightPhone: null
                , EmailID: null
                , EmergencyContactInfo: null
                , HireDate: null
                , Wage: null
                , WagePeriod: null
                , HoursPerDay: null
                , DaysPerWeek: null
                , EmployeeRole: null
                , PersonnelAreaName: null
                , JobStartDate: null
                , DateOfTermination: null
                , JobTitle: null
                , SupervisorId: null
                , IntPersonnelType: null
                , EmployeeHireDate: null
                , DeptId: null
                , Shift: null
                , DeptName: null
                , ShiftName: null
                , EmploymentStatusDate: null
                , NCCICode: null
                , NCCIOccupation: null
                , FEIN: null
                , LegalEntityName: null
                , Nationality: null
                , Ethnicity: null
                , PhysicalLocation: null
                , HireState: null
                , SupervisorEmail: null
                , WageUom: null
                , ContractorName: null
                , ContractorID: null
            }

            $scope.Days = [
                { id: 0, name: 'Sunday' },
                { id: 1, name: 'Monday' },
                { id: 2, name: 'Tuesday' },
                { id: 3, name: 'Wednesday' },
                { id: 4, name: 'Thursday' },
                { id: 5, name: 'Friday' },
                { id: 6, name: 'Saturday' }
            ];
            $scope.filterData = {
                DaysIDs: []
            };

            $scope.EncounterObject = globalobject.currentEncounter;

            $scope.showContractor = true;

            $scope.allowSubmit = false;

            $scope.isWageAvailable = true;

            $scope.isSSNAvailable = true;

            $scope.isDOBAvailable = true;

            $scope.isEmployeeSecurity = false;
            $scope.isEmployeeName = false;
            $scope.isGender = false;
            $scope.isStreetAddressSec = false;
            $scope.isCountrySec = false;
            $scope.isStateSec = false;
            $scope.isZipSec = false;
            $scope.isDaySec = false;
            $scope.isEthinicitySec = false;

            //$scope.EmployeeTypeName = globalobject.PersonnelTypeName;$scope.screenType globalobject.employee
            $scope.RedirectFromMedicalProf = globalobject.RedirectFrom; //for navigation thruugh employee medical profile.

            //$scope.RedirectFrom = globalobject.RedirectFrom;

            $scope.EmployeeStatusList = [];
            function loadEmployeeStatusList() {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeStatusList"
                };
                sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.EmployeeStatusList = data.d.Object;


            }).error(function () {
                utilityservices.notify("error");
            })
            }
            loadEmployeeStatusList();

            globalobject.currentEncounter.screenType = "eidtemployeeinfo";

            if ($scope.RedirectFromMedicalProf == 'EmployeeMedicalProfile') {
                $scope.EmployeeTypeId = globalobject.employeeDetails.PersonnelTypeID;
                $scope.EncounterObject.PersonnelTypeID = $scope.EmployeeTypeId;

            }


            if (globalobject.employee.OccHealthEmployeeId != undefined) {
                sharedservices.parseDates(globalobject.employee);
                $scope.Employee = globalobject.employee;
                if (globalobject.employee.WorkingDays != undefined && globalobject.employee.WorkingDays != '' && globalobject.employee.WorkingDays != null) {
                    $scope.filterData.DaysIDs = JSON.parse("[" + globalobject.employee.WorkingDays.replace(/^,|,$/g, '') + "]");
                }
                $.each($scope.Employee, function (Key, value) {

                    if (value == 'Jan 01, 1900') {
                        if (!(Key == "CreatedDate" || Key == "UpdatedDate")) {
                            $scope.Employee[Key] = null;
                        }
                    }
                });
                if ($scope.Employee.DateOfBirth == undefined || $scope.Employee.DateOfBirth == null || $scope.Employee.DateOfBirth == '') {
                    $scope.isDOBAvailable = false;
                }
                else {
                    var flag = $scope.funPermissionCheck(450048, 'Any', 0);
                    if (flag) {
                        $scope.isDOBAvailable = false;
                    }
                    else {
                        $scope.isDOBAvailable = true;
                    }
                }
                checkSecurities();
            }
            else {
                if ($scope.Employee.DateOfBirth == undefined || $scope.Employee.DateOfBirth == null || $scope.Employee.DateOfBirth == '') {
                    $scope.isDOBAvailable = false;
                }
                else {
                    var flag = $scope.funPermissionCheck(450048, 'Any', 0);
                    if (flag) {
                        $scope.isDOBAvailable = false;
                    }
                    else {
                        $scope.isDOBAvailable = true;
                    }
                }

                checkSecurities();


            }

            function checkDataexistornot(value) {
                if (value == undefined || value == null || value == '')
                    return true;
                return false;
            }

            function checkSecurities() {

                if (!checkDataexistornot($scope.Employee.OccHealthEmployeeId))
                    $scope.isEmployeeSecurity = !$scope.funPermissionCheck(450037, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.FirstName))
                    $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.MiddleName))
                    $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.LastName))
                    $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.Gender))
                    $scope.isEmployeeName = !$scope.funPermissionCheck(450036, 'Any', 0);
                //isStreetAddressSec
                if (!checkDataexistornot($scope.Employee.Address))
                    $scope.isStreetAddressSec = !$scope.funPermissionCheck(450040, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.CountryId))
                    $scope.isCountrySec = !$scope.funPermissionCheck(450039, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.StateId))
                    $scope.isStateSec = !$scope.funPermissionCheck(450041, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.Zip))
                    $scope.isZipSec = !$scope.funPermissionCheck(450042, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.DayPhone))
                    $scope.isDaySec = !$scope.funPermissionCheck(450043, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.Ethnicity))
                    $scope.isEthinicitySec = !$scope.funPermissionCheck(450049, 'Any', 0);

                if (!checkDataexistornot($scope.Employee.Gender))
                    $scope.isGender = !$scope.funPermissionCheck(450038, 'Any', 0);


            }

            $scope.Employee.LocationCode = globalobject.currentSession.locationName;

            $scope.Employee.EmployeeType = $scope.EmployeeTypeId;

            $scope.formAuthentication = true;


            switch (parseInt($scope.EmployeeTypeId)) {
                case 1001:
                    $scope.EmployeeTypeName = "Employee";
                    break;
                case 1002:
                    $scope.EmployeeTypeName = "Unsupervised Contract Employee";
                    break;
                case 1003:
                    $scope.EmployeeTypeName = "Visitor";
                    break;
                case 1004:
                    $scope.EmployeeTypeName = "Supervised Contract Employee";
                    break;
            }

            switch (parseInt($scope.EmployeeTypeId)) {
                case 1001:
                    $scope.showContractor = false;
                    break;
                case 1003:
                    $scope.showContractor = false;
                    break;
                default:
                    $scope.showContractor = true;
                    break;
            }

            $scope.validateForm = function () {
                var counterValid = 0;
                $.each($scope.MandatoryFields, function (index, value) {
                    if (value == 'Gender') {
                        value = 'divGender';
                    }
                    var div = document.getElementById(value);
                    if (div != null) {
                        $(div).find('input, select, textarea')
                        .each(function () {
                            if (this.localName == "select") {
                                if (value == "StateId" && $(this).val() == "0") {
                                    $scope.formAuthentication = false;
                                    counterValid = 1;
                                }
                                else if ($(this).val() == undefined || $(this).val() == null || $(this).val() == '' || $(this).val() == "? object:null ?") {
                                    $scope.formAuthentication = false;
                                    counterValid = 1;
                                }
                            }
                            else if ($(this).val() == undefined || $(this).val() == null || $(this).val() == '') {
                                $scope.formAuthentication = false;
                                counterValid = 1;
                            }
                        });
                    }
                });
                if (counterValid == 0) {
                    $scope.formAuthentication = true;
                }
            }


            $scope.populateSupervisorEmail = function () {
                $.each($scope.SupervisorList, function (index, value) {
                    if (value.SupervisorId == $scope.Employee.SupervisorId) {
                        $scope.Employee.SupervisorEmail = value.SupervisorEmail;
                        return false;
                    }
                });
            };

            $scope.back = function () {

                if ($scope.frmEditEmpInfo.$dirty) {

                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/confirmation-modal.html',
                        controller: 'AddEmployeeCancelModalCtrl',
                        size: 'sm',
                        scope: $scope
                    });

                }

                else
                    $location.path("/employeemedicalprofile");

            };

            $scope.funSave = function () {

                $scope.Employee.FirstName = $("#txtFirstName").val();
                $scope.Employee.LastName = $("#txtLastName").val();
                $scope.Employee.DaysPerWeek = $scope.filterData.DaysIDs.toString();
                $scope.validateForm();

                if ($scope.formAuthentication) {
                    $scope.SubmitValidation();

                    var configs = {
                        url: "/WebServices/Foundation/EmployeeListService.asmx/SaveOccHealthEmployeeDetails",
                        data: { EmpObj: $scope.Employee }
                    };

                    sharedservices.xhrService(configs)
                    .success(function (data, status, headers, config) {
                        sharedservices.parseDates(data.d.Object);

                        if (data.d.IsOK) {

                            sharedservices.parseDates(data.d.Object);
                            utilityservices.notify("saved");
                            $scope.Employee.OccEmployeePk = data.d.Object.OccEmployeePk;
                            globalobject.employee = $scope.Employee;
                            $scope.frmEditEmpInfo.$dirty = false;
                        }

                        else
                            toastr.error($filter('translate')('msgSeriveerror'));

                    })
                   .error(function () {
                       toastr.error($filter('translate')('msgSeriveerror'));
                   })

                }

                else {
                    utilityservices.notify("required");
                }
            };

            $scope.LocationShiftList = [];

            $scope.GetShiftDropDownValues = function () {
                $scope.showLoadingOverlay = true;
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetShift"

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.LocationShiftList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.Shift != undefined && $scope.Employee.Shift != null) {
                            CheckForInUseIds();
                            $timeout(function () { $("#ddlShift").val($scope.Employee.Shift); $scope.showLoadingOverlay = false; }, 500);
                        }

                    }
                    else {
                        $scope.LocationShiftList = [];
                        $scope.showLoadingOverlay = false;
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                    $scope.showLoadingOverlay = false;
                })
            }

            $scope.LocationDepartmentList = [];

            $scope.GetDepartmentDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/OrganizationComponentService.asmx/GetDepartmentsWithID",
                    data: { showDeptBreadCrum: false }        

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.LocationDepartmentList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.DeptId != undefined && $scope.Employee.DeptId != null) {
                            CheckForInUseIds();
                            $timeout(function () { $("#ddlDepartment").val($scope.Employee.DeptId); }, 500);
                        }
                    }
                    else {
                        $scope.LocationDepartmentList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            //  $scope.CountryNationalityList = [];

            $scope.GetCountryDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetCountryNationalityDropDownValues"

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.CountryNationalityList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.CountryId != undefined && $scope.Employee.CountryId != null) {
                            $timeout(function () { $("#ddCountry").val($scope.Employee.CountryId); }, 500);
                        }
                        if ($scope.Employee.Nationality != undefined && $scope.Employee.Nationality != null) {
                            $timeout(function () { $("#ddlNationality").val($scope.Employee.Nationality); }, 500);
                        }
                    }
                    else {
                        $scope.CountryNationalityList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            $scope.GetCountryDropDownValues();

            //$scope.StateList = [];

            $scope.GetStateDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/SateSelectByCountryId",
                    data: { countryId: $scope.Employee.CountryId }
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.StateList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.StateId != undefined && $scope.Employee.CountryId != undefined && $scope.Employee.StateId != null && $scope.Employee.CountryId != null) {
                            $timeout(function () { $("#ddStates").val($scope.Employee.StateId); }, 500);
                        }
                    }
                    else {
                        $scope.StateList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            $scope.EthnicityList = [];

            $scope.GetEthnicityDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/SelectEthnicity"

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.EthnicityList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.Ethnicity != undefined && $scope.Employee.Ethnicity != null) {
                            $timeout(function () { $("#ddlEthnicity").val($scope.Employee.Ethnicity); }, 500);
                        }
                    }
                    else {
                        $scope.EthnicityList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            //$scope.EmployeeRoleList = [];

            $scope.GetEmployeeRoleDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeRoles"
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.EmployeeRoleList = data.d.Object == null ? [] : data.d.Object;
                    }
                    else {
                        $scope.EmployeeRoleList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            $scope.GetPersonnelAreaDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeePersonnelArea"
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.PersonnelAreaList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.PersonnelAreaName != undefined && $scope.Employee.PersonnelAreaName != null) {
                            $timeout(function () { $("#ddlPersonnelArea").val($scope.Employee.PersonnelAreaName); }, 500);
                        }
                    }
                    else {
                        $scope.PersonnelAreaList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            // $scope.UsStateList = [];

            $scope.GetUsState = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/SateSelectByCountryId",
                    data: { countryId: 1001 }
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.UsStateList = data.d.Object == null ? [] : data.d.Object;
                        if ($scope.Employee.HireState != undefined && $scope.Employee.HireState != null) {
                            $timeout(function () { $("#ddlHireState").val($scope.Employee.HireState); }, 500);
                        }
                    }
                    else {
                        $scope.UsStateList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })

            }

            $scope.SupervisorList = [];

            $scope.GetSupervisorDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetSupervisorList"
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.SupervisorList = data.d.Object == null ? [] : data.d.Object;
                        $scope.SupervisorList = $.makeArray($scope.SupervisorList);
                        CheckForInUseIds();
                        if ($scope.Employee.SupervisorId != undefined && $scope.Employee.SupervisorId != null) {
                            $timeout(function () { $("#ddlSupervisor").val($scope.Employee.SupervisorId); }, 500);
                        }
                        $scope.showLoadingOverlay = false;
                    }
                    else {
                        $scope.SupervisorList = [];
                        $scope.showLoadingOverlay = false;
                    }
                })
                .error(function () {
                    $scope.showLoadingOverlay = false;
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }




            $scope.GetShiftDropDownValues();

            $scope.GetDepartmentDropDownValues();

            $scope.GetPersonnelAreaDropDownValues();

            $scope.GetEthnicityDropDownValues();

            $scope.GetEmployeeRoleDropDownValues();

            $scope.GetSupervisorDropDownValues();

            //$scope.Employee.OccEmployeePk = utilityservices.GetCustomKeyValue('0', 'CLIENT');

            //changes to show hide employee details fields based on custom setting value.

            var HiddenFields;
            $scope.HideHireDate = true;
            $scope.HideJobStartDate = true;
            $scope.HideJobEndDate = true;

            HiddenFields = utilityservices.GetCustomKeyValue('45', 'EmployeeDetailsHiddenFields');

            $scope.HiddenFields = HiddenFields.split(",");

            angular.forEach($scope.HiddenFields, function (item, index) {

                $("#" + item).hide();

                if (item == 'HireDate') {
                    $scope.HideHireDate = false;
                }

                if (item == 'JobStartDate') {
                    $scope.HideJobStartDate = false;
                }

                if (item == 'DateOfTermination') {
                    $scope.HideJobEndDate = false; ;
                }
            });

            // Ends Here


            var MandatoryFields;

            switch (parseInt($scope.EmployeeTypeId)) {
                case 1001:
                    if ($scope.RedirectFromMedicalProf == "EmployeeMedicalProfile") {
                        MandatoryFields = utilityservices.GetCustomKeyValue('45', 'EmployeeAppointmentMandatoryFields');
                    }
                    break;
                case 1002:
                    if ($scope.RedirectFromMedicalProf == "EmployeeMedicalProfile") {
                        MandatoryFields = utilityservices.GetCustomKeyValue('45', 'UnsupervisedContractEmployeeAppointmentMandatoryFields');
                    }
                    break;
                case 1004:
                    if ($scope.RedirectFromMedicalProf == "EmployeeMedicalProfile") {
                        MandatoryFields = utilityservices.GetCustomKeyValue('45', 'SupervisedContractEmployeeAppointmentMandatoryFields');
                    }
                    break;
                default:
                    if ($scope.RedirectFromMedicalProf == "EmployeeMedicalProfile") {
                        MandatoryFields = utilityservices.GetCustomKeyValue('45', 'EmployeeAppointmentMandatoryFields');
                    }
                    break;
            }

            var x = MandatoryFields.split(",");

            $scope.MandatoryFields = x;

            //var x = ["EmployeeId","LastName","DOB"];
            //var div = document.getElementById(divID);
            $.each(x, function (index, value) {
                if (value == 'Gender') {
                    value = 'divGender';
                }
                var div = document.getElementById(value);
                $(div).find('label')
                .each(function () {
                    var divHtml;
                    lblHtml = $(this).html();
                    lblHtml = lblHtml.replace('</label>', '');
                    lblHtml = lblHtml + '<span class="text-danger">*</span></label>';
                    $(this).html(lblHtml);
                });
            });


            if ($scope.Employee.CountryId != null) {
                $scope.GetStateDropDownValues();
            }

            switch (parseInt($scope.Employee.Gender)) {
                case 1000:
                    $scope.Employee.Gender = "Male";
                    break;
                case 1001:
                    $scope.Employee.Gender = "Female";
                    break;
            }


            //Compare and exclude fields which are common in Hidden List and Mandatory List

            angular.forEach($scope.HiddenFields, function (item, index) {
                angular.forEach($scope.MandatoryFields, function (item1, index1) {
                    if (item === item1) {
                        $scope.MandatoryFields.splice(index1, 1);
                    }
                });
            });


            /**********************************************************/

            $scope.SubmitValidation = function () {

                var reqval = 1;

                var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if ($scope.Employee.EmailID != undefined && $scope.Employee.EmailID != null && $scope.Employee.EmailID != '') {
                    if (!filter.test($scope.Employee.EmailID)) {
                        //DisplayMessage("Failure", "Please enter valid email address.");
                        toastr.error($filter('translate')('msgPleaseentervalidemailaddress'));
                        reqval = 0;
                        return false;
                    }
                }

                if ($scope.Employee.DayPhone != undefined && $scope.Employee.DayPhone != null && $scope.Employee.DayPhone != '') {
                    if ($scope.Employee.DayPhone.length < 10) {
                        //pmapAlert("Phone Number (Day) should have miniumum 10 Numbers", 'Failure', null, "Message from Webpage");
                        toastr.error($filter('translate')('msgPhoneNumberDayshouldhaveminiumumNumbers'));
                        reqval = 0;
                        return false;
                    }
                }


                if ($scope.Employee.NightPhone != undefined && $scope.Employee.NightPhone != null && $scope.Employee.NightPhone != '') {
                    if ($scope.Employee.NightPhone.length < 10) {
                        //pmapAlert("Phone Number (Night) should have miniumum 10 Numbers", 'Failure', null, "Message from Webpage");
                        toastr.error($filter('translate')('msgPhoneNumberNightshouldhaveminiumumNumbers'));
                        reqval = 0;
                        return false;
                    }
                }


                // check for email validation for Email Field

                if ($scope.HideJobStartDate && $scope.Employee.JobStartDate != undefined && $scope.Employee.JobStartDate != null) {
                    var StartDate = new Date($scope.Employee.JobStartDate); //create a new date obj
                    var StartJobDate = StartDate.valueOf(); //Get the value of the date
                }

                if ($scope.HideJobEndDate && $scope.Employee.DateOfTermination != undefined && $scope.Employee.DateOfTermination != null) {
                    var TermDt = new Date($scope.Employee.DateOfTermination); //create a new date obj
                    var TerminDate = TermDt.valueOf(); //Get the value of the date
                }

                if ($scope.HideHireDate && $scope.Employee.HireDate != undefined && $scope.Employee.HireDate != null) {
                    var hireDt = new Date($scope.Employee.HireDate); //create a new date obj
                    var JobhireDt = hireDt.valueOf(); //Get the value of the date
                }

                //   Check If Job Start Date is Less than Job Hire Date
                if ((JobhireDt !== "") && (StartJobDate != "")) {
                    if (StartJobDate < JobhireDt) {
                        //DisplayMessage("Failure", "Job Start Date cannot be less than Job Hire Date.");
                        toastr.error($filter('translate')('msgJobStartDatecannotbelessthanJobHireDate'));
                        reqval = 0;
                        return false;
                    }
                }

                //   Check If Date of Termination is Less than Job Hire Date
                if ((JobhireDt !== "") && (TerminDate != "")) {
                    if (TerminDate < JobhireDt) {
                        //DisplayMessage("Failure", "Date of Termination cannot be less than Job Hire Date.");
                        toastr.error($filter('translate')('msgDateofTerminationcannotbelessthanJobHireDate'));
                        reqval = 0;
                        return false;
                    }
                }
                //   Check If Date of Termination is Less than Job Start Date
                if ((StartJobDate !== "") && (TerminDate != "")) {
                    if (TerminDate < StartJobDate) {
                        //DisplayMessage("Failure", "Date of Termination cannot be less than Job Start Date.");
                        toastr.error($filter('translate')('msgDateofTerminationcannotbelessthanJobStartDate'));
                        reqval = 0;
                        return false;
                    }
                }

                if ($scope.Employee.DateOfBirth != undefined && $scope.Employee.DateOfBirth != null) {
                    var DOBDate = new Date($scope.Employee.DateOfBirth); //create a new date obj
                    var DOBYear = DOBDate.valueOf(); //Get the value of the date
                }
                var CurrentDate = new Date();
                var CurrentDateYear = CurrentDate.valueOf();

                if (DOBYear >= CurrentDateYear) {
                    //DisplayMessage("Failure", "Date of birth cannot be greater than current date.");
                    toastr.error($filter('translate')('msgDateofbirthcannotbegreaterthancurrentdate'));
                    reqval = 0;
                    return false;
                }

                // Check for the Validity and submit the form
                if (reqval == 1) {
                    $scope.allowSubmit = true;
                }
            }



            $scope.checkNumberOnly = function (e) {
                if (!(((e.keyCode >= 48) && (e.keyCode <= 57)))) {
                    toastr.error($filter('translate')('msgPleaseEnterOnlyNumbers'));
                    $(function () {
                        $('input').blur();
                    });
                    e.keyCode = 0;
                    if (e.preventDefault) e.preventDefault();
                }
            }

            $scope.funChecknumbers = function (e) {
                if (!(((e.keyCode >= 48) && (e.keyCode <= 57)) || (e.keyCode == 43) || (e.keyCode == 45) || (e.keyCode == 40) || (e.keyCode == 41))) {
                    toastr.error($filter('translate')('msgPleaseEnterOnlyNumbers'));
                    $(function () {
                        $('input').blur();
                    });
                    e.keyCode = 0;
                    if (e.preventDefault) e.preventDefault();
                }
            }

            $scope.socialSecurityNumberValidation = function (e) {

                if (!(((e.keyCode >= 48) && (e.keyCode <= 57)) || ((e.keyCode >= 65) && (e.keyCode <= 90)) || ((e.keyCode >= 97) && (e.keyCode <= 122)) || ((e.keyCode == 45) || (e.keyCode == 47) || (e.keyCode == 92)))) {
                    e.keyCode = 0;
                    toastr.error($filter('translate')('msgPleaseEnterValidCharacter'));
                    if (e.preventDefault) e.preventDefault();
                }
            }

            $scope.chkIntegerForEmployeeID = function (e) {
                if (!(((e.keyCode >= 48) && (e.keyCode <= 57)) || ((e.keyCode > 64) && (e.keyCode < 91)) || ((e.keyCode > 96) && (e.keyCode < 123)) || (e.keyCode == 45) || (e.keyCode == 47) || (e.keyCode == 92))) {
                    toastr.error($filter('translate')('msgPleaseEnterCharactersContaining'));
                    //DisplayMessage("Failure", "Please enter characters containing '0-9','a-z','A-Z' and '\\','/','-' only.");
                    $(function () {
                        $('input').blur();
                    });
                    e.keyCode = 0;
                    if (e.preventDefault) e.preventDefault();
                }
            }

            $scope.reset = function () {
                $scope.Employee.WagePeriod = null;
                $scope.Employee.WageUom = null;
                $scope.Employee.Wage = null;
            };
            function CheckForInUseIds() {
                var i, innerHTML, c = 0;
                var ddlReplace = '<option value="? object:null ?"></option>';
                if (!utilityservices.ValidateField($scope.Employee.SupervisorId)) {
                    for (i = $scope.SupervisorList.length - 1; i > -1; i--) {
                        if ($scope.SupervisorList[i].SupervisorId === $scope.Employee.SupervisorId) {
                            c++;
                        }
                    }
                    if (c == 0) {
                        $scope.SupervisorList.push({ SupervisorId: $scope.Employee.SupervisorId, SupervisorName: $scope.Employee.Supervisor });
                    }
                }
                c = 0;
                if (!utilityservices.ValidateField($scope.Employee.DeptId)) {
                    for (i = $scope.LocationDepartmentList.length - 1; i > -1; i--) {
                        if ($scope.LocationDepartmentList[i].DepartmentId == $scope.Employee.DeptId) {
                            c++;
                        }
                    }
                    if (c == 0 && $scope.LocationDepartmentList.length > 0) {

                        $scope.LocationDepartmentList.push({ DepartmentId: $scope.Employee.DeptId, Name: $scope.Employee.DeptName });
                    }
                }

                c = 0;
                if (!utilityservices.ValidateField($scope.Employee.Shift)) {
                    for (i = $scope.LocationShiftList.length - 1; i > -1; i--) {
                        if ($scope.LocationShiftList[i].ID == $scope.Employee.Shift) {
                            c++;
                        }
                    }
                    if (c == 0 && $scope.LocationShiftList.length > 0) {
                        $scope.LocationShiftList.push({ ID: $scope.Employee.Shift, Text: $scope.Employee.ShiftName });
                    }
                }

            }

            /**********************************************************/
        }
])



function CorrectNameFormat(txtBox) {
    var id = txtBox.id;
    var Name = $.trim($("#" + id).val());
    var firstLetterASCII = Name.charCodeAt(0);
    if (firstLetterASCII >= 97 && firstLetterASCII <= 122) {
        Name = Name.charAt(0).toUpperCase() + Name.slice(1);
    }
    $("#" + id).val(Name);
}

