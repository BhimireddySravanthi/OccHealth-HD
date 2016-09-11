(function(){
    angular.module("app")
        .directive("navBar", navBar);

    function navBar(){
        return{
            strict: "A",
            templateUrl: "/App_Scripts/Modules/OccHealth/Directives/Nav-Bar-Dir/nav-bar-template.html",
            scope:{
                navBarOptions: "="
            },
            controller: function( $scope, globalobject, $location ){
                $scope.navBar = globalobject.navBar;

                $scope.currentMenuItem = globalobject.navBar.label;

                $scope.isSame = function (dt1, dt2) {

                    return moment(dt1).isSame(dt2, 'day');
                };

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

                $scope.applyDateFilter = function () {
                    $scope.startDate = $scope.filterStartDate;
                    $scope.endDate = $scope.filterEndDate;
                    $scope.innerFilterStartDate = $scope.filterStartDate;
                    $scope.innerFilterEndDate = $scope.filterEndDate;
                    $scope.innerFilterStartDateDisplay = $scope.filterStartDate;
                    $scope.innerFilterEndDateDisplay = $scope.filterEndDate;

                    $('#filterSummary').slideUp(350);
                    //make service call
                };

                $scope.setToday = function (picker) {
                    //debugger;
                    if (picker == "inner") {
                        $scope.innerFilterStartDate = new Date();
                        $scope.innerFilterEndDate = $scope.innerFilterStartDate;
                    }
                    else if (picker == "global") {
                        $scope.filterStartDate = new Date();
                        $scope.filterEndDate = $scope.filterStartDate;
                    }
                };

                $scope.goTo = function(item){
                    //debugger;
                    if(item == undefined){
                        if(globalobject.navBar.viewId == 0){
                            $location.path("/appointmentcentral");

                        }
                        else if(globalobject.navBar.viewId == 1){
                            $location.path("/supervisorDashboard");

                        }
                        else if(globalobject.navBar.viewId == 2){
                            $location.path("/EHSDashboard");

                        }
                    }
                    else{
                        globalobject.navBar.label = item.label;
                        $location.path("/"+ item.link);
                }

                };

                $scope.menuItems = [];
                var setMenuItems = function(){

                    if(globalobject.navBar.viewId ===  0){

                        $scope.menuItems= [
                            {
                                'label': 'Appointment Central',
                                'link': 'appointmentcentral'

                            },
                            {
                                'label': 'Medical Forms',
                                'link': 'medicalforms'
                            },
                            {
                                'label': 'Inventory',
                                'link': 'inventory'
                            },
                            {
                                'label': 'Leave',
                                'link': 'leave'
                            },
                            {
                                'label': 'Restrictions',
                                'link': 'restrictions'
                            }
                            //,
                            //{
                            //    'label': 'Manage Lab Feed',
                            //    'link': 'manageLabFeed'
                            //}
                        ]
                    }
                    else if(globalobject.navBar.viewId ===  1){

                        $scope.menuItems= [
                            {
                                'label': 'Care Management',
                                'link': 'supervisorDashboard'

                            },
                            {
                                'label': 'Appointments',
                                'link': 'appointments'

                            },
                            {
                                'label': 'Encounters',
                                'link': 'encounters'
                            },
                            {
                                'label': 'Inventory',
                                'link': 'inventory'
                            },
                            {
                                'label': 'Leave',
                                'link': 'leave'
                            },
                            {
                                'label': 'Restrictions',
                                'link': 'restrictions'
                            }
                            //,
                            //{
                            //    'label': 'Manage Lab Feed',
                            //    'link': 'manageLabFeed'
                            //}
                        ]
                    }
                    else if(globalobject.navBar.viewId ===  2){

                        $scope.menuItems= [
                            {
                                'label': 'Health & Safety Dashboard',
                                'link': 'EHSDashboard'

                            },
                            {
                                'label': 'Appointments',
                                'link': 'appointments'

                            },
                            {
                                'label': 'Encounters',
                                'link': 'encounters'
                            },
                            {
                                'label': 'Action Items',
                                'link': 'actionItemGrid'
                            }
                            //,
                            //{
                            //    'label': 'Manage Lab Feed',
                            //    'link': 'manageLabFeed'
                            //}
                        ]
                    }

                };

                setMenuItems();

                $scope.gotoEmployeeProfile = function (id) {
                    $location.path("/employeemedicalprofile/");
                };

            },
            link: function( scope ){

                scope.toggleFilter = function(action){
                    if(action == undefined){
                        scope.navBarOptions.showFilterPanel = !scope.navBarOptions.showFilterPanel;

                    }
                    else if ( action === "close"){
                        scope.navBarOptions.showFilterPanel = false;

                    }
                };

            }
        }
    };
})();