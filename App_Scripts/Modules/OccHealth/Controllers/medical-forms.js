(function () {
    angular.module("app")
        .controller("medicalformsCtrl", medicalformsCtrl);

    function medicalformsCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject, historySrv) {

        globalobject.employeeSelected = []; //TODO this line is only temporary and should be deleted on logic to hold employees on add wizard step 1 is implemented.

        globalobject.currentPage = "Medical Forms";
        globalobject.currentEncounter = {'id': 0};

        var configs = {
            method: "GET",
            url: "/Data/employee.json"
        };
        sharedservices.xhrService(configs)
            .then(function (response) {
                // $scope.picklistEmployees = data.Employees.Object;
                // $log.log(response.data.Employees.Object);
                $scope.navBarOptions.findEmployeeList = response.data.Employees.Object; //.EmployeeName

            });

        //// HEADER DROPDOWN MENU ITEMS
        globalobject.navBar.label = "Medical Forms";
        // Options that will be pass to the navigation bar directive.
        $scope.navBarOptions = {
            showCalendar: true,
            showFilter: true,
            showFindEmployee: true,
            toggleCalendar: true,
            findEmployeeList: []
        };

        // //pagination
        // $scope.appointmentListSettings = {
        //     currentPage: 1,
        //     pageSize: 10
        // };
        // $scope.encounterListSettings = {
        //     currentPage: 1,
        //     pageSize: 10
        // };
        // $scope.pageSize = 3;
        // $scope.pagination = {
        //     current: 1
        // };

        // $scope.pageChanged = function (newPage) {
        // getResultsPage(newPage);
        // };
        // $scope.appointments = [];
        // $scope.searchappointment = {};
        // $scope.encounters = [];
        // $scope.searchencounter = {};

        //Date filter
        $scope.resetDates = function () {

            $scope.startDate = new Date();
            $scope.endDate = $scope.startDate;

            $scope.filterStartDate = $scope.startDate;
            $scope.filterEndDate = $scope.startDate;
            $scope.innerFilterStartDate = $scope.startDate;
            $scope.innerFilterEndDate = $scope.startDate;
            $scope.innerFilterStartDateDisplay = $scope.startDate;
            $scope.innerFilterEndDateDisplay = $scope.startDate;

        };
        $scope.resetDates();
        $scope.isSame = function (dt1, dt2) {
            return moment(dt1).isSame(dt2, 'day');
        };
        //$scope.applyDateFilter = function () {
        //    $scope.startDate = $scope.filterStartDate;
        //    $scope.endDate = $scope.filterEndDate;
        //    $scope.innerFilterStartDate = $scope.filterStartDate;
        //    $scope.innerFilterEndDate = $scope.filterEndDate;
        //    $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
        //    $scope.innerFilterEndDateDisplay = $scope.filterEndDate;
        //
        //    $('#filterSummary').slideUp(350);
        //    //make service call
        //};

        // FILTER SUMMARY OBJECT
        $scope.loadingFilter = false;
        $scope.currentFilters = [
            {label: "Appointment Status"},
            {label: "Personnel Type"},
            {label: "Health Care Provider"}
        ]
        $scope.removeFilter = function (item) {
            var index = $scope.currentFilters.indexOf(item);
            $scope.currentFilters.splice(index, 1);
            $scope.loadingFilter = true;

            // REPLACE $TIMEOUT WITH DATABASE SUCCESS FUNCTION
            $timeout(function () {
                $scope.loadingFilter = false;
            }, 2000);
        }


        // HEADER DROPDOWN MENU ITEMS
        $scope.menuItems = [
            {
                'label': 'lblAppointmentCentral',
                'link': '#appointmentcentral'
            }, {
                'label': 'lblInventory',
                'link': '#inventory'
            }, {
                'label': 'lblMedicalForms',
                'link': '#medicalforms'
            }
        ];
        $scope.currentMenuItem = $scope.menuItems[2];
        $scope.status = {
            isopen: false
        };
        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };
        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };


        // // ENABLE MODAL ANIMATION
        // $scope.animationsEnabled = true;

        // // OPEN MODALS
        // $scope.openAppointmentActionModal = function (obj) {
        //     //$scope.currentObject=obj;
        //     globalobject.currentObject = obj;
        //     var modalInstance = $modal.open({
        //         animation: $scope.animationsEnabled,
        //         templateUrl: '/OccHealth/modals/appointment-actions-modal.html',
        //         controller: 'AppointmentActionModalCtrl',
        //         size: 'sm',
        //         //scope:$scope
        //     });
        // };


        $scope.employeeLookingFor = '';

        $scope.openEmployeePicklist = function () {
            $scope.params = {
                names: 'sample name'
            };
            utilityservices.picklist($scope);
        };


        $scope.removeSelectedEmployee = function (item) {
            var index = $scope.employeesSelected.indexOf(item);
            $scope.employeesSelected.splice(index, 1);
        }

        $scope.keydown = function () {
            /* validate $scope.mobileNumber here*/
        };

        //$scope.gotoEmployeeProfile = function (id) {
        //    $location.path("/employeemedicalprofile/");
        //}

        $scope.gotoLeave = function (id) {
            $location.path("/leave/");
        }

        $scope.gotoLeaveDetails = function (id) {
            $location.path("/leavedetails/");
        }

        $scope.findEmployeeList = [];

        var configs = {
            method: "GET",
            url: "/Data/employee.json"
        };
        sharedservices.xhrService(configs)
            .then(function (response) {
                // $scope.picklistEmployees = data.Employees.Object;
                // $log.log(response.data.Employees.Object);
                $scope.findEmployeeList = response.data.Employees.Object; //.EmployeeName
            });


        $scope.employeesSelected = [
            {
                "id": "1",
                "firstname": "John",
                "lastname": "Doe"
            }, {
                "id": "2",
                "firstname": "Samuel",
                "lastname": "McGill"
            }, {
                "id": "3",
                "firstname": "Jane",
                "lastname": "Smith"
            }, {
                "id": "1",
                "firstname": "John",
                "lastname": "Doe"
            }, {
                "id": "2",
                "firstname": "Samuel",
                "lastname": "McGill"
            }, {
                "id": "3",
                "firstname": "Jane",
                "lastname": "Smith"
            }, {
                "id": "1",
                "firstname": "John",
                "lastname": "Doe"
            }, {
                "id": "2",
                "firstname": "Samuel",
                "lastname": "McGill"
            }, {
                "id": "3",
                "firstname": "Jane",
                "lastname": "Smith"
            }, {
                "id": "1",
                "firstname": "John",
                "lastname": "Doe"
            }, {
                "id": "2",
                "firstname": "Samuel",
                "lastname": "McGill"
            }, {
                "id": "3",
                "firstname": "Jane",
                "lastname": "Smith"
            }
        ];


        $scope.listOptions = function () {
            $scope.params = {
                message: "You are going to do something.",
                onSuccessCall: $scope.onSuccessCallback
            };
            utilityservices.confirm($scope);
        };
        $scope.confirmNoShow = function () {
            $scope.params = {
                message: "You are going to mark this appointment as a \"No Show\".",
                onSuccessCall: $scope.onSuccessCallback
            };
            utilityservices.confirm($scope);
        };
        //picklist demo
        $scope.names = "John Philip";
        $scope.ids = 1000;
        $scope.onSuccessCallback = function () {
            var msg = $filter('translate')('msgRecordDeleted');
            utilityservices.notify("success", msg, "Success");
            utilityservices.notify("success", msg);
            utilityservices.notify("error", msg);
            utilityservices.notify("info", msg);
            utilityservices.notify("warning", msg);
            utilityservices.notify("required");
            $log.log("ok cliked" + $scope.names)
        };
        $scope.params = {};


        $scope.displayEncounterTypes = function (data) {
            //send as string and parse here as JSON and return
            var obj = data;
            return obj;
        };
        $scope.add = function (data) {
            //put the path for encounter type details screen
            globalobject.currentEncounter = {'id': id};
            $location.path("/leavedetails");
        }

        // Calendar popup options and functions.
        $scope.status = {
            opened: false
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.open = function ($event) {
            $scope.status.opened = true;
            // console.log("Opening Calendar, status.opened : " +$scope.status.opened);
        };

        // //goto AppointmentDetails
        // $scope.gotoAppointment = function (item) {

        //     if (item.NoShow === false && item.Cancelled === false) {
        //         //send data through factory method
        //         globalobject.currentEncounter = {'id': item.AppointmentID};
        //         $location.path("/add/3");
        //     }

        // };

        //goto LeaveDetails
        // $scope.gotoLeave = function (id) {
        //     //send data through factory method
        //     globalobject.currentLeave = {'id': id};
        //     $location.path("/leavedetails/");
        // };

        // $scope.add = function (id) {
        //     $location.path("/add");
        //     //$location.path("/addappointmentorenounter");
        // };

        // JQUERY:
        $(function () {

            var setListGroupWrapperHeight;
            (setListGroupWrapperHeight = function () {
                // LIST GROUP MAX-HEIGHT BASED ON BROWSER WINDOW HEIGHT
                var listGroupHeight = Math.floor($(window).height() - 245); // Estimated height of header and action bar
                // console.log(listGroupHeight);
                $('.list-group-height-wrapper').css({
                    'height': listGroupHeight,
                    'overflow-x': 'hidden',
                    'overflow-y': 'auto'
                });
            })()

            $(window).resize(function () {
                setListGroupWrapperHeight();
            });

        });


        // FILTERS

        //$scope.toggleFilter = function (option) {
        //    $scope.innerFilterStartDate = $scope.filterStartDate;
        //    $scope.innerFilterEndDate = $scope.filterEndDate;
        //    $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
        //    $scope.innerFilterEndDateDisplay = $scope.filterEndDate;
        //
        //    if (option == "close") {
        //        $('#appointmentCentralFilterWrapper').slideUp(350);
        //    } else {
        //        $('#appointmentCentralFilterWrapper').slideToggle(350);
        //        $('#filterSummary').slideUp(350);
        //    }
        //
        //
        //    $('html, body').animate({
        //        scrollTop: 0
        //    }, 800);
        //};

        $scope.cancelInnerDateFilter = function () {
            $scope.innerFilterStartDate = $scope.filterStartDate;
            $scope.innerFilterEndDate = $scope.filterEndDate;
            $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
            $scope.innerFilterEndDateDisplay = $scope.filterEndDate;
        };

        //$scope.setToday = function (picker) {
        //    if (picker == "inner") {
        //        $scope.innerFilterStartDate = new Date();
        //        $scope.innerFilterEndDate = $scope.innerFilterStartDate;
        //    }
        //    else if (picker == "global") {
        //        $scope.filterStartDate = new Date();
        //        $scope.filterEndDate = $scope.startDate;
        //    }
        //};

        $scope.applyInnerDateFilter = function (option) {

            $scope.innerFilterStartDateDisplay = $scope.innerFilterStartDate;
            $scope.innerFilterEndDateDisplay = $scope.innerFilterEndDate;
        };

        $scope.applyFilters = function () {
            $scope.loadingFilter = true;

            $scope.startDate = $scope.innerFilterStartDate;
            $scope.endDate = $scope.innerFilterEndDate;
            $scope.filterStartDate = $scope.innerFilterStartDate;
            $scope.filterEndDate = $scope.innerFilterEndDate;

            $('#appointmentCentralFilterWrapper').slideUp(350);
            $('#filterSummary').slideDown(350);
            $('html, body').animate({
                scrollTop: 0
            }, 800);


            $scope.clearMultiSelectField = function () {
                console.log('test');
                $('input.ui-select-search').val('');
            };

            $scope.encounterTypes = [
                'Administer Immunization',
                'Administer Medication',
                'Audiometric Testing',
                'Biometrics',
                'Exposure Testing - Blood Lead',
                'Exposure Testing - Urine Lead',
                'Drug/Alcohol Testing',
                'Education',
                'EIP Follow Up',
                'EIP Initial',
                'Fit Testing',
                'Health Analysis',
                'Medical Records',
                'Other',
                'Post Offer Physical',
                'Special Consultation',
                'Spirometry',
                'Titers',
                'Vitals',
                'Work Consultation',
                'Work Conditioning',
                'Work Simulation',
            ];

            $scope.visitReasons = [
                'Initial Medical',
                'Follow Up Medical',
                'Initial Workers Comp',
                'Follow Up Workers Comp',
                'Initial EIP',
                'Follow Up EIP'
            ];

            $scope.appointmentStatus = [
                'All',
                'Active',
                'Cancelled',
                'No Show',
                'Completed',
                'Rescheduled'
            ];

            $scope.scheduledBy = [
                'Arnetta Janusz',
                'Shanel Kehoe',
                'Deandrea Hofstetter',
                'Tatiana Youngman',
                'Genesis Steenberg',
                'Denis Agustin',
                'Vena Stacker',
                'Cherlyn Jamar',
                'Tobi Klingbeil',
                'Carroll Hilden'
            ];

            $scope.healthCareEntity = [
                'BTE',
                'Take Care',
                'HSS'
            ];

            $scope.personnelType = [
                'Employee',
                'Supervised Contract Employee',
                'Unsupervised Contract Employee',
                'Client Contractor',
                'Client Employee',
                'Visitor'
            ];

            // REPLACE $TIMEOUT WITH DATABASE SUCCESS FUNCTION
            $timeout(function () {
                $scope.loadingFilter = false;
                toastr.success('Filters have been applited', 'Filter');
            }, 2000);
        };

        $scope.CloseAllFilters = function () {
            $scope.loadingFilter = true;
            $scope.currentFilters = [];

            // REPLACE $TIMEOUT WITH DATABASE SUCCESS FUNCTION
            $timeout(function () {
                $scope.loadingFilter = true;
                $('#appointmentCentralFilterWrapper').slideUp(350);
                $('#filterSummary').slideUp(350);
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
            }, 2000);
        };

        $scope.clearMultiSelectField = function () {
            console.log('test');
            $('input.ui-select-search').val('');
        };

        $scope.encounterTypes = [
            'Administer Immunization',
            'Administer Medication',
            'Audiometric Testing',
            'Biometrics',
            'Blood Lead Level Exposure Testing',
            'Drug/Alcohol Testing',
            'Education',
            'EIP Follow Up',
            'EIP Initial',
            'Fit Testing',
            'Health Analysis',
            'Medical Records',
            'Other',
            'Post Offer Physical',
            'Special Consultation',
            'Spirometry',
            'Titers',
            'Urine Lead Level Exposure Testing',
            'Vitals',
            'Work Consultation',
            'Work Conditioning',
            'Work Simulation',
        ];

        $scope.visitReasons = [
            'Initial Medical',
            'Follow Up Medical',
            'Initial Workers Comp',
            'Follow Up Workers Comp',
            'Initial EIP',
            'Follow Up EIP'
        ];

        $scope.appointmentStatus = [
            'All',
            'Active',
            'Cancelled',
            'No Show',
            'Completed',
            'Rescheduled'
        ];

        $scope.scheduledBy = [
            'Arnetta Janusz',
            'Shanel Kehoe',
            'Deandrea Hofstetter',
            'Tatiana Youngman',
            'Genesis Steenberg',
            'Denis Agustin',
            'Vena Stacker',
            'Cherlyn Jamar',
            'Tobi Klingbeil',
            'Carroll Hilden'
        ];

        $scope.healthCareEntity = [
            'BTE',
            'Take Care',
            'HSS'
        ];

        $scope.personnelType = [
            'Employee',
            'Supervised Contract Employee',
            'Unsupervised Contract Employee',
            'Client Contractor',
            'Client Employee',
            'Visitor'
        ];

        $scope.goTo = function (view) {
            $location.path("/" + view);
        };

        $scope.assessment = [];
        $scope.selectAssessment = function (id) {
            $scope.assessment[id] = !$scope.assessment[id];
        };

    };
})();