//common module will be linked to shred controllers
angular.module("app")

.controller('ModalInstanceCtrl', [
	'$scope', 'sharedservices',
	function ($scope,sharedservices) {

    $scope.picklistEmployeeSelected = undefined;
     
    //get appointments
    var configs = {
      method: "GET"
      , url: "/Data/employee.json"
    };
    sharedservices.xhrService(configs)
    .success(function (data, status, headers, config) {
        $scope.picklistEmployees = data.Employees.Object;
        //$log.log("success")
    })
    .error(function () {
        $log.log("error")
    })

	}
])