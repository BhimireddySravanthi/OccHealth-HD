(function () {
    angular.module("app")
        .controller("drugAlcoholCtrl", drugAlcoholCtrl);

    function drugAlcoholCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;
        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        $scope.DrawTimet = new Date(); //$scope.hourStep + ":" + $scope.minuteStep;
        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/DATDetails" : 1019,
            resultsFormId: undefined,
            investigationFormId: undefined
        };

        $scope.showSubNavbars = true;

        var strGlobalDrugAlcoholTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;
        //        var strTestResultIdForAttachment = 1002;

        $scope.createdBy = globalobject.currentSession.userid;
        ////////////////////////////////////////////////////////////////////////////////////////////////////////OBJECT FOR DRUG ALCOHOL RECORD////////////////////////////////////
        $scope.drugAlcoholRecord = {
            DrugAlcoholTestID: strGlobalDrugAlcoholTestID,
            AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID,
            SampleID: "",
            WorkRelated: null,
            IncidentID: null,
            EncounterStatus: 1002,
            ReasonEncounterIncomplete: "",
            DiagnosticMethodID: null,
            ScheduleFollowUp: false

        };

        $scope.DATDetail = {
            DrugAlcoholTestID: 0,
            TestTypeID: 0,
            TestReasonID: "",
            ExposureTypeID: "",
            ShyBladder: false,
            ShyBladderDetail: "",
            TestResultID: "",
            TestTypeTitle: "",
            TestReasonTitle: "",
            TestResultTitle: "",
            ExposureTypeName: ""
        };

        $scope.showDATDetail = true;
        var SaveDAT = true;
        $scope.animationsEnabled = true;
        $scope.deleteElement = null;
        $scope.DATList = [];
        $scope.updateDAT = false;
        ////////////////////////////////////////////////////////////////////////////////////////////////////////END OF OBJECT FOR DRUG ALCOHOL RECORD////////////////////////////////////


        /////////////////////////////////////////////////////////////////////VALUES FOR DROPDOWN////////////////////////////////////////////////////////////////////
        $scope.FieldDisabled = false;

        $scope.TestTypeList = globalobject.TestTypeDrugAlcoholTestingList;
        $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
        $scope.ExposureTypeList = globalobject.ExposureTypeDrugAlcoholTestingList;
        $scope.TestReasonList = globalobject.TestReasonList;
        $scope.TestResultList = globalobject.TestResultList;

        //console.log($scope.TestTypeList[0].ID);
        /////////////////////////////////////////////////////////////////////END OF VALUES FOR DROPDOWN////////////////////////////////////////////////////////////////////



        /////////////////////////////////////////////////////////////////FUNCTION CALLED WHEN PAGE LOAD//////////////////////////////////////////////////

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
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalDrugAlcoholTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalExposureEncounterSummaryID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = response.data.d.Object[0].AppointmentEncounterTypeID;
                        //                        $scope.drugAlcoholRecord.DrugAlcoholTestID = strGlobalExposureEncounterSummaryID;
                        $scope.getDATDetails();
                        //$scope.getScheduleFollowUpDetails();
                        //$scope.getIncidentList();


                    });

        };
        //$scope.getEncounterDetails();
        /////////////////////////////////////////////////////////////////END OF FUNCTION CALLED WHEN PAGE LOAD//////////////////////////////////////////////////


        ///////////////////////////////////////////////////////GET DRUG ALCOHOL RECORD DETAIL/////////////////////////////////////////////////////
        $scope.getDATDetails = function () {
            //console.log(strGlobalExposureEncounterSummaryID);
            $scope.drugAlcoholRecord.DrugAlcoholTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/DATService.asmx/GetDATDetails",
                data: { DrugAlcoholTestID: strGlobalExposureEncounterSummaryID, AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID }
            };

            sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
        };

        function getDetailDataSuccess(data, status, headers, config) {
            //            console.log($scope.drugAlcoholRecord.TestTypeID);
            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                $scope.drugAlcoholRecord = data.d.Object;
                strGlobalDrugAlcoholTestID = $scope.drugAlcoholRecord.DrugAlcoholTestID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalDrugAlcoholTestID;
                if ($scope.drugAlcoholRecord.DrugAlcoholTestID == 0) {
                    $scope.drugAlcoholRecord.ScheduleFollowUp = false;
                    $scope.drugAlcoholRecord.EncounterStatus = 1002;
                }

                if (data.d.Object.DATList != null || data.d.Object.DATList != undefined || data.d.Object.DATList.length != 0) {

                    $scope.DATList = data.d.Object.DATList;
                    $scope.showDATDetail = false;
                }
                else {
                    $scope.showDATDetail = true;
                }

                if ($scope.drugAlcoholRecord.ScheduleFollowUp == true) {
                    $scope.getScheduleFollowUpDetails();
                }
                else
                    CheckForInUseIdsResults();
            }

        };

        function getDetailDataError(data, status, headers, config) {

        };

        ///////////////////////////////////////////////////////END OF DRUG ALCOHOL RECORD DETAIL/////////////////////////////////////////////////////
        $scope.resetSchedulefollwupdetails = function () {
            $scope.drugAlcoholRecord.ScheduleFollowUp = false;
        }

        //////////////////////////////////////////////////MODULE OF ADDITIONAL DETAILS///////////////////////////////////////////////////////////////////
        //        $scope.$watch('drugAlcoholRecord.ShyBladderDetail', function (newVal, oldVal) {
        //            if (newVal != undefined)
        //                if (newVal.length > 2000) {
        //                    $scope.drugAlcoholRecord.ShyBladderDetail = oldVal;
        //                }
        //        });
        ///////////////////////////////////////////////END OF MODULE OF ADDITIONAL DETAILS///////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////FUNCTION FOR SAVE DRUG ALCOHOL DETAILS/////////////////////////////////////////////////////////////

        var SelectedIndex = -1;
        $scope.saveDATDetails = function (type) {

            $scope.saveStatus = true;
            $scope.msg = '';

            //To Solve Server Date Time Issue.
            $scope.drugAlcoholRecord.DrawDate = new Date($scope.DrawDate).toDateString();

            if ($scope.ExpectedDueDate != null) {
                $scope.drugAlcoholRecord.ExpectedDueDate = new Date($scope.ExpectedDueDate).toDateString();
            }

            $scope.drugAlcoholRecord.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;


            if ($scope.showDATDetail) {

                if (($scope.DATDetail.TestTypeID == null || $scope.DATDetail.TestTypeID == 0)
                       || ($scope.DATDetail.ExposureTypeID == null || $scope.DATDetail.ExposureTypeID == 0)
                       || ($scope.DATDetail.TestReasonID == null || $scope.DATDetail.TestReasonID == 0)
                       || ($scope.DATDetail.TestResultID == null || $scope.DATDetail.TestResultID == 0)
                       || ($scope.DATDetail.ShyBladder === true && ($scope.DATDetail.ShyBladderDetail == '' || $scope.DATDetail.ShyBladderDetail == null))

                      ) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }
            }

            if (type == "All") {

                if ($scope.drugAlcoholRecord.WorkRelated != true && $scope.drugAlcoholRecord.WorkRelated != false) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                else if ($scope.drugAlcoholRecord.WorkRelated == true && ($scope.drugAlcoholRecord.IncidentID == null || $scope.drugAlcoholRecord.IncidentID == '')) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if ($scope.drugAlcoholRecord.EncounterStatus == null
                   || ($scope.drugAlcoholRecord.EncounterStatus == 1003 && ($scope.drugAlcoholRecord.ReasonEncounterIncomplete == '' || $scope.drugAlcoholRecord.ReasonEncounterIncomplete == null))) {
                    $scope.saveStatus = false;
                    $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
                }

                if ($scope.drugAlcoholRecord.ScheduleFollowUp == true) {

                    $scope.ValidateSF();
                }

                //console.log("saveStatus " + saveStatus);

                if ($scope.saveStatus) {

                    if ($scope.showDATDetail) {
                        if (!$scope.updateDAT) {
                            $scope.DATList.push($scope.DATDetail);
                        }
                        else {
                            $scope.DATList[$scope.updateIndex] = $scope.DATDetail;
                        }
                        $scope.ClearDATObject();
                        $scope.showDATDetail = false;
                    }

                    $scope.drugAlcoholRecord.DATList = [];
                    $scope.drugAlcoholRecord.DATList = $scope.drugAlcoholRecord.DATList.concat($scope.DATList);
                    $scope.showLoadingOverlay = true;
                    $scope.loadingAction = true;
                    var configs = {
                        url: "/WebServices/OccupationalHealth/EncounterTypes/DATService.asmx/SaveDATDetails",
                        data: { dATObj: $scope.drugAlcoholRecord }
                    };

                    sharedservices.xhrService(configs)
                        .success(saveDetailDataSuccess)
                        .error(saveDetailDataError);
                }
                else {
                    $scope.saveStatus = true;
                    if ($scope.msg != "") {
                        toastr.warning($scope.msg);
                    }
                }
            }

            else if (type == 'DATDetailOnly') {

                if ($scope.saveStatus) {
                    if (!$scope.updateDAT) {
                        $scope.DATList.push($scope.DATDetail);
                    }
                    else {
                        $scope.DATList[$scope.updateIndex] = $scope.DATDetail;
                    }
                    $scope.ClearDATObject();
                    $scope.showDATDetail = false;
                }
                else {
                    $scope.saveStatus = true;
                    if ($scope.msg != "") {
                        toastr.warning($scope.msg);
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
                }
            }

        };

        function saveDetailDataSuccess(data, status, headers, config) {
            if (data.d.IsOK) {

                sharedservices.parseDates(data.d.Object);
                $scope.drugAlcoholRecord.DrugAlcoholTestID = data.d.Object.DrugAlcoholTestID;
                strGlobalExposureEncounterSummaryID = data.d.Object.DrugAlcoholTestID;
                strGlobalDrugAlcoholTestID = data.d.Object.DrugAlcoholTestID;
                $scope.drugAlcoholRecord.DrugAlcoholTestID = strGlobalDrugAlcoholTestID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalDrugAlcoholTestID;
                //                $scope.drugAlcoholRecord = data.d.Object.DateSenttoLab;
                //                if ($scope.exposureUrine.SampleStatusID == '1001') { $scope.IsDisable = true; }
                //                $scope.exposureUrine.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                //                globalobject.currentEncounter.ExposureEncounterSummaryID = data.d.Object.ExposureEncounterSummaryID;
                //                globalobject.currentEncounter.SelectedEncounterTypeID = 1001;
                //                
                //                if (!globalobject.currentEncounter.FromSOAListScreen)
                //                    $scope.$parent.getEncounterAccordians();
                //                if ($scope.drugAlcoholRecord.TestResultID == strTestResultIdForAttachment) {
                //                    $scope.attachmentConfigsInit();
                //                    $scope.saveAttachments();
                //                }

                $scope.frmDAT.$dirty = false;


                if ($scope.drugAlcoholRecord.ScheduleFollowUp == false) {

                    $scope.emptySchedulefollowupObject();
                    utilityservices.notify("saved");
                }

                if ($scope.drugAlcoholRecord.ScheduleFollowUp == true) {
                    $scope.saveScheduleFollowUpDetails();
                }
                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                }
            }
        };

        function saveDetailDataError(data, status, headers, config) {
            $scope.showLoadingOverlay = false;
            $scope.loadingAction = false;
        };
        //////////////////////////////////////////////////////END OF SAVE DRUG ALCOHOL DETAILS/////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        //**************** Get Incident list*******************************************************************

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
                    .error(function (data, status, headers, config) {

                    });
        }

        $scope.getIncidentList();
        //****************End Incident list*******************************************************************


        //////////////////////////////////////////////////////////////////////////
        //***************************CODE FOR DATA BINDING*********************//
        function CheckForInUseIdsResults() {
            //console.log(strGlobalDrugAlcoholTestID);
            if (strGlobalDrugAlcoholTestID == 0)
                return;
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';
            if ($scope.drugAlcoholRecord.TestTypeID != null && $scope.drugAlcoholRecord.TestTypeID != 0) {
                for (i = $scope.TestTypeList.length - 1; i > -1; i--) {
                    if ($scope.TestTypeList[i].ID === $scope.drugAlcoholRecord.TestTypeID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlTestTypeList').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.drugAlcoholRecord.TestTypeID + '" selected="selected" >' + $scope.drugAlcoholRecord.TestTypeTitle + '</option>';
                    $('#ddlTestTypeList').html(innerHTML);
                }
            }



            c = 0;
            if ($scope.drugAlcoholRecord.ExposureTypeID != null && $scope.drugAlcoholRecord.ExposureTypeID != 0) {
                for (i = $scope.ExposureTypeList.length - 1; i > -1; i--) {
                    if ($scope.ExposureTypeList[i].ID === $scope.drugAlcoholRecord.ExposureTypeID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlTestingMethodList').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.drugAlcoholRecord.ExposureTypeID + '" selected="selected" >' + $scope.drugAlcoholRecord.ExposureTypeName + '</option>';
                    $('#ddlTestingMethodList').html(innerHTML);
                }
            }


            c = 0;
            if ($scope.drugAlcoholRecord.TestReasonID != null && $scope.drugAlcoholRecord.TestReasonID != 0) {
                for (i = $scope.TestReasonList.length - 1; i > -1; i--) {
                    if ($scope.TestReasonList[i].ID === $scope.drugAlcoholRecord.TestReasonID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlReasonForTestingList').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.drugAlcoholRecord.TestReasonID + '" selected="selected" >' + $scope.drugAlcoholRecord.TestReasonTitle + '</option>';
                    $('#ddlReasonForTestingList').html(innerHTML);
                }
            }

            c = 0;
            if ($scope.drugAlcoholRecord.TestResultID != null && $scope.drugAlcoholRecord.TestResultID != 0) {
                for (i = $scope.TestResultList.length - 1; i > -1; i--) {
                    if ($scope.TestResultList[i].ID === $scope.drugAlcoholRecord.TestResultID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlResultList').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.drugAlcoholRecord.TestResultID + '" selected="selected" >' + $scope.drugAlcoholRecord.TestResultTitle + '</option>';
                    $('#ddlResultList').html(innerHTML);
                }
            }


            c = 0;
            if ($scope.drugAlcoholRecord.DiagnosticMethodID != null && $scope.drugAlcoholRecord.DiagnosticMethodID != 0) {
                for (i = $scope.DiagnosticMethodList.length - 1; i > -1; i--) {
                    if ($scope.DiagnosticMethodList[i].ID === $scope.drugAlcoholRecord.DiagnosticMethodID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlReferredForList').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.drugAlcoholRecord.DiagnosticMethodID + '" selected="selected" >' + $scope.drugAlcoholRecord.DiagnosticMethodTitle + '</option>';
                    $('#ddlReferredForList').html(innerHTML);
                }
            }



            //console.log('called userid');
            if ($scope.drugAlcoholRecord.TestTypeID != null && $scope.drugAlcoholRecord.TestTypeID != 0)
                setTimeout(function () { $('#ddlTestTypeList').val($scope.drugAlcoholRecord.TestTypeID); }, 1000);
            if ($scope.drugAlcoholRecord.ExposureTypeID != null && $scope.drugAlcoholRecord.ExposureTypeID != 0)
                setTimeout(function () { $('#ddlTestingMethodList').val($scope.drugAlcoholRecord.ExposureTypeID); }, 1000);
            if ($scope.drugAlcoholRecord.TestReasonID != null && $scope.drugAlcoholRecord.TestReasonID != 0)
                setTimeout(function () { $('#ddlReasonForTestingList').val($scope.drugAlcoholRecord.TestReasonID); }, 1000);
            if ($scope.drugAlcoholRecord.TestResultID != null && $scope.drugAlcoholRecord.TestResultID != 0)
                setTimeout(function () { $('#ddlResultList').val($scope.drugAlcoholRecord.TestResultID); }, 1000);
            if ($scope.drugAlcoholRecord.DiagnosticMethodID != null && $scope.drugAlcoholRecord.DiagnosticMethodID != 0)
                setTimeout(function () { $('#ddlReferredForList').val($scope.drugAlcoholRecord.DiagnosticMethodID); }, 1000);
            //setTimeout(function () { $('#ddlResultPermissibleRange').val($scope.results.ResultPermissibleRangeID); }, 1000);
        }

        //////////////////////////////////////////////////////////////////////////
        //***************************END OF CODE FOR DATA BINDING*********************//



        /////////////////////////////////FUNCTION FOR CANCEL DRUG AND ALCOHOL DETAILS////////////////////////////////////

        $scope.cancelDATDetails = function () {

            if ($scope.frmDAT.$dirty) {

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

        /////////////////////////////////END CANCEL DRUG AND ALCOHOL DETAILS////////////////////////////////////

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.ClearDATObject = function () {

            $scope.DATDetail = null;
            $scope.DATDetail = {
                DrugAlcoholTestID: 0,
                SampleID: "",
                TestTypeID: 0,
                TestReasonID: "",
                IncidentID: null,
                ExposureTypeID: "",
                ShyBladder: null,
                ShyBladderDetail: "",
                TestResultID: "",
                TestTypeTitle: "",
                TestReasonTitle: "",
                TestResultTitle: "",
                ExposureTypeName: ""
            };
        }

        $scope.addDrugAlcohol = function () {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'AddDATCtrl',
                size: 'sm',
                scope: $scope
            });
        }

        $scope.SaveToDrugAlcoholList = function () {

        };

        $scope.SelectDAT = function (element, index) {
            $scope.updateDAT = true;


            $scope.DATDetail = element;
            $scope.showDATDetail = true;
            $scope.updateIndex = index;
            SelectedIndex = index;

        }

        $scope.deleteElement = null;

        $scope.removeDAT = function (item) {

            $scope.item = item;

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                controller: 'DeleteDATCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.AddDATDetail = function () {
            var noModal = false;
            if ($scope.showDATDetail) {
                noModal = true;
            }

            if (noModal) {
                return false;
            }
            else {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'AddDATCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }
        };

        $scope.discardDATDetail = function (type) {
            $scope.AMType = type;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'DiscardDATDetailsCtrl',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.funGetLookupName = function (type) {
            if (type == 1) {
                $scope.DATDetail.TestTypeTitle = $('#ddlTestTypeList').find("option:selected").text().trim();
            }
            else if (type == 2) {
                $scope.DATDetail.ExposureTypeName = $('#ddlTestingMethodList').find("option:selected").text().trim();
            }
            else if (type == 3) {
                $scope.DATDetail.TestReasonTitle = $('#ddlReasonForTestingList').find("option:selected").text().trim();
            }
            else if (type == 4) {
                $scope.DATDetail.TestResultTitle = $('#ddlResultList').find("option:selected").text().trim();
            }
        }
        /////Ends Here ////
    };
})();

