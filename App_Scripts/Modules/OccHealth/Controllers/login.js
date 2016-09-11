angular.module("app")
    .controller("loginCtrl", ["$log", "$scope", "$location", "sharedservices", "translations", "globalobject", "toastr", function ($log, $scope, $location, sharedservices, translations, globalobject, toastr) {
        //before screen change we can fetch global settings

        $scope.userinfo = {
            userid: 1000,
            username: "",
            password: ""
        };

        $scope.xhrInProgress = false;
        globalobject.currentSession.userid=0;
        $scope.logincheck = function () {



            $location.path("/userNav");
            //var frmData;
            //$scope.xhrInProgress = true;
            //frmData = $("#frmlogin").serializeArray();
            //$.ajax({
            //    type: "POST",
            //    url: "/App_Scripts/Login/logincheck.asp",
            //    data: frmData
            //})
            //    .done(function (data, msg, xhr) {
            //        $scope.xhrInProgress = false;
            //        if (data.length > 8) {
            //            globalobject.currentSession.userid=1000;
            //            $scope.changeScreen(data);
            //        } else {
            //            if (data == "Pfailed") {
            //                toastr.error("Invalid Password", "Oops!")
            //            } else if (data == "Ufailed") {
            //                toastr.error("Invalid Username", "Oops!")
            //            } else {
            //                toastr.error("Invalid Credentials", "Oops!")
            //            }
            //        }
            //    })
            //    .fail(function (xhr, msg, err) {
            //        $scope.xhrInProgress = false;
            //        toastr.error("Some error occurred", "Error!");
            //    });
        }

        //a screen changer function to be defined .
        $scope.changeScreen = function (screenPath) {
            $location.path(screenPath);
            $location.replace();
        };
    }])