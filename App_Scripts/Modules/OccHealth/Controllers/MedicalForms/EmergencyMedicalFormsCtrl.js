
angular.module("app")
        .controller("EmergencyMedicalFormsCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "translations", "utilityservices", "$window", "$q", "$timeout",
         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices, $window, $q, $timeout) {


              $scope.Time = new Date();
             $scope.StartTime = new Date();
             $scope.EndTime = new Date();
             $scope.IsEmptyReport = false;
             $scope.EmployeeNameData="";          
              $scope.DepartmentNameData="";
              $scope.PersonnelTypeData="";              
               $scope.StateName="";
               $scope.CountryName="";
               $scope.count=3;
             $scope.ertMedicalTransportForm = {
                 Date: "",                
                 Time: $scope.Time,                
                 Location: globalobject.currentSession.locationName,                
                 PersonnelTypeID: "",                 
                 EmployeeName: "",
                 EmployeePK: "",                 
                 EmployeeID: "",               
                 DateofBirth: "",              
                 DepartmentID: "",                 
                 StreetAddress: "",                 
                 City: "",                 
                 Country: "",                
                 State:"",                
                 Zip:"",                
                 PhoneNumber: "",                
                 EmergencycontactDetails: "",                
                 Allergiesoradversereaction: "",                
                 Medication1: "", 
                 Medication2: "",
                 Medication3: "",
                 Dose1: "", 
                 Dose2: "",
                 Dose3: "",
                 LastDoseTaken1: "", 
                 LastDoseTaken2: "",
                 LastDoseTaken3: "",
                 ReasonforUse1: "", 
                 ReasonforUse2: "",
                 ReasonforUse3: "",                       
                 Vitals: "",                
                 Comments: ""                 
                 
             }

             
             $scope.Date = {
                 Label: $filter('translate')('lblDate') + "*"+":",
                 Data: "",
                 SequenceNumber: 1
             }
             $scope.Time = {
                 Label: $filter('translate')('lblTime') + "*"+":",
                 Data: "",
                 SequenceNumber: 2
             }
             $scope.Location = {
                 Label: $filter('translate')('lblLocation')+":",
                 Data: globalobject.currentSession.locationName,
                 SequenceNumber: 3
             }
             $scope.PersonnelType = {
                 Label: $filter('translate')('lblPersonnelType') + "*"+":",
                 Data: "",
                 SequenceNumber: 4
             }
             $scope.EmployeeName = {
                 Label: $filter('translate')('lblEmployeeName') + "*"+":",
                 Data: "",
                 SequenceNumber: 5
             }
             $scope.EmployeeID = {
                 Label: $filter('translate')('lblEmployeeID') + "*"+":",
                 Data:"" ,
                 SequenceNumber: 6
             }
             $scope.DateofBirth = {
                 Label: $filter('translate')('lblDateOfBirth')+":",
                 Data: "",
                 SequenceNumber: 7
             }
             $scope.DepartmentName = {
                 Label: $filter('translate')('lblDepartmentName')+":",
                 Data:"" ,
                 SequenceNumber: 8
             }
             $scope.StreetAddress = {
                 Label: $filter('translate')('lblStreetAddress')+":",
                 Data: "",
                 SequenceNumber: 9
             }
             $scope.City = {
                 Label: $filter('translate')('lblCity')+":",
                 Data:"" ,
                 SequenceNumber: 10
             }
             $scope.Country = {
                 Label: $filter('translate')('lblCountry')+":",
                 Data:"" ,
                 SequenceNumber: 11
             }
             $scope.State = {
                 Label: $filter('translate')('lblStateProvince')+":",
                 Data: "",
                 SequenceNumber: 12
             }
             $scope.Zip = {
                 Label: $filter('translate')('lblZip')+":",
                 Data: "",
                 SequenceNumber: 13
             }
             $scope.PhoneNumber = {
                 Label: $filter('translate')('lblPhoneNumber')+":",
                 Data: "",
                 SequenceNumber: 14
             }

             $scope.EmergencyContactDetails = {
                 Label: $filter('translate')('lblEmergencycontactDetails')+":",
                 Data: "",
                 SequenceNumber: 15
             }
             $scope.AllergiesofAdverseReactions = {
                 Label: $filter('translate')('lblAllergiesoradversereaction')+":",
                 Data: "",
                 SequenceNumber: 16
             }
              $scope.Vitals = {
                 Label: $filter('translate')('lblVitals')+":",
                 Data: "",
                 SequenceNumber: 17
             }
             $scope.Comments = {
                 Label: $filter('translate')('lblComments')+":",
                 Data: "",
                 SequenceNumber: 18
             }
             
          
            
             $scope.ertFormPrint = {};
             $scope.ertFormPrint.HeaderText = $filter('translate')('lblEmergencymedicalTransport');
             $scope.ertFormPrint.EmployeeId = "";

             $scope.ertFormPrint.EMTData = [];        
             
             $scope.ertFormPrint.EMTData.push($scope.Date);
             $scope.ertFormPrint.EMTData.push($scope.Time);
             $scope.ertFormPrint.EMTData.push($scope.Location);
             $scope.ertFormPrint.EMTData.push($scope.PersonnelType);
             $scope.ertFormPrint.EMTData.push($scope.EmployeeName);
             $scope.ertFormPrint.EMTData.push($scope.EmployeeID);
             $scope.ertFormPrint.EMTData.push($scope.DateofBirth);
             $scope.ertFormPrint.EMTData.push($scope.DepartmentName);
             $scope.ertFormPrint.EMTData.push($scope.StreetAddress);
             $scope.ertFormPrint.EMTData.push($scope.City);
             $scope.ertFormPrint.EMTData.push($scope.Country);
             $scope.ertFormPrint.EMTData.push($scope.State);
             $scope.ertFormPrint.EMTData.push($scope.Zip);
             $scope.ertFormPrint.EMTData.push($scope.PhoneNumber);
             $scope.ertFormPrint.EMTData.push($scope.EmergencyContactDetails);
             $scope.ertFormPrint.EMTData.push($scope.AllergiesofAdverseReactions);
             $scope.ertFormPrint.EMTData.push($scope.Vitals);
             $scope.ertFormPrint.EMTData.push($scope.Comments);


            

             $scope.ertFormPrint.medicationLabel={
                "Medication": $filter('translate')('lblMedication'), 
               "Dose" :$filter('translate')('lblDose'),
                 "LastDose": $filter('translate')('lblLastDoseTaken'), 
                 "ReasonForUse": $filter('translate')('lblReasonforUse')                 
               }
          

              



              
          


             $scope.Time = new Date();
            

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
            
                            var ertUrl = restHostUrl + '/papi/v1/oh/GenerateEMTLetter';
                           
                           
                            getAjaxResponse("POST", ertHeaders, JSON.stringify($scope.ertFormPrint), ertUrl, ertSuccess, ertError);
                            function ertSuccess(data, status, xhr) {
                                var docUrl = data;
                                if (docUrl.indexOf("EMTForm_") > 0){                                    
                                        window.open(docUrl, 'EMT FORM', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes'); 
                                    }
                                else{
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


            

              $scope.LocationDepartmentList = [];

            $scope.GetDepartmentDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/OrganizationComponentService.asmx/GetDepartmentsWithID",
                    data: { showDeptBreadCrum: false }        

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.LocationDepartmentList = data.d.Object == null ? [] : data.d.Object;
                        
                    }
                    else {
                        $scope.LocationDepartmentList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }

            $scope.GetDepartmentDropDownValues();

             $scope.GetCountryDropDownValues = function () {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetCountryNationalityDropDownValues"

                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.CountryNationalityList = data.d.Object == null ? [] : data.d.Object;
                       
                    }
                    else {
                        $scope.CountryNationalityList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }
           
            $scope.GetCountryDropDownValues();

                  $scope.GetStateDropDownValues = function () {

                  $scope.CountryName=$('#ddlCountryID option:selected').text().trim();

                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/SateSelectByCountryId",
                    data: { countryId: $scope.ertMedicalTransportForm.CountryId }
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.StateList = data.d.Object == null ? [] : data.d.Object;
                       
                    }
                    else {
                        $scope.StateList = [];
                    }
                })
                .error(function () {
                    toastr.error($filter('translate')('msgSeriveerror'));
                })
            }
            $scope.getStateDetails=function(){
               $scope.StateName=$('#ddStates option:selected').text().trim();

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
                     data: { personnelTypeId: $scope.ertMedicalTransportForm.PersonnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: "Active" }
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


             $scope.$watch('ertMedicalTransportForm.PersonnelTypeID', function (newValue, oldValue) {
                 if (newValue != oldValue) {
                     if ($scope.ertMedicalTransportForm.PersonnelTypeID != undefined || $scope.ertMedicalTransportForm.PersonnelTypeID != null || $scope.ertMedicalTransportForm.PersonnelTypeID != "")
                         loadEmployeeList();
                     $scope.ertMedicalTransportForm.EmployeeID = "";
                     $scope.ertMedicalTransportForm.EmployeePK = "";
                     $scope.EmployeeNameData="";
                 }

             });
              
             $scope.goToEmployeeProfile = function (employee) {
                 $scope.EmployeeNameData = employee.FirstName + ' ' + employee.LastName;
                 $scope.ertMedicalTransportForm.EmployeeID = employee.OccHealthEmployeeId;
                 $scope.ertMedicalTransportForm.EmployeePK = employee.ID;
                
             };
            

             $scope.PersonalTypeChange=function(){
                 $scope.PersonnelTypeData=$('#ddlPersonnelType option:selected').text();
             }


             $scope.getDepartmentDetails = function () {               
                $scope.DepartmentNameData=$('#ddlDepartment option:selected').text().trim();
             };

            
             $scope.ertFormPrint.MedicationDetail=[];
             $scope.ertFormPrint1=[];
             $scope.printOverallReport = function () {

            
                 $scope.ertFormPrint.EmployeeId = $scope.ertMedicalTransportForm.EmployeeID;
                 $scope.ertFormPrint.EMTData[0].Data = $scope.ertMedicalTransportForm.Date!=""? moment($scope.ertMedicalTransportForm.Date).format('MMMM DD YYYY'):"";
                 $scope.ertFormPrint.EMTData[1].Data = $('#hdnTime').val();
                 $scope.ertFormPrint.EMTData[2].Data=globalobject.currentSession.locationName;
                 $scope.ertFormPrint.EMTData[3].Data= $scope.PersonnelTypeData;
                 $scope.ertFormPrint.EMTData[4].Data=$scope.EmployeeNameData;
                 $scope.ertFormPrint.EMTData[5].Data=$scope.ertMedicalTransportForm.EmployeeID;
                 $scope.ertFormPrint.EMTData[6].Data=$scope.ertMedicalTransportForm.DateofBirth!=""? moment($scope.ertMedicalTransportForm.DateofBirth).format('MMMM DD YYYY'):"";
                 $scope.ertFormPrint.EMTData[7].Data=   $scope.DepartmentNameData;
                 $scope.ertFormPrint.EMTData[8].Data= $scope.ertMedicalTransportForm.StreetAddress;
                 $scope.ertFormPrint.EMTData[9].Data=$scope.ertMedicalTransportForm.City;
                 $scope.ertFormPrint.EMTData[10].Data = $scope.CountryName;             
                 $scope.ertFormPrint.EMTData[11].Data = $scope.StateName;
                 $scope.ertFormPrint.EMTData[12].Data =$scope.ertMedicalTransportForm.Zip;
                 $scope.ertFormPrint.EMTData[13].Data=$scope.ertMedicalTransportForm.PhoneNumber;
                 $scope.ertFormPrint.EMTData[14].Data=$scope.ertMedicalTransportForm.EmergencycontactDetails;
                 $scope.ertFormPrint.EMTData[15].Data=$scope.ertMedicalTransportForm.Allergiesoradversereaction;
                 $scope.ertFormPrint.EMTData[16].Data=$scope.ertMedicalTransportForm.Vitals;
                 $scope.ertFormPrint.EMTData[17].Data=$scope.ertMedicalTransportForm.Comments;

                 $scope.ertFormPrint.MedicationDetail=[];
                      $scope.medicationarr={"Medication":'',"Dose":'',"LastDose":'',"ReasonforUse":''}; 
               for(var i=0;i<=$scope.count-1;i++) {              
                    
                    if($scope.ertFormPrint1.medicationDetail[i]!=undefined){
                          //$scope.medicationarr={"Medication":'',"Dose":'',"LastDose":'',"ReasonforUse":''}; 
                           $scope.medicationarr.Medication= $scope.ertFormPrint1.medicationDetail[i].Medication==undefined ?" ":   $scope.ertFormPrint1.medicationDetail[i].Medication;
                           $scope.medicationarr.Dose=$scope.ertFormPrint1.medicationDetail[i].Dose==undefined ?" ":          $scope.ertFormPrint1.medicationDetail[i].Dose;
                           $scope.medicationarr.LastDose=$scope.ertFormPrint1.medicationDetail[i].LastDoseTaken==undefined ?" ":$scope.ertFormPrint1.medicationDetail[i].LastDoseTaken;
                           $scope.medicationarr.ReasonforUse=$scope.ertFormPrint1.medicationDetail[i].ReasonforUse==undefined ?" ":$scope.ertFormPrint1.medicationDetail[i].ReasonforUse;
                   }
                   else
                   {
                           $scope.medicationarr.Medication=" ";
                           $scope.medicationarr.Dose=" ";
                           $scope.medicationarr.LastDose=" ";
                           $scope.medicationarr.ReasonforUse=" ";
                   }
                   $scope.ertFormPrint.MedicationDetail.push(angular.copy($scope.medicationarr));                
                }
                $scope.getERTFormLetter();

             };
             $scope.printEmptyReport = function () {
                
              
                 $scope.ertFormPrint.EmployeeId = "";
                 $scope.ertFormPrint.EMTData[0].Data = "";
                 $scope.ertFormPrint.EMTData[1].Data = "";
                 $scope.ertFormPrint.EMTData[2].Data=globalobject.currentSession.locationName;
                 $scope.ertFormPrint.EMTData[3].Data= "";
                 $scope.ertFormPrint.EMTData[4].Data="";
                 $scope.ertFormPrint.EMTData[5].Data="";
                 $scope.ertFormPrint.EMTData[6].Data="";
                 $scope.ertFormPrint.EMTData[7].Data="";
                 $scope.ertFormPrint.EMTData[8].Data= "";
                 $scope.ertFormPrint.EMTData[9].Data="";
                 $scope.ertFormPrint.EMTData[10].Data ="";               
                 $scope.ertFormPrint.EMTData[11].Data = "";
                 $scope.ertFormPrint.EMTData[12].Data = "";
                 $scope.ertFormPrint.EMTData[13].Data="";
                 $scope.ertFormPrint.EMTData[14].Data="";
                 $scope.ertFormPrint.EMTData[15].Data="";
                 $scope.ertFormPrint.EMTData[16].Data="";
                 $scope.ertFormPrint.EMTData[17].Data="";

                  $scope.ertFormPrint.MedicationDetail=[];
                  $scope.medicationarr={"Medication":'',"Dose":'',"LastDose":'',"ReasonforUse":''}; 
                  for(var i=0;i<=$scope.count-1;i++) {          
                            
                           $scope.medicationarr.Medication=" ";
                           $scope.medicationarr.Dose=" ";
                           $scope.medicationarr.LastDose=" ";
                           $scope.medicationarr.ReasonforUse=" ";
                    $scope.ertFormPrint.MedicationDetail.push($scope.medicationarr);  
                   }
                                
                   
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

   angular.module("app")
.directive("addrows", function($compile){
	return function($scope, element, attrs){
		element.bind("click", function(){

			angular.element(document.getElementById('append')).append($compile("<div class='form-group'><div class='col-sm-3'  style='width: 24%;'><input class='form-control' maxlength='100'  style='margin-left: 5px;' ng-model='ertFormPrint1.medicationDetail["+$scope.count+"].Medication'  /></div> "+
   "<div class='col-sm-3'><input class='form-control' maxlength='100'  ng-model='ertFormPrint1.medicationDetail["+$scope.count+"].Dose'/></div> <div class='col-sm-3'>"+
   "<input class=form-control maxlength='100'  ng-model='ertFormPrint1.medicationDetail["+$scope.count+"].LastDoseTaken' /> </div> <div class='col-sm-3'>"
   +"<input class='form-control' maxlength='500'  ng-model='ertFormPrint1.medicationDetail["+$scope.count+"].ReasonforUse'  /> </div></div>")($scope));
			$scope.count++; 

		});

     
	};
});


