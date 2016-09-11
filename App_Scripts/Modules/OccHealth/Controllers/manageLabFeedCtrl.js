(function(){
    angular.module("app")
        .controller("manageLabFeedCtrl", manageLabFeedCtrl);

    function manageLabFeedCtrl( $scope, $location, sharedservices, globalobject ){

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
        globalobject.navBar.label = "Manage Lab Feed";

        // Options that will be pass to the navigation bar directive.
        $scope.navBarOptions = {
            showCalendar: true,
            showFilter: true,
            showFindEmployee: true,
            toggleCalendar: true,
            findEmployeeList: []
        };


        $scope.goTo = function(view){
            $location.path("/" + view);
        };


    };
})();
