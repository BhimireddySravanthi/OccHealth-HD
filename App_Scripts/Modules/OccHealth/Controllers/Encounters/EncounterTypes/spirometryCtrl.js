(function () {
    angular.module("app")
        .controller("spirometryCtrl", spirometryCtrl);

    function spirometryCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        $scope.changeSubView = sharedservices.changeSubView;

        $scope.globalobject = globalobject;

        // Setting Options to be used by the encounter type nav bar such as ids to redirect to, etc.
        $scope.navBarOptions = {
            detailsFormId: 1021
        };

        $scope.showSubNavbars = true;
        $scope.IsDisable = false;


        $scope.myDate = new Date();

        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        $scope.DrawTimet = new Date();

        var strGlobalSpirometryTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
        //var strGlobalSpirometryTestID = globalobject.currentEncounter.SpirometryTestID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;

        var strEquipmentCategoryID = 1003; //For Spirometer.
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //*************Setting all drop down values in local scope from global scope**********************

        $scope.TestTypeList = globalobject.TestTypeSpirometryList;
        $scope.EthnicityList = globalobject.EthnicityList;
        $scope.DispositionTypeList = globalobject.DispositionTypeList;
        $scope.ActivityStatusList = globalobject.ActivityStatusList;
        $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
        $scope.HeightUOMList = globalobject.HeightUOMList;
        $scope.WeightUOMList = globalobject.WeightUOMList;


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///************************ Spirometer Serial # type ahead code ***********************************************
        $scope.spirometerSerialNumbers = [
        { name: "Alabama", id: 1 },
        { name: "Alaska", id: 2 },
        { name: "Arizona", id: 3}]
        // "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia dgdf", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];


        $scope.createdBy = globalobject.currentSession.userid;

        //////////////////////////////////////////////////////////////////////////////////////////////////
        //*********Check if any saved record has dropdown value,which is no more in global list***********

        function CheckForInUseIdsDetails() {
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';

            //For TestTypeTitle

            if ($scope.spirometryRecord.TestTypeID != null) {
                for (i = $scope.TestTypeList.length - 1; i > -1; i--) {
                    if ($scope.TestTypeList[i].ID === $scope.spirometryRecord.TestTypeID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlTestType').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.spirometryRecord.TestTypeID + '" selected="selected" >' + $scope.spirometryRecord.TestTypeTitle + '</option>';
                    $('#ddlTestType').html(innerHTML);
                }
            }

            //Ethnicity

            c = 0;
            if ($scope.spirometryRecord.EthnicityID != null) {
                for (i = $scope.EthnicityList.length - 1; i > -1; i--) {
                    if ($scope.EthnicityList[i].ID === $scope.spirometryRecord.EthnicityID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlEthnicity').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.spirometryRecord.EthnicityID + '" selected="selected" >' + $scope.spirometryRecord.Ethnicity + '</option>';
                    $('#ddlEthnicity').html(innerHTML);

                }
            }


            //DispositionTypeTitle
            c = 0;
            if ($scope.spirometryRecord.DispositionTypeID != null) {
                for (i = $scope.DispositionTypeList.length - 1; i > -1; i--) {
                    if ($scope.DispositionTypeList[i].ID === $scope.spirometryRecord.DispositionTypeID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlDisposition').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.spirometryRecord.DispositionTypeID + '" selected="selected" >' + $scope.spirometryRecord.DispositionTypeTitle + '</option>';
                    $('#ddlDisposition').html(innerHTML);
                }
            }


            //DiagnosticMethodTitle
            c = 0;
            if ($scope.spirometryRecord.DiagnosticMethodID != null) {
                for (i = $scope.DiagnosticMethodList.length - 1; i > -1; i--) {
                    if ($scope.DiagnosticMethodList[i].ID === $scope.spirometryRecord.DiagnosticMethodID) {
                        c++;
                    }
                }
                if (c == 0) {
                    innerHTML = $('#ddlDiagnostic').html();
                    innerHTML = innerHTML.replace(ddlReplace, "");
                    innerHTML = innerHTML + '<option value="' + $scope.spirometryRecord.DiagnosticMethodID + '" selected="selected" >' + $scope.spirometryRecord.DiagnosticMethodTitle + '</option>';
                    $('#ddlDiagnostic').html(innerHTML);
                }
            }

            setTimeout(function () { $('#ddlIncidentList').val($scope.spirometryRecord.IncidentID); }, 1000);
            setTimeout(function () { $('#ddlTestType').val($scope.spirometryRecord.TestTypeID); }, 1000);
            setTimeout(function () { $('#ddlEthnicity').val($scope.spirometryRecord.EthnicityID); }, 1000);

            setTimeout(function () { $('#ddlDisposition').val($scope.spirometryRecord.DispositionTypeID); }, 1000);
            setTimeout(function () { $('#ddlDiagnostic').val($scope.spirometryRecord.DiagnosticMethodID); }, 1000);

            setTimeout(function () { $('#ddlWeightUnit').val($scope.spirometryRecord.BodyWeightUOMTypeID); }, 1000);
            setTimeout(function () { $('#ddlHeightUnit').val($scope.spirometryRecord.BodyHeightUOMTypeID); }, 1000);

            setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 1000);
            setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 1000);
            setTimeout(function () { $('#ddlFollowType').val($scope.scheduleFollowUp.FollowUpTypeID); }, 1000);


        }


        $scope.spirometryRecord = {
            AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , SampleID: ""
            , WorkRelated: null
            , IncidentID: null
            , SpirometerSerialNumber: ""
            , Smoker: false
            , NumberOfCigarettsPerDay: 0
            , NumberOfYearSmoked: 0
            , BodyHeight: null
            , BodyHeightUOMTypeID: null
            , BodyWeight: null
            , BodyWeightUOMTypeID: null
            , BarometricPressure: null
            , BaselineTest: ""
            , BloodPressure: null
            , TestTypeID: null
            , EthnicityID: null
            , DispositionTypeID: null
            , ScheduleFollowUp: false
            , FVC: null
            , FEV05: null
            , FEV05FVC: null
            , FEV01: null
            , FEV01FVC: null
            , FEV03: null
            , FEV03FVC: null
            , FEF25: null
            , FEF50: null
            , FEF75: null
            , FEF2575: null
            , FEF7585: null
            , FEF02102: null
            , PEFR: null
            , MVV: null
            , PIF: null
            , FIF25: null
            , FIF50: null
            , FIF75: null
            , FIF2575: null

            , RespiratorUsage: null
            , SpirometryTestNote: null

            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: null
            , DiagnosticMethodID: null
        };


        //////////////////////////////////////////////////////////////////////////////////////////////////
        //*************Code to respond to back button press***********************************************

        $scope.GoToPreviousPage = function () {
            $window.history.back();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //******************Function to Get the Details of Encounter**********************
        $scope.getEncounterDetails = function () {
            globalobject.currentEncounter.EncounterDetailID = (sharedservices.getURLParameter().EncounterDetailID != undefined && sharedservices.getURLParameter().EncounterDetailID != null) ? parseInt(sharedservices.getURLParameter().EncounterDetailID) : parseInt(globalobject.currentEncounter.EncounterDetailID);

            globalobject.currentEncounter.AppointmentEncounterTypeID = (sharedservices.getURLParameter().AppointmentEncounterTypeID != undefined && sharedservices.getURLParameter().AppointmentEncounterTypeID != null) ? parseInt(sharedservices.getURLParameter().AppointmentEncounterTypeID) : parseInt(globalobject.currentEncounter.AppointmentEncounterTypeID);

            var configs = {
                url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SelectByEncounterTypeDetailID", //SelectEncounterTypeByEncounterID
                data: { EncounterDetailID: globalobject.currentEncounter.EncounterDetailID, AppointmentEncounterTypeID: globalobject.currentEncounter.AppointmentEncounterTypeID }
            };
            sharedservices.xhrService(configs)
                    .then(function (response) {
                        globalobject.currentEncounter.ExposureEncounterSummaryID = parseInt(response.data.d.Object[0].ExposureEncounterSummaryID);
                        globalobject.currentEncounter.AppointmentEncounterTypeID = parseInt(response.data.d.Object[0].AppointmentEncounterTypeID);
                        globalobject.currentEncounter.SelectedEncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        globalobject.employee.GenderId = parseInt(response.data.d.Object[0].GenderID);
                        globalobject.currentEncounter.EncounterTypeID = parseInt(response.data.d.Object[0].EncounterTypeID);
                        strGlobalSpirometryTestID = globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = response.data.d.Object[0].AppointmentEncounterTypeID;
                        $scope.GetEquipmentDetails();

                    });

        };

        $scope.GetEquipmentDetails = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/Inventory/EquipmentService.asmx/GetEquipmentDetails",
                data: { EquipmentCategoryID: strEquipmentCategoryID }
            };

            sharedservices.xhrService(configs)
                  .success(function (data, status, headers, config) {
                      if (data.d.IsOK) {
                          $scope.equipmentDetails = data.d.Object;
                          $scope.getSpirometryDetails();
                      }
                  })
                  .error(function (data, status, headers, config) {

                  });
        }




        $scope.getEncounterDetails();

        $scope.resetSchedulefollwupdetails = function () {
            $scope.spirometryRecord.ScheduleFollowUp = false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //******************Function to Get the Details of Spirometry Encounter *****************************

        $scope.getSpirometryDetails = function () {
            var configs = {};
            configs = {
                url: "/WebServices/OccupationalHealth/EncounterTypes/SpirometryService.asmx/GetSpirometryDetails",
                data: { AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID, SpirometryTestID: strGlobalSpirometryTestID }
            };

            sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
        };

        function getDetailDataSuccess(data, status, headers, config) {

            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                $scope.spirometryRecord = data.d.Object;
                $scope.spirometryRecord.Gender = globalobject.employee.GenderId;
                $scope.spirometryRecord.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
                strGlobalSpirometryTestID = $scope.spirometryRecord.SpirometryTestID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalSpirometryTestID;
                if ($scope.spirometryRecord.SpirometryTestID == 0) {
                    $scope.spirometryRecord.WorkRelated = null;
                    $scope.spirometryRecord.EncounterStatus = 1002;
                    $scope.spirometryRecord.ScheduleFollowUp = false;
                }

                $scope.ExpectedDueDate = $scope.spirometryRecord.ExpectedDueDate;

                if ($scope.spirometryRecord.ScheduleFollowUp && strGlobalSpirometryTestID != 0) {

                    $scope.getScheduleFollowUpDetails();
                }

                $scope.getIncidentList();
            }

        };

        function getDetailDataError(data, status, headers, config) {

        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //******************* Function to Save the Details of Spirometry Encounter **********************

        $scope.saveSpirometryDetails = function () {
            $scope.saveStatus = true;

            $scope.spirometryRecord.AppointmentEncounterTypeID = strGlobalAppointmentEncounterTypeID;
            if ($scope.spirometryRecord.SpirometerSerialNumber == null || $scope.spirometryRecord.SpirometerSerialNumber == '') {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }
            //            if ($scope.spirometryRecord.WorkRelated == true && ($scope.spirometryRecord.IncidentID == null || $scope.spirometryRecord.IncidentID == '')) {
            //                saveStatus = false;
            //                msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            //            }
            if ($scope.spirometryRecord.BodyHeight != null && $scope.spirometryRecord.BodyHeight != '' && ($scope.spirometryRecord.BodyHeightUOMTypeID == null || $scope.spirometryRecord.BodyHeightUOMTypeID == '')) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }
            if ($scope.spirometryRecord.BodyWeight != null && $scope.spirometryRecord.BodyWeight != '' && ($scope.spirometryRecord.BodyWeightUOMTypeID == null || $scope.spirometryRecord.BodyWeightUOMTypeID == '')) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }
            if ($scope.spirometryRecord.Smoker == true && ($scope.spirometryRecord.NumberOfCigarettsPerDay == null || $scope.spirometryRecord.NumberOfCigarettsPerDay == '')) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }
            if ($scope.spirometryRecord.Smoker == true && ($scope.spirometryRecord.NumberOfYearSmoked == null || $scope.spirometryRecord.NumberOfYearSmoked == '')) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }
            if ($scope.spirometryRecord.EncounterStatus == 1003 && ($scope.spirometryRecord.ReasonEncounterIncomplete == null || $scope.spirometryRecord.ReasonEncounterIncomplete == '')) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.spirometryRecord.EncounterStatus != 1003 && ($scope.spirometryRecord.EncounterStatus != 1002)) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }

            if ($scope.spirometryRecord.WorkRelated != true && $scope.spirometryRecord.WorkRelated != false) {
                $scope.saveStatus = false;
                $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
            }


            if ($scope.spirometryRecord.WorkRelated != true) {
                $scope.spirometryRecord.IncidentID == null;
            }
            if ($scope.spirometryRecord.Smoker != true) {
                $scope.spirometryRecord.NumberOfCigarettsPerDay == null;
                $scope.spirometryRecord.NumberOfYearSmoked == null;
            }
            if ($scope.spirometryRecord.EncounterStatus != 1003) {
                $scope.spirometryRecord.ReasonEncounterIncomplete == null;
            }

            if ($scope.spirometryRecord.ScheduleFollowUp == true) {
                $scope.ValidateSF();
            }

            if ($scope.saveStatus) {
                $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;
                var configs = {
                    url: "/WebServices/OccupationalHealth/EncounterTypes/SpirometryService.asmx/SaveSpirometryDetails",
                    data: { SpirometryResultsObj: $scope.spirometryRecord }
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

        };

        $scope.checkNum = function (itemID) {

            var value_1 = Number($('#' + itemID).val());
            if ((isNaN(value_1)) || value_1 < 0) {
                $('#' + itemID).val('');
                $('#' + itemID).focus();
                utilityservices.notify("numbers");
            }


        };

        function saveDetailDataSuccess(data, status, headers, config) {
            $scope.IsDisable = false;
            if (data.d.IsOK) {
                strGlobalSpirometryTestID = data.d.Object.SpirometryTestID;
                $scope.spirometryRecord.SpirometryTestID = strGlobalSpirometryTestID;
                globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalSpirometryTestID;
                $scope.frmSpirometry.$dirty = false;

                if ($scope.spirometryRecord.ScheduleFollowUp == false) {
                    $scope.emptySchedulefollowupObject();
                }
                if ($scope.spirometryRecord.ScheduleFollowUp == true) {

                    $scope.saveScheduleFollowUpDetails();
                }
                else {
                    $scope.showLoadingOverlay = false;
                    $scope.loadingAction = false;
                    if ($scope.spirometryRecord.ScheduleFollowUp == false) {
                        utilityservices.notify("saved");
                    }
                }
            }
            $scope.IsDisable = false;
            $scope.showLoadingOverlay = false;
        };

        function saveDetailDataError(data, status, headers, config) {
            $scope.IsDisable = false;
            $scope.showLoadingOverlay = false;
            $scope.loadingAction = false;
        };


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //**************************** Get incident list record **********************************************//



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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //****************************Cancel Spirometry Test **********************************************//
        $scope.cancelSpirometry = function () {

            if ($scope.frmSpirometry.$dirty) {

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
    };

})();

