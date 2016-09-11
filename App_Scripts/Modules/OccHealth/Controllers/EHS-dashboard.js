(function () {
    angular.module("app")
        .controller("EHSDashboardCtrl", EHSDashboardCtrl);

    function EHSDashboardCtrl($scope, $location, globalobject, sharedservices, historySrv ) {

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
        // Options that will be pass to the navigation bar directive.
        globalobject.navBar.viewId = 2;
        globalobject.navBar.label = "Health & Safety Dashboard";
        $scope.navBarOptions = {
            showCalendar: true,
            showFilter: true,
            showFindEmployee: true,
            showFilterPanel: false,
            toggleCalendar: true,
            findEmployeeList: []
        };


        $scope.showTableIndex = [true, false, false];

        $scope.showTable = function (id) {
            /*
             * ID info
             *
             * 0 for Encounters
             * 1 for Appointments
             * 2 for Action Items
             * */


            for (var i = 0; i < $scope.showTableIndex.length; i++) {
                if (i !== id) {
                    $scope.showTableIndex[i] = false;
                }
                else {
                    $scope.showTableIndex[i] = true;
                }
            }

        };

        // ENCOUNTER TYPES
        $scope.encounterTypes = [
            // {id: 0, name: 'Exposure Testing - Blood Lead'},
            // {id: 1, name: 'Exposure Testing - Urine Lead'},
            {id: 2, name: 'Vitals'},
            {id: 3, name: 'Administer Immunization'},
            {id: 4, name: 'Administer Medication'},
            {id: 5, name: 'Biometrics'},
            {id: 6, name: 'Post Offer Physical'},
            {id: 7, name: 'Titers'},
            {id: 8, name: 'Special Consultation'},
            {id: 9, name: 'Work Consultation'},
            {id: 10, name: 'Work Conditioning'},
            {id: 11, name: 'Work Simulation'},
            {id: 12, name: 'EIP Initial'},
            {id: 13, name: 'EIP Follow Up'},
            {id: 14, name: 'Education'},
            {id: 15, name: 'External Medical Records'},
            {id: 16, name: 'Spirometry'},
            {id: 17, name: 'Audiometric Testing'},
            {id: 18, name: 'Fit Testing'},
            {id: 19, name: 'Drug/Alcohol Testing'},
            {id: 20, name: 'Other'},
            {id: 21, name: 'Health Analysis'}
        ];

        $scope.orderByField = null;
        $scope.reverseSort = false;

        //Filter Logic Start
        $scope.isSame = function (dt1, dt2) {
            return moment(dt1).isSame(dt2, 'day');
        };

        $scope.columns = ["ID", "Type", "Name", "Employee ID", "Location Dept.", "DOB", "Gender", "Supervisor", "Phone", "Email", "Personnel Type", "Result"];
        $scope.samples = [
            'Smoker',
            'Pregnant',
            'Number of weeks',
            'Expected Due Date',
            'Draw date',
            'Time',
            'Health Care Provider',
            'Refuse Sampling'
        ];

        $scope.setFilterEncounterType = function (filterEncounterType) {
            $scope.showViewSaveAs = true;

        };

        $scope.views = [
            {name: "default"},
            {name: "view 1"}
        ]

        //Filter Logic End

        $scope.goTo = function (view) {
            $location.path("/" + view);
        };

    };
})();