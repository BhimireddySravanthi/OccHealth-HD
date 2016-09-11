
angular.module("app")
       .controller("ohClinicNotesDetails", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject","translations",
        function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations) {

            $scope.clinicnote = {
                EnCounterID: 0
                , EnCounterClinicNoteID: 0
                , ClinicNoteAttachment: ""
                , ClinicNoteComment: ""
                , ClinicNoteLock: false
                , HealthCareProvider: "Dr. Smiths"
                , ClinicNoteDate: new Date(2015, 7, 5)
                , ClinicNoteHour: ""
                , ClinicNoteMin: ""
                , ClinicNoteTime: "" /*ClinicNoteHour + '-' + ClinicNoteMin*/
                , CreatedBy : 0
            };

            /*Array used to show hide form sections base on user input*/
            $scope.showHideSectionList = [true];

            $scope.showFormEdit = true;
            $scope.editForm = function (bool) {
                $scope.showFormEdit = bool;
            };

            $scope.EnCounterID = globalobject.ClinicNote.EncounterDetailID;
            $scope.clinicnote.EnCounterClinicNoteID = globalobject.ClinicNote.EnCounterClinicNoteID;

            /*Method to show hide the form section using the index passed as a parameter*/
            $scope.showHideFormSection = function (indexToShowHide) {
                $scope.showHideSectionList[indexToShowHide] = !$scope.showHideSectionList[indexToShowHide];
            };

            $scope.getClinicNotesDetails = function () {


                var configs = {
                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectClinicNote",
                    data: { EncounterDetailID: $scope.EnCounterID, ClinicNoteID: $scope.clinicnote.EnCounterClinicNoteID }
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);
                   
                   if (data.d.IsOK) {

                       $scope.clinicnote = data.d.Object;
                       $scope.EnCounterID = globalobject.ClinicNote.EncounterDetailID;
                       $scope.clinicnote.EnCounterClinicNoteID = globalobject.ClinicNote.EnCounterClinicNoteID;

                       $scope.clinicnote.ClinicNoteHour = $scope.clinicnote.ClinicNoteTime.split(':')[0];
                       $scope.clinicnote.ClinicNoteMin = $scope.clinicnote.ClinicNoteTime.split(':')[1];
                   }


                   $log.log("Clinic Note call Success...");
               })
               .error(function () {
                   $log.log("error")
               })
            };

            $scope.saveClinicNotesDetails = function () {
                var saveStatus = true;
                $scope.clinicnote.ClinicNoteTime = $scope.clinicnote.ClinicNoteHour + ':' + $scope.clinicnote.ClinicNoteMin;
                if ($scope.clinicnote.ClinicNoteDate == '' || ($scope.clinicnote.ClinicNoteComment == '' || $scope.clinicnote.ClinicNoteComment == null)  || $scope.clinicnote.ClinicNoteTime == '') {
                    saveStatus = false;
                }

                if (saveStatus) {
                    var configs = {
                        url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveClinicNote",
                        data: { ClinicNotesObj: $scope.clinicnote, EncounterDetailID: $scope.EnCounterID }
                    };
                    sharedservices.xhrService(configs)
                  .success(saveDataSuccess)
                  .error(saveDataError);
                }

                else
                    toastr.error("Please enter all the mandatory fields");
            };

            function saveDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {
                    toastr.success('Data has been Saved Successfully');
                }
                else {
                    toastr.warning("you are somewhere wrong")
                }

            };
            function saveDataError(data, status, headers, config) {
                console.log("call failed...");
            };

            $scope.closeForm = function () {
                reloadParent(); // CloseModalPopup();
            };

            function getDataSuccess(data, status, headers, config) {

                if (data.d.IsOK) {

                    console.log("call Success...");
                    sharedservices.parseDates(data.d.Object);
                    $scope.clinicnote = data.d.Object;
                }

            };


            function getDataError(data, status, headers, config) {
                console.log("call failed...");
            };


        } ]);


