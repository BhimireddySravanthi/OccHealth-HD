(function(){
        angular.module("app")
            .controller("actionItemGridCtrl", actionItemGridCtrl);

        function actionItemGridCtrl( $scope, $location, globalobject ){


            //// HEADER DROPDOWN MENU ITEMS
            globalobject.navBar.label = "Action Items";

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
        };
}
)();