(function(){
        angular.module("app")
            .controller("EHSActionItemFormCtrl", EHSActionItemFormCtrl);

        function EHSActionItemFormCtrl( $scope, $location, globalobject ){

            globalobject.navBar.label = "Action Items";

            //// HEADER DROPDOWN MENU ITEMS
            // Options that will be pass to the navigation bar directive.
            $scope.navBarOptions = {
                menuItems: [{
                    'label': 'Health & Safety Dashboard',
                    'link': '#EHSDashboard'
                }],
                showCalendar: true,
                showFilter: true,
                showFindEmployee: true,
                showFilterPanel : false,
                toggleCalendar: true,
                findEmployeeList: []
            };

            $scope.goTo = function (view) {
                $location.path("/" + view);
            };

            $scope.samples = [
                'One',
                'Two',
                'Three',
                'Four',
                'Five',
                'Six',
                'Seven',
                'Eight'
            ];

            $scope.nurses = [
                {
                    "name": "John Doe"
                },
                {
                    "name": "Sarah Jones"
                }
            ];

        };
    }
)();