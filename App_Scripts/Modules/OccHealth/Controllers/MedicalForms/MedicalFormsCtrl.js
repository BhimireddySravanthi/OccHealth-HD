
angular.module("app")
        .controller("MedicalFormsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices", "$window", "$q", "$timeout",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices, $window, $q, $timeout) {


             $scope.Time = new Date();
             $scope.StartTime = new Date();
             $scope.EndTime = new Date();
             $scope.IsEmptyReport = false;
             $scope.EmployeeNameData = "";
             $scope.DispositionType = "";
             $scope.PersonnelTypeData = "";
             $scope.ertForm = {
                 Date: "",
                 Time: $scope.Time,
                 Location: globalobject.currentSession.locationName,
                 PersonnelTypeID: "",
                 EmployeeName: "",
                 EmployeePK: "",
                 EmployeeID: "",
                 WorkRelated: null,
                 IncidentPK: "",
                 DispositionTypeID: "",
                 RefusalofCare: null,
                 WasCPRadministered: null,
                 StartTime: $scope.StartTime,
                 EndTime: $scope.EndTime,
                 ERTFormCompletedBy: null,
                 HastheHarleyDavisionrefusalofcareformbeensigned: null,
                 WasEMScontacted: null,
                 DidemployeesignEMSrefusaldocument: null,
                 Vitals: "",
                 Comments: ""

             }


             $scope.Date = {
                 Label: $filter('translate')('lblDate') + "*" + ":",
                 Data: $scope.ertForm.Date,
                 SequenceNumber: 1
             }
             $scope.Time = {
                 Label: $filter('translate')('lblTime') + "*" + ":",
                 Data: "",
                 SequenceNumber: 2
             }
             $scope.Location = {
                 Label: $filter('translate')('lblLocation') + ":",
                 Data: globalobject.currentSession.locationName,
                 SequenceNumber: 3
             }
             $scope.PersonnelType = {
                 Label: $filter('translate')('lblPersonnelType') + "*" + ":",
                 Data: "",
                 SequenceNumber: 4
             }
             $scope.EmployeeName = {
                 Label: $filter('translate')('lblEmployeeName') + "*" + ":",
                 Data: "",
                 SequenceNumber: 5
             }
             $scope.EmployeeID = {
                 Label: $filter('translate')('lblEmployeeID') + "*" + ":",
                 Data: "",
                 SequenceNumber: 6
             }
             $scope.WorkRelated = {
                 Label: $filter('translate')('lblWorkRelated') + ":",
                 Data: "",
                 SequenceNumber: 7
             }
             $scope.IncidentPK = {
                 Label: $filter('translate')('lblIncidentID') + ":",
                 Data: "",
                 SequenceNumber: 8
             }
             $scope.DispositionTypeID = {
                 Label: $filter('translate')('lblDisposition') + ":",
                 Data: "",
                 SequenceNumber: 9
             }
             $scope.RefusalofCare = {
                 Label: $filter('translate')('lblRefusalofCare') + ":",
                 Data: "",
                 SequenceNumber: 10
             }
             $scope.WasCPRadministered = {
                 Label: $filter('translate')('lblWasCPRadministered') + ":",
                 Data: "",
                 SequenceNumber: 11
             }
             $scope.StartTime = {
                 Label: $filter('translate')('lblStartTime') + ":",
                 Data: "",
                 SequenceNumber: 12
             }
             $scope.EndTime = {
                 Label: $filter('translate')('lblEndTime') + ":",
                 Data: "",
                 SequenceNumber: 13
             }
             $scope.ERTFormCompletedBy = {
                 Label: $filter('translate')('lblERTFormCompletedBy') + ":",
                 Data: "",
                 SequenceNumber: 14
             }
             $scope.HastheHarleyDavisionrefusalofcareformbeensigned = {
                 Label: $filter('translate')('lblHastheHarleyDavisionrefusalofcareformbeensigned') + ":",
                 Data: "",
                 SequenceNumber: 15
             }

             $scope.WasEMScontacted = {
                 Label: $filter('translate')('lblWasEMScontacted') + ":",
                 Data: "",
                 SequenceNumber: 16
             }
             $scope.DidemployeesignEMSrefusaldocument = {
                 Label: $filter('translate')('lblDidemployeesignEMSrefusaldocument') + ":",
                 Data: "",
                 SequenceNumber: 17
             }
             $scope.Vitals = {
                 Label: $filter('translate')('lblVitals') + ":",
                 Data: "",
                 SequenceNumber: 18
             }
             $scope.Comments = {
                 Label: $filter('translate')('lblComments') + ":",
                 Data: "",
                 SequenceNumber: 19
             }

             $scope.ertFormPrint = {};
             $scope.ertFormPrint.HeaderText = $filter('translate')('lblERTForm');
             $scope.ertFormPrint.EmployeeId = "";

             $scope.ertFormPrint.ERTData = [];


             $scope.ertFormPrint.ERTData.push($scope.Date);
             $scope.ertFormPrint.ERTData.push($scope.Time);
             $scope.ertFormPrint.ERTData.push($scope.Location);
             $scope.ertFormPrint.ERTData.push($scope.PersonnelType);
             $scope.ertFormPrint.ERTData.push($scope.EmployeeName);
             $scope.ertFormPrint.ERTData.push($scope.EmployeeID);
             $scope.ertFormPrint.ERTData.push($scope.WorkRelated);
             $scope.ertFormPrint.ERTData.push($scope.IncidentPK);
             $scope.ertFormPrint.ERTData.push($scope.DispositionTypeID);
             $scope.ertFormPrint.ERTData.push($scope.RefusalofCare);
             $scope.ertFormPrint.ERTData.push($scope.WasCPRadministered);
             $scope.ertFormPrint.ERTData.push($scope.StartTime);
             $scope.ertFormPrint.ERTData.push($scope.EndTime);
             $scope.ertFormPrint.ERTData.push($scope.ERTFormCompletedBy);
             $scope.ertFormPrint.ERTData.push($scope.HastheHarleyDavisionrefusalofcareformbeensigned);
             $scope.ertFormPrint.ERTData.push($scope.WasEMScontacted);
             $scope.ertFormPrint.ERTData.push($scope.DidemployeesignEMSrefusaldocument);
             $scope.ertFormPrint.ERTData.push($scope.Vitals);
             $scope.ertFormPrint.ERTData.push($scope.Comments);


             $scope.Time = new Date();
             $scope.StartTime = new Date();
             $scope.EndTime = new Date();

             $scope.getERTFormLetter = function () {
                 var userParms = {};
                 var userUrl = "/WebServices/OccupationalHealth/OccHealthService.asmx/GetRestServiceHeaderDetails";
                 var msg = "Unable to Generate PDF.";
                 var configs = {
                     url: userUrl
                 };

                 sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        var consumerId = data.d.Object[0];
                        var restHostUrl = data.d.Object[1];
                        var ertHeaders = {
                            "ApplicationType": "4",
                            "ConsumerId": consumerId,
                            "Accept": "application/json; charset=utf-8",
                            "Content-Type": "application/json; charset=utf-8"
                        };

                        var ertUrl = restHostUrl + '/papi/v1/oh/GenerateERTLetter';


                        getAjaxResponse("POST", ertHeaders, JSON.stringify($scope.ertFormPrint), ertUrl, ertSuccess, ertError);
                        function ertSuccess(data, status, xhr) {
                            var docUrl = data;
                            if (docUrl.indexOf("ERTForm_") > 0) {
                                window.open(docUrl, 'ERT FORM', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
                            }
                            else {
                                utilityservices.notify("error", docUrl);
                            }
                        }
                        function ertError(data, status, xhr) {
                            utilityservices.notify("error", msg);
                        }
                    }
                })
                .error(function () {
                    utilityservices.notify("error", msg);
                })
             };

             function getAjaxResponse(httpType, httpHeaders, httpParms, httpUrl, handleData, handleError) {
                 $.ajax({
                     type: httpType,
                     url: httpUrl,
                     data: httpParms,
                     headers: httpHeaders,
                     dataType: "json",
                     success: function (data, status, xhr) {
                         handleData(data, status, xhr);
                     },
                     error: function (data, status, xhr) {
                         handleError(data, status, xhr);
                     }
                 });
             };



             function BindDefaultDateTime() {
                 var date = new Date();
                 var timeNow = date.getHours() + ":" + date.getMinutes()
                 $scope.Hour = timeNow.split(':')[0];
                 $scope.Minut = timeNow.split(':')[1];


                 $scope.Time = sharedservices.setTime($scope.Hour, $scope.Minut);
                 $scope.EndTime = sharedservices.setTime($scope.Hour, $scope.Minut);
                 $scope.StartTime = sharedservices.setTime($scope.Hour, $scope.Minut);

                 $scope.hourStep = sharedservices.hourStep;
                 $scope.minuteStep = sharedservices.minuteStep;
             }
             BindDefaultDateTime();

             function loadEmployeeList() {
                 var configs = {
                     url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                     data: { personnelTypeId: $scope.ertForm.PersonnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: "Active" }
                 };
                 sharedservices.xhrService(configs)
                   .success(function (data, status, headers, config) {
                       if (data.d.IsOK) {
                           $scope.findEmployeeList = data.d.Object == null ? [] : data.d.Object;
                       }
                   })
                   .error(function () {
                       utilityservices.notify("error");
                   })
             }


             $scope.$watch('ertForm.PersonnelTypeID', function (newValue, oldValue) {
                 if (newValue != oldValue) {
                     if ($scope.ertForm.PersonnelTypeID != undefined || $scope.ertForm.PersonnelTypeID != null || $scope.ertForm.PersonnelTypeID != "")
                         loadEmployeeList();
                     $scope.ertForm.EmployeeID = "";
                     $scope.ertForm.EmployeePK = "";
                     $scope.EmployeeNameData = "";
                 }

             });

             $scope.goToEmployeeProfile = function (employee) {
                 $scope.EmployeeNameData = employee.FirstName + ' ' + employee.LastName;
                 $scope.ertForm.EmployeeID = employee.OccHealthEmployeeId;
                 $scope.ertForm.EmployeePK = employee.ID;
                 getIncidentList();
             };
             $scope.getIncidentDetails = function (Incident) {
                 $scope.INCIDENTINTERNALID = Incident.INCIDENTINTERNALID;
             };

             $scope.PersonalTypeChange = function () {
                 $scope.PersonnelTypeData = $('#ddlPersonnelType option:selected').text();
             }


             $scope.getDispositionTypeDetails = function () {
                 $scope.DispositionType = $('#ddlDispositionType option:selected').text().trim();
             };

             function getIncidentList() {
                 var configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetIncidentListForRestrictions",
                     data: { PersonnelTypeID: $scope.ertForm.PersonnelTypeID, EmployeePK: $scope.ertForm.EmployeePK, LocationID: 0 }
                 };
                 sharedservices.xhrService(configs)
                     .success(function (data, status, headers, config) {
                         if (data.d.IsOK) {
                             sharedservices.parseDates(data.d.Object);
                             $scope.IncidentIdList = data.d.Object;

                         }
                     })
                     .error(function (data, status, headers, config) {

                     });
             }
             $scope.INCIDENTINTERNALID = "";
             $scope.printOverallReport = function () {


                 $scope.ertFormPrint.EmployeeId = $scope.ertForm.EmployeeID;
                 $scope.Date.Data = $scope.ertForm.Date != "" ? moment($scope.ertForm.Date).format('MMMM DD YYYY') : "";
                 $scope.ertFormPrint.ERTData[1].Data = $('#hdnTime').val();
                 $scope.ertFormPrint.ERTData[2].Data = globalobject.currentSession.locationName;
                 $scope.ertFormPrint.ERTData[3].Data = $scope.PersonnelTypeData;
                 $scope.ertFormPrint.ERTData[4].Data = $scope.EmployeeNameData;
                 $scope.ertFormPrint.ERTData[5].Data = $scope.ertForm.EmployeeID;
                 $scope.ertFormPrint.ERTData[6].Data = $scope.ertForm.WorkRelated == null ? "" : $scope.ertForm.WorkRelated == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[7].Data = $scope.INCIDENTINTERNALID;
                 $scope.ertFormPrint.ERTData[8].Data = $scope.DispositionType;
                 $scope.ertFormPrint.ERTData[9].Data = $scope.ertForm.RefusalofCare == null ? "" : $scope.ertForm.RefusalofCare == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[10].Data = $scope.ertForm.WasCPRadministered == null ? "" : $scope.ertForm.WasCPRadministered == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[11].Data = $('#hdnStartTime').val();
                 $scope.ertFormPrint.ERTData[12].Data = $('#hdnEndTime').val();
                 $scope.ertFormPrint.ERTData[13].Data = $scope.ertForm.ERTFormCompletedBy == null ? "" : $scope.ertForm.ERTFormCompletedBy;
                 $scope.ertFormPrint.ERTData[14].Data = $scope.ertForm.HastheHarleyDavisionrefusalofcareformbeensigned == null ? "" : $scope.ertForm.HastheHarleyDavisionrefusalofcareformbeensigned == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[15].Data = $scope.ertForm.WasEMScontacted == null ? "" : $scope.ertForm.WasEMScontacted == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[16].Data = $scope.ertForm.DidemployeesignEMSrefusaldocument == null ? "" : $scope.ertForm.DidemployeesignEMSrefusaldocument == true ? "Yes" : "No";
                 $scope.ertFormPrint.ERTData[17].Data = $scope.ertForm.Vitals;
                 $scope.ertFormPrint.ERTData[18].Data = $scope.ertForm.Comments;

                 $scope.getERTFormLetter();

             };
             $scope.printEmptyReport = function () {


                 $scope.ertFormPrint.EmployeeId = "";
                 $scope.ertFormPrint.ERTData[0].Data = "";
                 $scope.ertFormPrint.ERTData[1].Data = "";
                 $scope.ertFormPrint.ERTData[2].Data = globalobject.currentSession.locationName;
                 $scope.ertFormPrint.ERTData[3].Data = "";
                 $scope.ertFormPrint.ERTData[4].Data = "";
                 $scope.ertFormPrint.ERTData[5].Data = "";
                 $scope.ertFormPrint.ERTData[6].Data = "";
                 $scope.ertFormPrint.ERTData[7].Data = "";
                 $scope.ertFormPrint.ERTData[8].Data = "";
                 $scope.ertFormPrint.ERTData[9].Data = "";
                 $scope.ertFormPrint.ERTData[10].Data = "";
                 $scope.ertFormPrint.ERTData[11].Data = "";
                 $scope.ertFormPrint.ERTData[12].Data = "";
                 $scope.ertFormPrint.ERTData[13].Data = "";
                 $scope.ertFormPrint.ERTData[14].Data = "";
                 $scope.ertFormPrint.ERTData[15].Data = "";
                 $scope.ertFormPrint.ERTData[16].Data = "";
                 $scope.ertFormPrint.ERTData[17].Data = "";
                 $scope.ertFormPrint.ERTData[18].Data = "";

                 $scope.getERTFormLetter();

             };

             $scope.GetLookUpLists = function () {
                 configs = {
                     url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetLookUpLists",
                     data: { IsMobile: false }
                 };

                 sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);
                    $scope.PersonnelTypeList = data.d.Object.PersonnelTypeList;
                    $scope.DispositionTypeList = data.d.Object.DispositionTypeList;
                })
                .error(function () {
                    //$scope.GetUserPermissionData();
                })
             }
             $scope.GetLookUpLists();


         } ]);





