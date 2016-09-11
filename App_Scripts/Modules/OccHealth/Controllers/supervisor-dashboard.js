(function () {
    angular.module("app")
        .controller("supervisorDashboardCtrl", supervisorDashboardCtrl);

    function supervisorDashboardCtrl($scope, $log, sharedservices, $location, globalobject, historySrv) {

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
        globalobject.navBar.viewId = 1;
        globalobject.navBar.label = "Care Management";
        $scope.navBarOptions = {
            showCalendar: true,
            showFilter: false,
            showFindEmployee: true,
            toggleCalendar: false,
            findEmployeeList: []
        };

        /*
         * HEALTH CARE PROVIDER
         * */
        $scope.healthCareProviders = [
            {
                id: 0,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Chacon",
                onDuty: true
            },
            {
                id: 1,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Thomas",
                onDuty: true
            },
            {
                id: 2,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Smith",
                onDuty: false
            },
            {
                id: 3,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Chacon",
                onDuty: true
            },
            {
                id: 4,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Thomas",
                onDuty: true
            },
            {
                id: 5,
                type: "doctor",
                typeShort: "Dr.",
                firstName: "Jorge",
                lastName: "Thomas",
                onDuty: true
            }

        ];

        $scope.currentProvider = null;
        $scope.healthCareProviderInfo = function (provider) {

                $scope.showProviders = false;
                $scope.currentProvider = provider;
        };

        $scope.goTo = function(view){
            $location.path("/" + view);
        };


    };
})();