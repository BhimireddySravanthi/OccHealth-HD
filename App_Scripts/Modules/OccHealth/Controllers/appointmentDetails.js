angular.module("app")
    .controller("ohAppointmentDetails", [
        "$scope",
        "$log",
        "$location",
        "sharedservices",
        "$modal",
        "toastr",
        "$filter",
        "globalobject",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject) {

            //****************************GET ALL COMMON LOOKUP VALUE FROM GLOBAL OBJECT START************************************************//
            $scope.AppointmentStatusList = globalobject.AppointmentStatusList;
            $scope.EncounterTypeList = globalobject.EncounterTypeList;
            $scope.HealthCareEntityList = globalobject.HealthCareEntityList;
            $scope.VisitReasonList = globalobject.VisitReasonList;
            $scope.HealthcareProviderList = globalobject.HealthcareProviderList;
            $scope.VisiteTypeList = globalobject.VisiteTypeList;
            $scope.PersonnelTypeList = globalobject.PersonnelTypeList;
            $scope.ContactMethodList = globalobject.ContactMethodList;

            //****************************GET ALL LOOKUP VALUE FROM  START GLOBALOBJECT END************************************************//


            //****************************SCOPE VAVIABLE USED IN CURRENT CONTROLLER START************************************************//

            $scope.EmployeeList = []; //TO GET EMPLOYEE LOOKUP VALUE

            $scope.appointmentDetails = {
                AppointmentDetailID: globalobject.AppointmentID
                   , PersonnelTypeID: null
                   , AppointmentStatusID: null
                   , VisitReasonID: 1001
                   , EncounterTypeIDs: null
                   , HealthCareEntityID: 1000
                   , HealthCareProviderID: null
                   , VisitTypeID: 1000
                   , ContactMethodID: 1000
                   , AppointmentDate: null
                   , AppointmentTime: null
                   , EmailAddress: null
                   , CellPhoneNumber: null
                   , HomePhoneNumber: null
                   , EmployeeID: null
                   , SendNotification: false
            };

            var date = new Date();
            var timeNow = $filter('date')(new Date(), 'HH:mm:ss'); $scope.Hour = timeNow.substring(0, 2); $scope.Minut = timeNow.substr(3, 2);
            $scope.appointmentDetails.AppointmentTime = $scope.Hour + ":" + $scope.Minut;

            $scope.Employee = {};
            $scope.Employee.SelectedIDs = null;

            $scope.EncounterTypes = {};
            $scope.EncounterTypes.SelectedIDs = null;

            //****************************SCOPE VAVIABLE USED IN CURRENT CONTROLLER END************************************************//

            // GET EMPLOYEE LIST
            var configs = {
                url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeNamesWithIDs"
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.EmployeeList = data.d.Object;
                // $log.log(data.Employees.Object)
            })
            .error(function () {
                $log.log("error")
            })


            var configs
            //****************************GET APPOINTMENT DETAIL BY ID START************************************************//

            $scope.getAppointmentDetails = function () {
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAppointmentDetails",
                    data: { AppointmentDetailID: $scope.appointmentDetails.AppointmentDetailID, Caller: "Appointment", VisitDate: null, Timenow: "", TimeOut: "" }
                };

                sharedservices.xhrService(configs)
                  .success(getDataSuccess)
                  .error(getDataError);
            };
            function getDataSuccess(data, status, headers, config) {
                if (data.d.IsOK) {
                    sharedservices.parseDates(data.d.Object);
                    $scope.appointmentDetails = data.d.Object;
                    $scope.Employee.SelectedIDs = JSON.parse("[" + $scope.appointmentDetails.EmployeeID + "]");
                    $scope.EncounterTypes.SelectedIDs = JSON.parse("[" + $scope.appointmentDetails.EncounterTypeIDs + "]");
                    $scope.Hour = $scope.appointmentDetails.AppointmentTime.substring(0, 2);
                    $scope.Minut = $scope.appointmentDetails.AppointmentTime.substring(3, 5);
                }
                else {
                    console.log("Failure");
                }
            };

            function getDataError(data, status, headers, config) {
                console.log("Error");
            };
            //****************************GET APPOINTMENT DETAIL BY ID END************************************************//


            //**************************** SAVE APPOINTMENT DETAIL START************************************************//

            function saveAppointmentDetails() {
                $scope.appointmentDetails.EncounterTypeIDs = $scope.EncounterTypes.SelectedIDs.toString();
                configs = {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SaveAppointment",
                    data: { appointmentObj: $scope.appointmentDetails, employeeIDs: $scope.Employee.SelectedIDs.toString() }
                };
                sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
            }

            function saveDataSuccess(data, status, headers, config) {
                $scope.button_clicked = false;
                if (data.d.IsOK) {
                    sharedservices.parseDates(data.d.Object);
                    $scope.appointmentDetails = data.d.Object;
                    $scope.Employee.SelectedIDs = $scope.appointmentDetails.EmployeeID
                    $scope.EncounterTypes.SelectedIDs = JSON.parse("[" + $scope.appointmentDetails.EncounterTypeIDs + "]");
                    $scope.Hour = $scope.appointmentDetails.AppointmentTime.substring(0, 2);
                    $scope.Minut = $scope.appointmentDetails.AppointmentTime.substring(3, 5);
                }
            };

            function saveDataError(data, status, headers, config) {
                console.log("Error");
            };

            //*****************************SAVE APPOINTMENT DETAIL END************************************************//

            // FORM/FORM SUMMARY SHOW/HIDE
            $scope.showFormEdit = true;
            $scope.editForm = function (bool) {
                $scope.showFormEdit = bool;
            };

            // HEADER DROPDOWN MENU ITEMS
            $scope.menuItems = [
                {
                    'label': 'Appointment Central',
                    'link': '#appointmentcentral'
                },
                {
                    'label': 'Inventory',
                    'link': '#'
                },
                {
                    'label': 'Medical Forms',
                    'link': '#'
                }
            ];
            $scope.currentMenuItem = $scope.menuItems[0];

            //*****************************SAVE BUTTON METHOD START************************************************//

            $scope.save = function () {

                //ADD SAVE VALIDATION AND SERVICES HERE

                if ($scope.appointmentDetails.PersonnelTypeID == null || $scope.appointmentDetails.VisitReasonID == null
                   || $scope.appointmentDetails.EncounterTypeIDs == null
                   || $scope.appointmentDetails.HealthCareEntityID == null
                   || $scope.appointmentDetails.HealthCareProviderID == null
                   || $scope.appointmentDetails.VisitTypeID == null
                   || $scope.appointmentDetails.AppointmentDate == null
                   || $scope.appointmentDetails.AppointmentTime == null
                   || $scope.Employee.SelectedIDs.toString() == null) {
                    toastr.warning('Required field must be completed.');
                    // $location.path("/appointmentcentral");
                }
                else if (!isEmailAddress($scope.appointmentDetails.EmailAddress)) {
                    toastr.warning('Invalid Email Address.');
                }
                else {
                    saveAppointmentDetails();
                    $location.path("/appointmentcentral");
                }

            };

            //*****************************SAVE BUTTON METHOD END************************************************//


            //*****************************EMAIL VALIDATION START************************************************//
            function isEmailAddress(str) {
                var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return pattern.test(str);  // returns a boolean 
            }
            //*****************************EMAIL VALIDATION END************************************************//


            // ENABLE MODAL ANIMATION
            $scope.animationsEnabled = true;

            // OPEN MODALS
            $scope.openEmployeeNamePickList = function (size) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/App_Scripts/Shared/picklist/picklist.html',
                    controller: 'ModalInstanceCtrl',
                    size: size
                });
            };

        }
    ])