(function () {
    angular.module("app")
        .controller("fitTestingCtrl", fitTestingCtrl);

    function fitTestingCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.        
        $scope.navBarOptions = {
            detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/FitTestDetails" : 1005,
            resultsFormId: undefined,
            investigationFormId: undefined
        };
        $scope.showSubNavbars = true;
        $scope.IsDisable = false;
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;
        $scope.DrawTimet = new Date(); //$scope.hourStep + ":" + $scope.minuteStep;

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }

        var strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
        var fitTestEquipmentCategoryID = 1002;
        $scope.createdBy = globalobject.currentSession.userid;
        $scope.IsDisable = false;
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Page Object Initialization********************************************

        $scope.fitTestDetails = {
            ExposureEncounterSummaryID: strGlobalExposureEncounterSummaryID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , SampleID: ""
            , WorkRelated: null
            , IncidentID: null
            , ExerciseDetailID: null
            , TrainingCompleted: null
            , WasRespiratorRequired: null
            , ManufactureDetailID: null
            , EquipmentTypeID: null
            , EquipmentModelID: null
            , EquipmentSizeID: null
            , OverallFitFactor: null
            , OverallResult: null
            , ReasonForFailure: ""
            , FitTestNote: ""
            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: null
            , ScheduleFollowUp: false
            , StatusTypeID: null
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Lookup List Bind******************************************************
        $scope.RespiratorManufacturer = globalobject.ManufactureDetailList;
        $scope.RespiratorModel = globalobject.EquipmentModelList;
        $scope.RespiratorType = globalobject.EquipmentTypeList;
        $scope.TestTypeList = globalobject.TestTypeList;
        $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
        $scope.ExerciseDetailList = globalobject.ExerciseDetailList;
        $scope.EquipmentSizeList = globalobject.EquipmentSizeList;

        //        console.log($scope.RespiratorManufacturer);
        //        console.log($scope.RespiratorModel);
        //        console.log($scope.RespiratorType);

        var OriginalRespiratorManufacturerList = [];
        var OriginalRespiratorTypeList = [];
        var OriginalRespiratorModelList = [];
        angular.copy($scope.RespiratorManufacturer, OriginalRespiratorManufacturerList);
        angular.copy($scope.RespiratorModel, OriginalRespiratorModelList);
        angular.copy($scope.RespiratorType, OriginalRespiratorTypeList);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Function to Get the Initial Details***********************************
        $scope.getEncounterDetails = function () {
            globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);

            globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

            var configs = {
                url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID",
                data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
            };
            sharedservices.xhrService(configs)
                    .then(function (response) {
                        globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                        globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                        globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        //$scope.getFitTestDetails();
                        $scope.getIncidentList();
                        $scope.getEquipmentDetails();
                    });
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Getting Fit Test Details******************************************************
        $scope.getFitTestDetails = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/FitTestService.asmx/GetFitTestDetails",
                data: { FitTestID: strGlobalExposureEncounterSummaryID, AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID }
            };

            sharedservices.xhrService(configs)
            .success(getFitTestDetailsSuccess)
            .error(function (data, status, headers, config) { });
        };
        function getFitTestDetailsSuccess(data, status, headers, config) {

            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                $scope.fitTestDetails = data.d.Object;
                strGlobalExposureEncounterSummaryID = $scope.fitTestDetails.FitTestID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalExposureEncounterSummaryID;

                if ($scope.fitTestDetails.EncounterStatus == null || $scope.fitTestDetails.EncounterStatus == undefined || isNaN($scope.fitTestDetails.EncounterStatus)) {
                    $scope.fitTestDetails.EncounterStatus = 1002;               //Default 'Yes'
                }
                var tempEquipmentTypeID = $scope.fitTestDetails.EquipmentTypeID;
                var tempEquipmentModelID = $scope.fitTestDetails.EquipmentModelID;
                if ($scope.fitTestDetails.FitTestID != 0) {
                    $scope.populateEquipmentTypeAndModel();
                    //console.log(tempEquipmentTypeID);
                    //console.log(tempEquipmentModelID);
                    //                    $timeout(function () {
                    $scope.fitTestDetails.EquipmentTypeID = tempEquipmentTypeID;
                    $scope.fitTestDetails.EquipmentModelID = tempEquipmentModelID;
                    //                        console.log("this");
                    //                    }, 1000);
                    CheckForInUseIdsDetails();
                }
                if (strGlobalExposureEncounterSummaryID != 0 && $scope.fitTestDetails.ScheduleFollowUp) {
                    $scope.getScheduleFollowUpDetails();
                }
                //CheckForInUseIdsDetails();
            }
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Incident List*********************************************************
        $scope.getIncidentList = function () {
            var configs = {
                url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentList",
                data: { EmployeeType: globalobject.employee.EmployeeType, EmployeePK: globalobject.employee.ID, LocationID: globalobject.employee.LocationId }
            };
            sharedservices.xhrService(configs)
                     .success(function (data, status, headers, config) {
                         if (data.d.IsOK) {
                             $scope.incidentList = data.d.Object;
                         }
                     })
                     .error(function (data, status, headers, config) { });
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Get Equipment Details*************************************************
        $scope.getEquipmentDetails = function () {
            var configs = {
                url: "/WebServices/OccupationalHealth/Inventory/EquipmentService.asmx/GetEquipmentDetails",
                data: { EquipmentCategoryID: fitTestEquipmentCategoryID}         //For Fit Test: 1002
            };
            sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.EquipmentDetailList = data.d.Object;
                        //                        angular.forEach($scope.EquipmentDetailList, function (EquipmentData, dataIndex) {
                        //                            angular.forEach(OriginalRespiratorManufacturerList, function (ManufacturerData, dataIndex) {
                        //                                if (EquipmentData.ManufacturerName.toLowerCase() === ManufacturerData.Text.toLowerCase()) {
                        //                                    EquipmentData.ManufactureDetailID = ManufacturerData.ID;
                        //                                }
                        //                            });
                        //                            angular.forEach(OriginalRespiratorTypeList, function (RespiratorTypeData, dataIndex) {
                        //                                if (EquipmentData.EquipmentTypeName.toLowerCase() === RespiratorTypeData.Text.toLowerCase()) {
                        //                                    EquipmentData.EquipmentTypeID = RespiratorTypeData.ID;
                        //                                }
                        //                            });
                        //                            angular.forEach(OriginalRespiratorModelList, function (RespiratorModelData, dataIndex) {
                        //                                if (EquipmentData.ModelName.toLowerCase() === RespiratorModelData.Text.toLowerCase()) {
                        //                                    EquipmentData.EquipmentModelID = RespiratorModelData.ID;
                        //                                }
                        //                            });
                        //                        });
                        console.log($scope.EquipmentDetailList);
                        $scope.getFitTestDetails();
                    }
                })
                .error(function (data, status, headers, config) { });
        }

        $scope.resetSchedulefollwupdetails = function () {
            $scope.fitTestDetails.ScheduleFollowUp = false;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Saving the Fit Test Model Changes*************************************
        $scope.saveFitTestDetails = function () {
            $scope.saveStatus = true;
            $scope.msg = '';
            //Validation of mandatory field
            if ($scope.fitTestDetails.WorkRelated != true && $scope.fitTestDetails.WorkRelated != false) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.ExerciseDetailID == null || $scope.fitTestDetails.ExerciseDetailID == undefined || $scope.fitTestDetails.ExerciseDetailID == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.ManufactureDetailID == null || $scope.fitTestDetails.ManufactureDetailID == undefined || $scope.fitTestDetails.ManufactureDetailID == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.EquipmentTypeID == null || $scope.fitTestDetails.EquipmentTypeID == undefined || $scope.fitTestDetails.EquipmentTypeID == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.EquipmentModelID == null || $scope.fitTestDetails.EquipmentModelID == undefined || $scope.fitTestDetails.EquipmentModelID == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.EquipmentSizeID == null || $scope.fitTestDetails.EquipmentSizeID == undefined || $scope.fitTestDetails.EquipmentSizeID == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.OverallFitFactor == null || $scope.fitTestDetails.OverallFitFactor == undefined || $scope.fitTestDetails.OverallFitFactor == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.OverallResult == null || $scope.fitTestDetails.OverallResult == undefined || $scope.fitTestDetails.OverallResult == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.EncounterStatus == null || $scope.fitTestDetails.EncounterStatus == undefined || $scope.fitTestDetails.EncounterStatus == "") {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            //If encounter status is selected as 'not completed' then only validate this field
            if (($scope.fitTestDetails.EncounterStatus == 1003) && ($scope.fitTestDetails.ReasonEncounterIncomplete == null || $scope.fitTestDetails.ReasonEncounterIncomplete == undefined || $scope.fitTestDetails.ReasonEncounterIncomplete == "")) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.fitTestDetails.ScheduleFollowUp) {//Validate only if the schedule follow up value is set to 'yes'                                

                $scope.ValidateSF();
            }

            $scope.fitTestDetails.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
            if ($scope.saveStatus) {
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;
                var configs =
                {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/FitTestService.asmx/SaveFitTestDetails",
                    data: { FitTestResultsObj: $scope.fitTestDetails }
                };

                sharedservices.xhrService(configs)
                  .success(saveDetailDataSuccess)
                  .error(function (data, status, headers, config) {
                      $scope.showLoadingOverlay = false;
                      $scope.loadingAction = false;
                  });
            }
            else {
                $scope.saveStatus = true;
                if ($scope.msg != "") {
                    toastr.warning($scope.msg);
                }
            }
        }

        function saveDetailDataSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                strGlobalExposureEncounterSummaryID = data.d.Object.FitTestID;              //This is used as a referrence key for schedule follow up entity
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalExposureEncounterSummaryID;
                $scope.frmFitTesting.$dirty = false;

                if ($scope.fitTestDetails.ScheduleFollowUp == false) {
                    $scope.emptySchedulefollowupObject();
                }

                if ($scope.fitTestDetails.ScheduleFollowUp) {//Save schedule follow up details only if the general details are saved succesfully and schedule follow up is selected as 'yes'
                    $scope.saveScheduleFollowUpDetails();
                }
                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    if ($scope.fitTestDetails.ScheduleFollowUp == false) {
                        utilityservices.notify("saved");
                    }
                }
            }
        }

        function CheckForInUseIdsDetails() {
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';
            c = 0;

            if ($scope.fitTestDetails.EquipmentTypeID != null) {
                innerHTML = $('#ddlRespiratorType').html();
                innerHTML = '';

                for (i = $scope.RespiratorType.length - 1; i > -1; i--) {
                    if ($scope.RespiratorType[i].ID === $scope.fitTestDetails.EquipmentTypeID) {
                        c++;
                        innerHTML = innerHTML + ' <option value="' + $scope.RespiratorType[i].ID + '" selected="selected" >' + $scope.RespiratorType[i].Text + '</option> ';
                    }
                    else {
                        innerHTML = innerHTML + ' <option value="' + $scope.RespiratorType[i].ID + '" selected="selected" >' + $scope.RespiratorType[i].Text + '</option> ';
                    }
                }
                $('#ddlRespiratorType').html(innerHTML);
            }
            else {
                innerHTML = $('#ddlRespiratorType').html();
                innerHTML = '';
                for (i = $scope.RespiratorType.length - 1; i > -1; i--) {
                    innerHTML = innerHTML + ' <option value="' + $scope.RespiratorType[i].ID + '" selected="selected" >' + $scope.RespiratorType[i].Text + '</option> ';
                }
                $('#ddlRespiratorType').html(innerHTML);
            }

            //For RespiratorModel
            c = 0;
            if ($scope.fitTestDetails.EquipmentModelID != null) {
                innerHTML = $('#ddlRespiratorModel').html();
                innerHTML = '';
                for (i = $scope.RespiratorModel.length - 1; i > -1; i--) {
                    if ($scope.RespiratorModel[i].ID === $scope.fitTestDetails.EquipmentModelID) {
                        c++;
                        innerHTML = innerHTML + ' <option value="' + $scope.RespiratorModel[i].ID + '" selected="selected" >' + $scope.RespiratorModel[i].Text + '</option> ';
                    }

                    else {

                        innerHTML = innerHTML + ' <option value="' + $scope.RespiratorModel[i].ID + '" selected="selected" >' + $scope.RespiratorModel[i].Text + '</option> ';
                    }

                }

                $('#ddlRespiratorModel').html(innerHTML);
            }
            else {
                innerHTML = $('#ddlRespiratorModel').html();
                innerHTML = '';
                for (i = $scope.RespiratorModel.length - 1; i > -1; i--) {
                    innerHTML = innerHTML + ' <option value="' + $scope.RespiratorModel[i].ID + '" selected="selected" >' + $scope.RespiratorModel[i].Text + '</option> ';
                }
                $('#ddlRespiratorModel').html(innerHTML);
            }

            setTimeout(function () { $('#ddlRespiratorType').val($scope.fitTestDetails.EquipmentTypeID); }, 1000);
            setTimeout(function () { $('#ddlRespiratorModel').val($scope.fitTestDetails.EquipmentModelID); }, 1000);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Cancel the changes made to the model**********************************

        $scope.cancelFitTestDetails = function () {

            if ($scope.frmFitTesting.$dirty) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'CancelModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }

            else {
                if (globalobject.currentEncounter.FromSOAListScreen) {
                    sharedservices.reloadParent();
                }
                else {
                    if (globalobject.RedirectFrom == 'Encounter')
                        $location.path("/appointmentcentral");

                    else if (globalobject.RedirectFrom == 'EmployeeMedicalProfile')
                        $location.path("/employeemedicalprofile");

                }

            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Update overall result as per the bussiness rule(FSD)******************
        $scope.updateOverallResultFromFitFactor = function () {
            //Discussed with Bibhuti and changed for EquipmentTypeID
            //$scope.fitTestDetails.OverallResult = null;     //No selection
            //$scope.fitTestDetails.OverallResult = 1000;     //Pass
            //$scope.fitTestDetails.OverallResult = 1001;     //Fail
            if ($scope.fitTestDetails.EquipmentTypeID == 1000) {//For dust mask, no overall result
                $scope.fitTestDetails.OverallResult = null;
            }

            if ($scope.fitTestDetails.EquipmentTypeID == 1001) {
                if ($scope.fitTestDetails.OverallFitFactor == 500) {//For full mask, if overall fit factor is 500 then result should be pass
                    $scope.fitTestDetails.OverallResult = 1000;
                }
                if ($scope.fitTestDetails.OverallFitFactor == 100) {//For full mask, if overall fit factor is 100 then result should be fail
                    $scope.fitTestDetails.OverallResult = 1001;
                }
            }

            if ($scope.fitTestDetails.EquipmentTypeID == 1002) {//For half mask, if either of the values is selected for overall fit factor,then result should be pass
                if ($scope.fitTestDetails.OverallFitFactor == 500 || $scope.fitTestDetails.OverallFitFactor == 100) {
                    $scope.fitTestDetails.OverallResult = 1000;
                }
            }
            //            console.log($scope.fitTestDetails.EquipmentModelID);
            //            if ($scope.fitTestDetails.EquipmentModelID != null && $scope.fitTestDetails.EquipmentModelID != undefined && $scope.fitTestDetails.EquipmentModelID != '') {
            //                console.log("can be called");
            //                $scope.populateEquipmentModel();
            //            }
        }

        $scope.updateOverallResult = function () {
            //$scope.fitTestDetails.OverallResult = null;     //No selection
            //$scope.fitTestDetails.OverallResult = 1000;     //Pass
            //$scope.fitTestDetails.OverallResult = 1001;     //Fail

            //EquipmentTypeID for Dust Mask: 1006
            //EquipmentTypeID for Full Face: 1007
            //EquipmentTypeID for Half Face: 1008
            if ($scope.fitTestDetails.EquipmentTypeID == 1006) {//For dust mask, no overall result
                $scope.fitTestDetails.OverallResult = null;
            }

            if ($scope.fitTestDetails.EquipmentTypeID == 1007) {
                if ($scope.fitTestDetails.OverallFitFactor == 500) {//For full mask, if overall fit factor is 500 then result should be pass
                    $scope.fitTestDetails.OverallResult = 1000;
                }
                if ($scope.fitTestDetails.OverallFitFactor == 100) {//For full mask, if overall fit factor is 100 then result should be fail
                    $scope.fitTestDetails.OverallResult = 1001;
                }
            }

            if ($scope.fitTestDetails.EquipmentTypeID == 1008) {//For half mask, if either of the values is selected for overall fit factor,then result should be pass
                if ($scope.fitTestDetails.OverallFitFactor == 500 || $scope.fitTestDetails.OverallFitFactor == 100) {
                    $scope.fitTestDetails.OverallResult = 1000;
                }
            }
            //console.log($scope.fitTestDetails.EquipmentModelID);
            //if ($scope.fitTestDetails.EquipmentModelID != null && $scope.fitTestDetails.EquipmentModelID != undefined && $scope.fitTestDetails.EquipmentModelID != '') {
            //    console.log("can be called");
            $scope.populateEquipmentModel();
            //}
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //*****************************Update Manufacture Related Fields*************************************
        $scope.populateEquipmentTypeAndModel = function () {
            $scope.RespiratorType = [];
            $scope.RespiratorModel = [];
            var typeIdListUsed = [];
            var modelIdListUsed = [];
            angular.forEach($scope.EquipmentDetailList, function (data, dataIndex) {
                if ($scope.fitTestDetails.ManufactureDetailID.toString() === data.ManufacturerDetaillD.toString()) {
                    var indexOfCurrentTypeId = typeIdListUsed.indexOf(data.EquipmentTypeID);
                    var indexOfCurrentModelId = modelIdListUsed.indexOf(data.EquipmentModelID);
                    if (indexOfCurrentTypeId == -1) {//Insert record that is not in the list yet
                        var tempRecordEquipmentType = {};
                        tempRecordEquipmentType.ID = data.EquipmentTypeID;
                        tempRecordEquipmentType.Text = data.EquipmentTypeName;
                        $scope.RespiratorType.push(tempRecordEquipmentType);
                        typeIdListUsed.push(tempRecordEquipmentType.ID);
                    }

                    if (indexOfCurrentModelId == -1) {//Insert record that is not in the list yet
                        var tempRecordEquipmentModel = {};
                        tempRecordEquipmentModel.ID = data.EquipmentModelID;
                        tempRecordEquipmentModel.Text = data.ModelName;
                        $scope.RespiratorModel.push(tempRecordEquipmentModel);
                        modelIdListUsed.push(tempRecordEquipmentModel.ID);
                    }

                }
            });
            $scope.fitTestDetails.EquipmentTypeID = null;
            $scope.fitTestDetails.EquipmentModelID = null;
            //            if ($scope.RespiratorType.length > 0) {
            //                $scope.fitTestDetails.EquipmentTypeID = $scope.RespiratorType[0].ID;
            //            }
            console.log("Respirator Type");
            console.log($scope.RespiratorType);
            console.log("Respirator Model");
            console.log($scope.RespiratorModel);
            CheckForInUseIdsDetails();
        }

        $scope.populateEquipmentModel = function () {
            $scope.RespiratorModel = [];
            var modelIdListUsed = [];
            angular.forEach($scope.EquipmentDetailList, function (data, dataIndex) {
                if (($scope.fitTestDetails.ManufactureDetailID.toString() === data.ManufacturerDetaillD.toString()) && ($scope.fitTestDetails.EquipmentTypeID.toString() === data.EquipmentTypeID.toString())) {
                    var indexOfCurrentModelId = modelIdListUsed.indexOf(data.EquipmentModelID);
                    if (indexOfCurrentModelId == -1) {
                        var tempRecordEquipmentModel = {};
                        tempRecordEquipmentModel.ID = data.EquipmentModelID;
                        tempRecordEquipmentModel.Text = data.ModelName;
                        $scope.RespiratorModel.push(tempRecordEquipmentModel);
                        modelIdListUsed.push(tempRecordEquipmentModel.ID);
                    }
                }
            });
            $scope.fitTestDetails.EquipmentModelID = null;
            //console.log("Respirator Model");
            //console.log($scope.RespiratorModel);
        }
    };

})();

