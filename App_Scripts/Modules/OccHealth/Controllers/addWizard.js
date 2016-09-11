angular.module("app")
.controller("ohAddWizard", [
    "$scope",
    "$routeParams",
    "$location",
    "sharedservices",
    "$modal",
    "utilityservices",
    "toastr",
    "$timeout",
    "globalobject",
    "$filter",
    function ($scope, $routeParams, $location, sharedservices, $modal, utilityservices, toastr, $timeout, globalobject,$filter) {

        globalobject.currentPage = "Add Wizard";

         //****************************GET ALL COMMON LOOKUP VALUE FROM GLOBAL OBJECT START************************************************//
        $scope.AppointmentStatusList = globalobject.AppointmentStatusList;
        $scope.EncounterTypeList = globalobject.EncounterTypeList;
        $scope.HealthCareEntityList = globalobject.HealthCareEntityList;
        $scope.VisitReasonList = globalobject.VisitReasonList;
        $scope.HealthcareProviderList = globalobject.HealthcareProviderList;
        $scope.VisiteTypeList = globalobject.VisiteTypeList;
        $scope.PersonnelTypeList = globalobject.PersonnelTypeList;
        $scope.ContactMethodList = globalobject.ContactMethodList;
        $scope.SaveandContinueflag=false;
        $scope.EmployeePK=0;
        $scope.name="";
        $scope.IsCreateEncounter=false;
        $scope.IsDataLoaded=true;
        $scope.IsPermission=true;
        $scope.screenType=globalobject.currentEncounter.screenType;
        $scope.Employee = [];
        $scope.RedirectFromMedicalProf=  globalobject.RedirectFrom;
        $scope.LocationDepartmentList = [];
        $scope.FromSOAListScreen=globalobject.currentEncounter.FromSOAListScreen==null?false:globalobject.currentEncounter.FromSOAListScreen;
        $scope.EncounterExists=false;
          $scope.allowDuplicate=false;
        $scope.EncounterTypes = [];

        $scope.EmployeeStatusObj={};
        $scope.EmployeeStatusObj.EmployeeStatus=[];
        $scope.allowEncounter=false;
         $scope.employeesSelected = [];
         $scope.employeeDatabase = [];
         $scope.minDate= new Date();
         $scope.IsDepartmentMandatoryCheck = true;
         $scope.PreviousAppointmentId=0;
         $scope.IsFolllowUpSeleceted = false;
         $scope.AppointmentDate=new Date();
         $scope.AppTimein=null;
         globalobject.DuplicateAppointmentfromScreen="AddAppointment";

         if((utilityservices.GetCustomKeyValue('45', 'IsDepartmentMandatoryCheck')).toLowerCase() =='no')
         {
         $scope.IsDepartmentMandatoryCheck = false;
         }
         
           if((utilityservices.GetCustomKeyValue('45', 'AllowPastAppointmentsandEncounters')).toLowerCase()=="yes")
           {
             $scope.AllowPastAppointmentandEncounters =true;
           }
           else
           { 
             $scope.AllowPastAppointmentandEncounters =false;
           }   
           
           if($scope.screenType=="EmployeeMedicalProfile")
           {
           $scope.EmployeeStatusObj.EmployeeStatus=globalobject.selectEmployeeStatus.EmployeeStatus;
           }

       $scope.appointmentDetails = {
            AppointmentDetailID: globalobject.currentEncounter.AppointmentDetailID
                   , PersonnelTypeID: globalobject.currentEncounter.PersonnelTypeID
                   , AppointmentStatusID: null
                   , VisitReasonID: null
                   , EncounterTypeIDs: null
                   , HealthCareEntityID: null
                   , HealthCareProviderID: null
                   , VisitTypeID: null
                   , ContactMethodID: 1000
                   , AppointmentDate: null
                   , AppointmentTimeIn: null
                   , AppointmentTimeOut: null
                   , EmailAddress: null
                   , CellPhoneNumber: null
                   , HomePhoneNumber: null
                   , EmployeeID: null
                   , SendNotification: true
                   , AppointmentScheduledByName:globalobject.currentSession.username
                   ,DepartmentID:{'Name': "-- Select --",'DepartmentID':-1,'IsActive':false}
                   ,EmployeePK:null
                   ,EncounterDetailID:0
                   ,TimeIn:null
                   ,TimeOut:null
                   ,VisitDate:new Date()
                 ,allowDuplicate:false
        };        

         $scope.PrevappointmentDetails = {
                    AppointmentID:0
                   , EmployeeName: null
                   , EmployeeID: null
                   , LocationDepartment: null
                   , SupervisorName: null
                   , AppointmentTime: null
                   , AppointmentTimeIn: null
                   , AppointmentTimeOut: null
                   , VisitReason : null
                   , VisitType: null
                   , HealthCareEntity: null
                   , HealthCareProvider: null
                   , AppointmentScheduledByName: null
                   , SendNotification: false
                   , EncounterTypeNames:null
                   ,SendNotificationText :'No'
                   ,VisitTypeID:0
                   ,HealthCareEntityID:0
                  
        };        

           

                globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
                globalobject.encounterTypes.encounterDetails.showResultsForm = false;
                globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;

     $scope.AssignDefaultInstep2=function()
        {
           if ($scope.appointmentDetails.AppointmentDetailID == 0) {
                for (var i = $scope.VisitReasonList.length - 1; i > -1; i--) {
                    if ($scope.VisitReasonList[i].isDefault) {
                        $scope.appointmentDetails.VisitReasonID = $scope.VisitReasonList[i].ID; 
                    }
                }
                for (var i = $scope.VisiteTypeList.length - 1; i > -1; i--) {
                    if ($scope.VisiteTypeList[i].isDefault) {
                        $scope.appointmentDetails.VisitTypeID = $scope.VisiteTypeList[i].ID;
                    }
                }
                for (var i = $scope.HealthcareProviderList.length - 1; i > -1; i--) {
                    if ($scope.HealthcareProviderList[i].isDefault) {
                        $scope.appointmentDetails.HealthCareProviderID = $scope.HealthcareProviderList[i].ID;
                    }
                }
             }
             EnableFollowUpAppointmentDetails();
        }
         //$scope.AssignDefaultInstep2();
         

          $scope.encounterDetails = {
            AppointmentDetailID: globalobject.currentEncounter.AppointmentDetailID
                   , PersonnelTypeID: globalobject.currentEncounter.PersonnelTypeID
                   , AppointmentStatusID: null
                   , VisitReasonID: null
                   , EncounterTypeIDs: null
                   , HealthCareEntityID: null
                   , HealthCareProviderID: null
                   , VisitTypeID: null
                   , ContactMethodID: null
                   , AppointmentDate: null
                   , AppointmentTimeIn: null
                   , AppointmentTimeOut: null
                   , EmailAddress: null
                   , CellPhoneNumber: null
                   , HomePhoneNumber: null
                   , EmployeeID: null
                   , SendNotificationMail: true
                   , AppointmentScheduledByName:globalobject.currentSession.username
                   , DepartmentID:null
                   , EmployeePK:null
                   , EncounterDetailID:0
                   , TimeIn:null
                   , TimeOut:null
                   , VisitDate:new Date()
                    ,allowDuplicate:false
        };

        // Get Location Department Loock up
        $scope.IsBreadCrumShow = true;
        if((utilityservices.GetCustomKeyValue('45', 'ShowDepBreadCrum')).toLowerCase() =='no'){
        $scope.IsBreadCrumShow = false;
        }
          $scope.getLocationDepartmentList = function () {
               var configs = {
                    url: "/WebServices/Foundation/OrganizationComponentService.asmx/GetDepartmentsWithID",
                    data:{showDeptBreadCrum:$scope.IsBreadCrumShow}                  
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                        sharedservices.parseDates(data.d.Object);
                        $scope.LocationDepartmentList = data.d.Object == null ? [] : data.d.Object;
                       // $scope.LocationDepartmentList.splice(0,0,'');
                        $scope.LocationDepartmentList.splice(0,0,{'Name': "-- Select --",'DepartmentID':null,'IsActive':false});

                  //$timeout(function(){$('#ddlLocationDepartment').val('-1');}, 1000);
                     
                     
                    }
                    else {
                        $scope.LocationDepartmentList = [];
                    }
                })
                .error(function () {
                    utilityservices.notify("error");
                })
            };

        //Bind Default label starth
  
         function BindDDllabels(){
               $scope.appointmentDetails.PersonnelType=$('#ddlPersonnelType option:selected').text();
               $scope.appointmentDetails.HealthCareEntity=$('#ddlHealthCareEntity option:selected').text();
               $scope.appointmentDetails.VisitReason=$('#ddlVisitReason option:selected').text();
               $scope.appointmentDetails.VisitType=$('#ddlVisitType option:selected').text();
               $scope.appointmentDetails.LocationDepartment =$('#ddlLocationDepartment option:selected').text();
               $scope.appointmentDetails.HealthCareProvider =$('#ddlHealthCareProvider option:selected').text();
           }

         // Get Employee By AppointmentID

         if(globalobject.employeesSelectedList.length>0){
           // $scope.employeesSelected=sharedservices.parseDates( globalobject.employeesSelectedList);//return from employee info.
           $scope.employeesSelected= globalobject.employeesSelectedList;//return from employee info.
         }

         function GetEmployeeByAppointmentID()
          {
            // Show loader
                $scope.employeeLoader = true;
                  $scope.showLoadingOverlay = true;
                 var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeDetails",
                     data: { AppointmentDetailID:  $scope.appointmentDetails.AppointmentDetailID,OccEmployeePk:0}
                };
                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);
                 $scope.employeesSelected.push( data.d.Object);
                 $scope.EmployeeStatusObj.EmployeeStatus.push(data.d.Object.OccEmploymentStatus.toString());               
                }).error(function () {
                    utilityservices.notify("error");
                })
            }

        function EnableFollowUpAppointmentDetails()
           {
           if($scope.isSinglePatient )
                    {
                        var EmpPKForFollowup ;
                        var EmployeeTypeId;
                        if( $scope.editMode )
                            {
                             EmpPKForFollowup=globalobject.employee.OccEmployeePk;
                             EmployeeTypeId=globalobject.employee.EmployeeTypeId;
                            }                            
                        else
                            {
                             EmpPKForFollowup=$scope.employeesSelected[0].OccEmployeePk;
                             EmployeeTypeId=$scope.employeesSelected[0].EmployeeTypeId;
                            
                            }

                       if(EmployeeTypeId == 1001 || EmployeeTypeId == 1004)
                       {
                             var configs = {
                                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/EnableFollowUpAppointmentDetails",
                                     data: { AppointmentDetailID:  $scope.appointmentDetails.AppointmentDetailID,VisitReasonId: $scope.appointmentDetails.VisitReasonID,EmpPk: EmpPKForFollowup,AppointmentTimeIn: $('#hdnTimeIn').val()}
                                };
                                sharedservices.xhrService(configs)
                                .success(function (data, status, headers, config) {
                                             if (data.d.IsOK) {                                             
                                            sharedservices.parseDates(data.d.Object);                                            
  
                                             $scope.IsFolllowUpSeleceted=true; 
                                             $scope.PrevappointmentDetails= data.d.Object== null ? [] : data.d.Object;
                                             $scope.PrevappointmentDetails.AppointmentTime = moment($scope.PrevappointmentDetails.AppointmentTime).format('MMMM DD YYYY');                                            
                                             $scope.appointmentDetails.VisitTypeID=data.d.Object.VisitTypeID;
                                             $scope.appointmentDetails.HealthCareEntityID=data.d.Object.HealthCareEntityID;
                                             if ($scope.PrevappointmentDetails.SendNotification)
                                                {
                                                    $scope.PrevappointmentDetails.SendNotificationText='Yes'
                                                }
                                              else
                                                {
                                                    $scope.PrevappointmentDetails.SendNotificationText='No'
                                                }       
                                             }
                                             else{
                                             $scope.IsFolllowUpSeleceted=false;                  
                                             }
                
                                }).error(function () {
                                    utilityservices.notify("error");
                                });
                     }
                }
           }
        //Bind Default Time
      $scope.TimeOutReSet =function(){
                $scope.TimeInHour =  $('#hdnTimeIn').val().split(':')[0];
                $scope.TimeInMinute =$('#hdnTimeIn').val().split(':')[1];
                $scope.TimeOutHour =  $('#hdnTimeOut').val().split(':')[0];
                $scope.TimeOutMinute = $('#hdnTimeOut').val().split(':')[1];
                 if($scope.TimeInHour==23){
                    $scope.TimeOutHour=23;
                    $scope.TimeOutMinute=59;
                    $scope.timeOut = sharedservices.setTime($scope.TimeOutHour, $scope.TimeOutMinute);
            }
        };

      function BindDefaultDateTime()
       {
               var date = new Date();
               var timeNow = date.getHours() + ":" + date.getMinutes() 
               $scope.Hour = timeNow.split(':')[0];
               $scope.Minut = timeNow.split(':')[1];

               $scope.appointmentDetails.AppointmentDate =date;
               $scope.myDate =date ;

               $scope.timeIn = sharedservices.setTime($scope.Hour,$scope.Minut);
               // TIME OUT
               $scope.timeOut = sharedservices.setTime(parseInt($scope.Hour,10)+1,$scope.Minut);
               // TIME STEPS
               $scope.hourStep = sharedservices.hourStep;
               $scope.minuteStep = sharedservices.minuteStep;

               $scope.TimeOutReSet();
         }

         function CheckForInUseIds() {
            var i, innerHTML, c = 0;
            var ddlReplace = '<option value="? object:null ?"></option>';
           if ($scope.appointmentDetails.DepartmentID != null) {
                for (i = $scope.LocationDepartmentList.length - 1; i > -1; i--) {
                    if ($scope.LocationDepartmentList[i].DepartmentId === $scope.appointmentDetails.DepartmentID) {
                        c++;
                    }
                }
                if (c == 0) {
                  $scope.LocationDepartmentList.push({ 'Name': $scope.appointmentDetails.DepartmentName,'DepartmentId': $scope.appointmentDetails.DepartmentID ,'DeptBreadCrum':$scope.appointmentDetails.DeptBreadCrum});
                }
              }
                
              

            c = 0;
            for (i = $scope.VisitReasonList.length - 1; i > -1; i--) {
                if ($scope.VisitReasonList[i].ID === $scope.appointmentDetails.VisitReasonID) {
                    c++;
                }
            }
            if (c == 0) {
                innerHTML = $('#ddlVisitReason').html();
                innerHTML = innerHTML.replace(ddlReplace, "");
                innerHTML = innerHTML + '<option value="' + $scope.appointmentDetails.VisitReasonID + '" selected="selected" >' + $scope.appointmentDetails.VisitReason + '</option>';
                $('#ddlVisitReason').html(innerHTML);
            }

            c = 0;
            for (i = $scope.VisiteTypeList.length - 1; i > -1; i--) {
                if ($scope.VisiteTypeList[i].ID === $scope.appointmentDetails.VisitTypeID) {
                    c++;
                }
            }
            if (c == 0) {
                innerHTML = $('#ddlVisitType').html();
                innerHTML = innerHTML.replace(ddlReplace, "");
                innerHTML = innerHTML + '<option value="' + $scope.appointmentDetails.VisitTypeID + '" selected="selected" >' + $scope.appointmentDetails.VisitType + '</option>';
                $('#ddlVisitType').html(innerHTML);
            }

            c = 0;
            for (i = $scope.HealthCareEntityList.length - 1; i > -1; i--) {
                if ($scope.HealthCareEntityList[i].ID === $scope.appointmentDetails.HealthCareEntityID) {
                    c++;
                }
            }
            if (c == 0) {
                innerHTML = $('#ddlHealthCareEntity').html();
                innerHTML = innerHTML.replace(ddlReplace, "");
                innerHTML = innerHTML + '<option value="' + $scope.appointmentDetails.HealthCareEntityID + '" selected="selected" >' + $scope.appointmentDetails.HealthCareEntity + '</option>';
                $('#ddlHealthCareEntity').html(innerHTML);
            }

            c = 0;
            for (i = $scope.HealthcareProviderList.length - 1; i > -1; i--) {
                if ($scope.HealthcareProviderList[i].ID === $scope.appointmentDetails.HealthCareProviderID) {
                    c++;
                }
            }
            if (c == 0) {
                innerHTML = $('#ddlHealthCareProvider').html();
                innerHTML = innerHTML.replace(ddlReplace, "");
                innerHTML = innerHTML + '<option value="' + $scope.appointmentDetails.HealthCareProviderID + '" selected="selected" >' + $scope.appointmentDetails.HealthCareProvider + '</option>';
                $('#ddlHealthCareProvider').html(innerHTML);
            }
            
            $timeout(function(){$('#ddlLocationDepartment').val($scope.appointmentDetails.DepartmentID);}, 1000);
            $timeout(function(){$('#ddlVisitReason').val($scope.appointmentDetails.VisitReasonID);}, 1000);
            $timeout(function(){$('#ddlVisitType').val($scope.appointmentDetails.VisitTypeID);}, 1000);
            $timeout(function(){$('#ddlHealthCareEntity').val($scope.appointmentDetails.HealthCareEntityID);}, 1000);
            $timeout(function(){$('#ddlHealthCareProvider').val($scope.appointmentDetails.HealthCareProviderID);}, 1000);
         }

        //check permission for appointment edit only.

        function CheckPermission()
        {
            if($scope.stepThruNumber==2 && $scope.editMode )
            {
                 if($scope.screenType!="encounter"){
                     $scope.IsPermission = $scope.funPermissionCheck(450002,"SelfOthers",$scope.appointmentDetails.CreatedBy);
                      }
             }
             else if($scope.stepThruNumber==3)
             {
              if($scope.screenType!="encounter"){
                     $scope.IsPermission = $scope.funPermissionCheck(450002,"SelfOthers",$scope.appointmentDetails.CreatedBy);
                      }
             }
        }

     // ENCOUNTER TYPES
         $scope.types = {
            name: null,
            selected: false
        }
        $scope.types = [];

        function BindEncounterType() {
             $scope.types=[];
                for (var i = 0; i < $scope.EncounterTypeList.length; i++) {
                    var EncounterType = {
                        "value": $scope.EncounterTypeList[i].ID,
                        "name": $scope.EncounterTypeList[i].Text,
                        "selected": $scope.EncounterTypes != null ? ($scope.EncounterTypes.indexOf($scope.EncounterTypeList[i].ID) >= 0 ? true : false) : false
                    }

                    $scope.types.push(EncounterType);
                }
            }

            BindDefaultDateTime();
           // $scope.getLocationDepartmentList();
            BindDDllabels();

        //****************************GET ALL LOOKUP VALUE  FROM  START GLOBALOBJECT END************************************************//
  
        // EMPLOYEE PROFILE SUMMARY
        $scope.employeeProfileSummaryView = false;
        $scope.toggleFullEmployeeSummary = function(){
            $scope.employeeProfileSummaryView = !$scope.employeeProfileSummaryView;
        }

        $scope.isExistingRecord = true;

        // STEPS
        $scope.wizardStepLabel = 'Title';
        $scope.saveButtonLabel = $filter('translate')('btnNext');
        $scope.stepThruNumber = $routeParams.step || 1;
        $scope.subStep = 1;
        $scope.loadingAction = false;

        if( $routeParams.step == 2 ){
            $scope.isSinglePatient = true;
        }

        $scope.editMode = false;

      
        if( globalobject.currentEncounter.AppointmentDetailID > 0 ){
            $scope.isSinglePatient = true;
            $scope.stepThruNumber = $routeParams.step || 3;
            
             $scope.IsDataLoaded=false;
             $scope.editMode = true;
             if($scope.screenType != "employeeinfo"){
                 GetEmployeeByAppointmentID();
             }
        }

      

        // $watch: stepThruNumber
        var watchStepNumber = function(num){
            switch ( parseInt(num) ){

                case 1:
                    $scope.wizardStepLabel = $filter('translate')('lblSelectPersonnel');
                    $scope.saveButtonLabel = $filter('translate')('btnNext');

                    break;

                case 2:
                    if( $scope.editMode ){
                        $scope.saveButtonLabel = $filter('translate')('btnSave');
                        $scope.wizardStepLabel =  $filter('translate')('lblEditAppointmentDetails');
                       
                    } else {
                        $scope.saveButtonLabel = $filter('translate')('btnNext');
                        $scope.wizardStepLabel = $filter('translate')('lblEnterVisitDetails');
                    }
                    break;

                case 3:
                    $scope.wizardStepLabel = $filter('translate')('lblSelectEncounters');
                    $scope.saveButtonLabel = $filter('translate')('btnSave');
                    break;

                default:
                    // Do something...
            }
        };
        
        $scope.$watch('stepThruNumber', function(newValue, oldValue) {
            watchStepNumber(newValue);
        });

        // ENABLE MODAL ANIMATION
        $scope.animationsEnabled = true;
      
        if ($scope.appointmentDetails.AppointmentDetailID == 0) {
            BindEncounterType();
        }

        // OPEN MODALS
        $scope.editEmployeeModal = function (obj) {
            //$scope.currentObject=obj;
            globalobject.currentObject = obj;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/patient-info-modal.html',
                controller: 'AppointmentActionModalCtrl',
                size: 'md'
                //scope:$scope
            });
        };


        /* ---------------------------------------------
         ------------------------------------------------
            STEP 1
         ------------------------------------------------
         --------------------------------------------- */

        $scope.showEmployeeList = false;
        $scope.noRecordsFound = false;

        $scope.employeeLookingFor = '';
      

        // Employee loader
        $scope.employeeLoader = false;

        function loadEmployeeList()
         {
            // Show loader
            $scope.employeeLoader = true;
              $scope.showLoadingOverlay = true;
             var configs = {
                url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                 data: { personnelTypeId:  $scope.appointmentDetails.PersonnelTypeID,freeTextSearch: $scope.employeeLookingFor, SupervisorPermission:globalobject.SupervisorPermission , EmployeeStatus: $scope.EmployeeStatusObj.EmployeeStatus.toString()}
            };
            sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
               sharedservices.parseDates(data.d.Object);
                $scope.employeeDatabase = data.d.Object== null ? [] : data.d.Object; 
                     BindSelectedEmployee();   
                      $scope.employeeLoader = false;
              $scope.showLoadingOverlay = false;   
                 $scope.IsDataLoaded=true;    
                 BindDDllabels();         
                   
            }).error(function () {
                    utilityservices.notify("error");
                })
        }
         $scope.EmployeeStatusList = [];
            function loadEmployeeStatusList() {
                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeStatusList"
                };
                sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.EmployeeStatusList = data.d.Object;
                   if($scope.EmployeeStatusObj.EmployeeStatus==""){
                  $scope.EmployeeStatusObj.EmployeeStatus.push('Active');
                }
                 $scope.getLocationDepartmentList();
            }).error(function () {
                utilityservices.notify("error");
            })
            }
            loadEmployeeStatusList();

          if(globalobject.currentEncounter.AppointmentDetailID > 0 ){
        
               getAppointmentDetails(); 
            }
           
            if($scope.screenType == 'EmployeeMedicalProfile' && !$scope.editMode)
             {
                 $scope.IsDataLoaded=false;
                 $scope.EmployeePK=globalobject.employee.ID;
                 loadEmployeeList();
                
              }

          function BindSelectedEmployee() {

          if($scope.screenType=="EmployeeMedicalProfile" && !$scope.editMode)
           {
               for (var i = 0; i < $scope.employeeDatabase.length; i++) {

                   if($scope.EmployeePK==$scope.employeeDatabase[i].ID)
                     {
                       $scope.employeesSelected.push($scope.employeeDatabase[i]);
                     }
                  }
             }
            $scope.employeeLoader = false;
            $scope.showLoadingOverlay = false;
        }
        $scope.$watch('employeeLookingFor', function () {
            if ($scope.employeeLookingFor.length > 1) {
                $scope.showEmployeeList = true;
                loadEmployeeList();

                // TEMPORARY FOR SHOWING NO RECORD FOUND:
                $scope.noRecordsFound = ($scope.employeeLookingFor == 'none') ? true : false;

            } else {
                $scope.showEmployeeList = false;
            }
        });

        //***************************GET PREVIUOS APPOINTMENT DETAILS FOR FOLLOWUP****************************************//

         $scope.ViewPreviousAppoitmentDetails = function () {
      
          var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/prev-AppointmentDetails-modal.html',
                controller: 'ViewPrevAppointmentCtrl',
                size: 'md',
                scope:$scope
            });
         };

          //****************************GET APPOINTMENT DETAIL BY ID START************************************************//

    function getAppointmentDetails()
        {
          $scope.showLoadingOverlay = true;
            configs = {
                url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAppointmentDetails",
                data: { AppointmentDetailID: $scope.appointmentDetails.AppointmentDetailID, Caller : "Appointment",VisitDate:null,Timenow: "" , TimeOut: "" }
            };

            sharedservices.xhrService(configs)
                  .success(getDataSuccess)
                  .error(getDataError);
        }
        function getDataSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                sharedservices.parseDates(data.d.Object);
                $scope.appointmentDetails = data.d.Object;
                $scope.Employee = JSON.parse("[" + $scope.appointmentDetails.EmployeeID + "]");
                $scope.EncounterTypes = JSON.parse("[" + $scope.appointmentDetails.EncounterTypeIDs + "]");
               // $scope.appointmentDetails.SendNotification=true;
                $scope.myDate = $scope.appointmentDetails.AppointmentDate ;
                  var intime = new Date();
                    intime.setHours($scope.appointmentDetails.AppointmentTimeIn.split(':')[0]);
                    intime.setMinutes($scope.appointmentDetails.AppointmentTimeIn.split(':')[1]);
                    $scope.timeIn = intime;
                   var outtime = new Date();
                     outtime.setHours($scope.appointmentDetails.AppointmentTimeOut.split(':')[0]);
                    outtime.setMinutes($scope.appointmentDetails.AppointmentTimeOut.split(':')[1]);
                    $scope.timeOut = outtime;
           
                   if( $scope.FromSOAListScreen && $scope.appointmentDetails.EncounterDetailID>0) 
                   {
                     $scope.EncounterExists=true;
                   }

                 //  loadEmployeeList();
                    CheckForInUseIds();
                   CheckPermission();
                   BindEncounterType();
                   EnableFollowUpAppointmentDetails();
                   
                 $scope.showLoadingOverlay = false;   
                 $scope.IsDataLoaded=true;   
            }
         
        };

        function getDataError(data, status, headers, config) {
                    utilityservices.notify("error");
        };
      

        //****************************GET APPOINTMENT DETAIL BY ID END************************************************//

        //Bind lables

         $scope.GetValue = function (type) {

            if (type == 'PersonnelType') {
                  globalobject.employeesSelectedList = [];
                  $scope.employeesSelected=[];
                  $scope.appointmentDetails.PersonnelType=$('#ddlPersonnelType option:selected').text();
                  if($scope.appointmentDetails.PersonnelTypeID!=null && $scope.appointmentDetails.PersonnelTypeID > 0){
                       loadEmployeeList();
                 }
              }
            else if (type == 'HealthCareEntity') {
               $scope.appointmentDetails.HealthCareEntity=$('#ddlHealthCareEntity option:selected').text();
               }
              else if (type == 'VisitReason') {
               $scope.appointmentDetails.VisitReason=$('#ddlVisitReason option:selected').text();
               EnableFollowUpAppointmentDetails();
               
              }
              else if (type == 'VisitType') {
               
               $scope.appointmentDetails.VisitType=$('#ddlVisitType option:selected').text();
            }
          
              else if (type == 'HealthCareProvider') {
                
                   $scope.appointmentDetails.HealthCareProvider =$('#ddlHealthCareProvider option:selected').text();
            }
        }
        $scope.GetDepartmentName = function(item){
           $scope.appointmentDetails.LocationDepartment =item.Name;
        };
        // FIND EMPLOYEE LIST
       
        $scope.selectEmployeeFromList = function (item) {
            var isItemSelected=false;
             angular.forEach($scope.employeesSelected, function (selecteditem) {
               if (selecteditem.ID==item.ID)
                       isItemSelected=true;
               });
               if(!isItemSelected)
               {
                 if($scope.screenType=="encounter")
                    {
                        $scope.employeesSelected=[];
                    }
                   $scope.employeesSelected.push(item);
               }
         }

        $scope.removeSelectedEmployee = function (item) {
            globalobject.employee = {};
            var index = $scope.employeesSelected.indexOf(item);
            $scope.employeesSelected.splice(index, 1);
              if( $scope.employeesSelected.length === 1 ){
                $scope.isSinglePatient = true;
                $scope.VisitReasonList=globalobject.VisitReasonList;
            }
        }

         $scope.addNewPatient = function () {
            globalobject.PersonnelTypeID  = $scope.appointmentDetails.PersonnelTypeID;
            globalobject.PersonnelTypeName = $scope.appointmentDetails.PersonnelType ;
            if( globalobject.currentEncounter.screenType != 'encounter')
            {
              globalobject.RedirectFrom = "Appointment";
            }
            else
            {
             globalobject.RedirectFrom = "Addencounter";
            }
            globalobject.currentEncounter.AppointmentDetailID = $scope.appointmentDetails.AppointmentDetailID;
            globalobject.employeesSelectedList  = $scope.employeesSelected;
            globalobject.employee = {} ;
            $location.path("/employeeinformation");
        };
        $scope.goToPatientInfoForm = function(employee){
            globalobject.PersonnelTypeID  = $scope.appointmentDetails.PersonnelTypeID;
            globalobject.PersonnelTypeName = $scope.appointmentDetails.PersonnelType ;
            if( globalobject.currentEncounter.screenType != 'encounter'){
              globalobject.RedirectFrom = "Appointment";
            }
            else
            {
             globalobject.RedirectFrom = "Addencounter";
            }
            globalobject.currentEncounter.AppointmentDetailID = $scope.appointmentDetails.AppointmentDetailID;
            globalobject.employee=employee;
            globalobject.employeesSelectedList  = $scope.employeesSelected;
            $location.path("/employeeinformation");
        };



        /* ---------------------------------------------
         ------------------------------------------------
            STEP 2
         ------------------------------------------------
         --------------------------------------------- */
        $scope.editEmployee = function () {
       if((globalobject.RedirectFrom=='EmployeeMedicalProfile')&&  $scope.isSinglePatient){
              $scope.goToPatientInfoForm($scope.employeesSelected[0])
       }
       else{
            $scope.stepThruNumber = 1;
            }
        }


        /* ---------------------------------------------
         ------------------------------------------------
            CANCEL FUNCTION
         ------------------------------------------------
         --------------------------------------------- */
        $scope.cancel = function(){
//        if($scope.FromSOAListScreen)
//        {
//          return;
//        }else
//        {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'CancelModalCtrl',
                size: 'sm',
                scope:$scope
            });
         //}
        };

          $scope.EncounterConfirmation=function(){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'CreateEncounterModalCtrl',
                size: 'sm',
                scope:$scope,

            });
        }

//        $scope.navigate=function()
//        {
//          $scope.stepThruNumber = 3;
//        };

        /* ---------------------------------------------
         ------------------------------------------------
            SAVE FUNCTION
         ------------------------------------------------
         --------------------------------------------- */
        $scope.editAppointment = function () {
            $scope.stepThruNumber = 2;
           // $scope.editMode = false;
        }
        
        $scope.SaveandContinue=function()
        {    

         if ($scope.EncounterTypes.length ==0 || ValidateForm()) {
                     utilityservices.notify("required");
                      $scope.showLoadingOverlay = false;
                       $scope.SaveandContinueflag=false; 
                    // $location.path("/appointmentcentral");
                }
                else
                {      
                if($scope.screenType!="encounter")
                {
                 if($scope.IsCreateEncounter){
                   $scope.SaveandContinueflag=true;         
                   $scope.save();
                  }
                  else{
                  $scope.EncounterConfirmation();
                  }
                }
                else{   
                $scope.SaveandContinueflag=true;         
                $scope.save();
                }
            }
        }

        $scope.save = function () {
             BindDDllabels();
             $scope.appointmentDetails.AppointmentDate =new Date($scope.myDate).toDateString();
             $scope.appointmentDetails.AppointmentTimeIn=$('#hdnTimeIn').val();
             $scope.appointmentDetails.AppointmentTimeOut=$('#hdnTimeOut').val();

             if($scope.employeesSelected.length>1) {$scope.VisitReasonList=globalobject.WithoutFollowUpVisitReasonList;}
             else {$scope.VisitReasonList=globalobject.VisitReasonList;}


            //debugger;
            if ($scope.stepThruNumber == 1) {
                // STEP 1
                        $scope.employeeLookingFor = '';
                        $scope.stepThruNumber = 2;
                        $scope.AssignDefaultInstep2();
//                          if( !$scope.editMode )
//                        $scope.appointmentDetails.VisitReasonID="1001";

                        if( $scope.employeesSelected.length === 1 ){
                            $scope.isSinglePatient = true;
                        } else if( $scope.employeesSelected.length > 1 ){
                            $scope.isSinglePatient = false;
                        }
                 } 
            else if ($scope.stepThruNumber == 2) {
                // STEP 2
               
                 if (ValidateForm()) {
                       utilityservices.notify("required");
                    $scope.showLoadingOverlay = false;  
                   }                   
                   else if($scope.editMode && $scope.AllowPastAppointmentandEncounters && !ValidateEncounterDate() ){
                    utilityservices.notify("warning",$filter('translate')('msgAppointmentCannotbescheduledtoFutureDates'));//$filter('translate')('msgAppointmentCannotbescheduledtoPreviousDates')
                   }                   
                   else if( !$scope.editMode && !$scope.AllowPastAppointmentandEncounters && ValidateAppointmentDate())
                   { 
                     utilityservices.notify("warning",$filter('translate')('msgAppointmentCannotbescheduledtoPreviousDates'));//$filter('translate')('msgAppointmentCannotbescheduledtoPreviousDates')
                   }
                   else if( Timevalidation())
                   {
                     utilityservices.notify("warning",$filter('translate')('msgTimeoutCannotbelessthanAppointmentTimeIn'));
                   }    
                                  
                else
                {
                    if( $scope.editMode )
                    {
                       if($scope.screenType=="encounter"){
                            saveEncounterDetails();
                           }
                        else
                           {
                           
                           saveAppointmentDetails();
                          }
                       
                      $scope.showLoadingOverlay = false;                     
                    }
                    if(!$scope.editMode)
                    {
                          $scope.stepThruNumber = 3;
                    }
                }
            }
             else if ($scope.stepThruNumber == 3) {
                if ($scope.EncounterTypes.length ==0 || ValidateForm()) {
                          utilityservices.notify("required");
                          $scope.showLoadingOverlay = false;
                          $scope.SaveandContinueflag=false; 
                     }
                else
                    {
                        // STEP 3
                        // $scope.stepThruNumber = 3;
                       // Display loading overlay
               
                        $scope.showLoadingOverlay = true;
                       

                       if($scope.screenType=="encounter" || $scope.SaveandContinueflag){
                            if(!$scope.SaveandContinueflag)
                            {
                              $scope.saveButtonLabel = $filter('translate')('btnSaving');
                              $scope.loadingAction = true;
                               //$scope.loadingAction = false;
                            }
                            saveEncounterDetails();
                        }
                    else
                        {
                         $scope.saveButtonLabel = $filter('translate')('btnSaving');
                         $scope.loadingAction = true;
                          saveAppointmentDetails();
                        }
                 }    
            }

        };

        //Select deselect encounter types.
        $scope.selectEncounterType= function(item){

         item.selected=!item.selected;
             if(item.selected){
               $scope.EncounterTypes.push(item.value)
             }
             else{
                 var index=$scope.EncounterTypes.indexOf(item.value);
                 $scope.EncounterTypes.splice(index, 1);
             }
        };

          function ValidateAppointmentDate() {
                var today = new Date();
                var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                var AppointmentDate = new Date($scope.appointmentDetails.AppointmentDate);                
               
                 if (AppointmentDate < date) {
                return true;
                  }
                else {
                    return false;
                }
            }
        function ValidateForm()
        {
              if ($scope.appointmentDetails.PersonnelTypeID == null  ||$scope.appointmentDetails.PersonnelTypeID == ''
                           || $scope.appointmentDetails.VisitReasonID == null ||$scope.appointmentDetails.VisitReasonID == ''
                           || $scope.appointmentDetails.HealthCareEntityID == null ||$scope.appointmentDetails.HealthCareEntityID==''
                           || $scope.appointmentDetails.HealthCareProviderID == null||$scope.appointmentDetails.HealthCareProviderID==''
                           || $scope.appointmentDetails.VisitTypeID == null||$scope.appointmentDetails.VisitTypeID==''
                           || $scope.appointmentDetails.AppointmentDate == null||$scope.appointmentDetails.AppointmentDate==''
                           || $scope.appointmentDetails.AppointmentTimeIn == null ||$scope.appointmentDetails.AppointmentTimeIn == ''
                           || $scope.employeesSelected.length == 0){
                             $scope.SaveandContinueflag=false;    
                           return true;

                           }
                            
                            if(($scope.IsDepartmentMandatoryCheck) && (($scope.screenType=="encounter"||$scope.screenType=="encounterDetails")&&($scope.appointmentDetails.DepartmentID == null || $scope.appointmentDetails.DepartmentID == undefined ||$scope.appointmentDetails.DepartmentID == ''))){
                              $scope.SaveandContinueflag=false;  
                               return true;} 
                            else if(($scope.IsDepartmentMandatoryCheck) && (($scope.screenType=="encounter"||$scope.screenType=="encounterDetails") && ($scope.appointmentDetails.DepartmentID.DepartmentID!=null && $scope.appointmentDetails.DepartmentID.DepartmentID==-1))){
                              $scope.SaveandContinueflag=false; 
                               return true;} 
                               
                return false;  
        }

     function Timevalidation(){

            $scope.TimeInHour = $scope.appointmentDetails.AppointmentTimeIn.split(':')[0];
            $scope.TimeInMinute = $scope.appointmentDetails.AppointmentTimeIn.split(':')[1];
            $scope.TimeOutHour = $scope.appointmentDetails.AppointmentTimeOut.split(':')[0];
            $scope.TimeOutMinute = $scope.appointmentDetails.AppointmentTimeOut.split(':')[1];
            if($scope.TimeInHour==23){
                    $scope.TimeOutHour=23;
                    $scope.TimeOutMinute=59;
                    $scope.appointmentDetails.AppointmentTimeOut="23:59";
            }

            $scope.TimeIn = sharedservices.setTime($scope.TimeInHour, $scope.TimeInMinute);
            $scope.TimeOut = sharedservices.setTime($scope.TimeOutHour, $scope.TimeOutMinute);

            if(moment($scope.TimeIn).isAfter($scope.TimeOut))
               {
                   return true;
               }
           return false;
       }
        

       
          //**************************** SAVE APPOINTMENT DETAIL START************************************************//

                function saveAppointmentDetails() {
                
                

                if(($scope.screenType=="encounterDetails" && $scope.editMode) ||$scope.appointmentDetails.PersonnelTypeID==1003 )
                   {
                            $scope.appointmentDetails.allowDuplicate=true;
                   }
                   else
                   {
                     $scope.appointmentDetails.allowDuplicate= $scope.allowDuplicate;
                   }
                 $scope.AppointmentDate=$scope.appointmentDetails.AppointmentDate;
                 $scope.AppTimein=$scope.appointmentDetails.AppointmentTimeIn;

                 if(($scope.appointmentDetails.DepartmentID!=null || $scope.appointmentDetails.DepartmentID!=undefined) && ($scope.appointmentDetails.DepartmentID.DepartmentID!=null && $scope.appointmentDetails.DepartmentID.DepartmentID==-1))
                 {
                 $scope.appointmentDetails.DepartmentID=null;
                 }                 
                  $scope.appointmentDetails.DepartmentID==undefined?null:$scope.appointmentDetails.DepartmentID;

                    $scope.appointmentDetails.EncounterTypeIDs = $scope.EncounterTypes.toString();
                    sharedservices.parseDates($scope.employeesSelected);
                    configs = {
                        url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SaveMultipleAppointment",
                        data: { appointmentObj: $scope.appointmentDetails, occHealthEmployeeObjList:$scope.employeesSelected }
                    };
                    sharedservices.xhrService(configs)
                      .success(saveDataSuccess)
                      .error(saveDataError);
                 }

               function saveEncounterDetails() {

                if(($scope.appointmentDetails.DepartmentID!=null || $scope.appointmentDetails.DepartmentID!=undefined) && ($scope.appointmentDetails.DepartmentID.DepartmentID!=null && $scope.appointmentDetails.DepartmentID.DepartmentID==-1))
                 {
                 $scope.appointmentDetails.DepartmentID=null;
                 }  
                 $scope.appointmentDetails.DepartmentID==undefined?null:$scope.appointmentDetails.DepartmentID;

                $scope.encounterDetails.allowDuplicate= $scope.appointmentDetails.PersonnelTypeID!=1003  ? $scope.allowDuplicate:true;
                     $scope.encounterDetails.AppointmentDetailID=$scope.appointmentDetails.AppointmentDetailID;          
                     $scope.encounterDetails.PersonnelTypeID=$scope.appointmentDetails.PersonnelTypeID;
                     $scope.encounterDetails.DepartmentID=$scope.appointmentDetails.DepartmentID;
                     $scope.encounterDetails.VisitTypeID=$scope.appointmentDetails.VisitTypeID;
                     $scope.encounterDetails.VisitReasonID=$scope.appointmentDetails.VisitReasonID;
                     $scope.encounterDetails.HealthCareProviderID=$scope.appointmentDetails.HealthCareProviderID;
                     $scope.encounterDetails.HealthCareEntityID=$scope.appointmentDetails.HealthCareEntityID;
                     $scope.encounterDetails.EncounterTypeIDs = $scope.EncounterTypes.toString();

                      $scope.encounterDetails.TimeIn= $scope.appointmentDetails.AppointmentTimeIn;
                      $scope.encounterDetails.TimeOut= $scope.appointmentDetails.AppointmentTimeOut;
                      if($scope.AllowPastAppointmentandEncounters && ValidateEncounterDate())
                      {
                      $scope.encounterDetails.VisitDate=  $scope.appointmentDetails.AppointmentDate;
                      }
                      else
                      {
                      $scope.encounterDetails.VisitDate= new Date().toDateString();
                      }
                        var today = new Date();                        
                         var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         var AppointmentDate = new Date($scope.encounterDetails.VisitDate);  

                        if(AppointmentDate.toDateString()==date.toDateString())
                        {
                           var date = new Date();
                           //var timeNow = date.getHours() + ":" + date.getMinutes() 
                           var timeNow = $filter('date')(date,'HH:mm');

                           $scope.PresentHour = timeNow.split(':')[0];
                           $scope.PresentMinut = timeNow.split(':')[1];             

                           $scope.encounterDetails.TimeIn = $scope.PresentHour+":"+$scope.PresentMinut;
                           $scope.PresentHour=parseInt($scope.PresentHour)+1;
                           $scope.encounterDetails.TimeOut = $scope.PresentHour+":"+$scope.PresentMinut;

                        }
                      $scope.encounterDetails.SendNotificationMail=$scope.appointmentDetails.SendNotification;

                       $scope.AppointmentDate=$scope.appointmentDetails.AppointmentDate;
                       $scope.AppTimein=$scope.appointmentDetails.AppointmentTimeIn;
                      sharedservices.parseDates($scope.employeesSelected);
                configs = {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveEncouterDetails",
                    data: { encounterObj: $scope.encounterDetails , occHealthEmployeeobj:$scope.employeesSelected[0]}
                };
                sharedservices.xhrService(configs)
                    .success(saveDataEncounterSuccess)
                     .error(saveDataError);
            }
                 function ValidateEncounterDate()
                 {

                  var today = new Date();
                var date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                var AppointmentDate = new Date($scope.appointmentDetails.AppointmentDate);
                  if (AppointmentDate > date) {
                   return false;
                  }
                else {
                    return true;
                  }
                 }
            function saveDataEncounterSuccess(data, status, headers, config)
            { 
            $scope.button_clicked = false;
            //$scope.appointmentDetails = data.d.Object;
                   if (data.d.IsOK) 
                   {
                       if(data.d.Object.AppointmentDetailID>0)
                       {
                           if($scope.SaveandContinueflag)
                           {
                               $scope.SaveandContinueflag=false;
                               globalobject.currentEncounter.AppointmentDetailID = data.d.Object.AppointmentDetailID;
                               globalobject.currentEncounter.EncounterDetailID = data.d.Object.EncounterDetailID==null?0:data.d.Object.EncounterDetailID;
                               globalobject.currentEncounter.EmployeePK = data.d.Object.EmployeePK==null?0: data.d.Object.EmployeePK;
                               utilityservices.notify("saved");
                                $location.path("/encounterdetails/");
                           }
                           else
                           {
                                $location.path("/appointmentcentral");
                           }
                       }
                          else if(data.d.Object.ErrorType=="Duplicatetime")
                       {
                                 $scope.SaveandContinueflag=false;
                                 $scope.loadingAction = false; 
                                 $scope.showLoadingOverlay = false;
                                 $scope.saveButtonLabel = $filter('translate')('btnSave');

                          var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/OccHealth/modals/duplicate-app-time-confirmation-modal.html',
                        controller: 'duplicatetimeAppointmentCtrl',
                        size: 'sm',
                        scope:$scope
                        });
                
                } 
                       else
                       {
                       $scope.allowEncounter=true;
                       var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/duplicate-app-confirmation-modal.html',
                controller: 'duplicateAppointmentCtrl',
                size: 'sm',
                scope:$scope
            });
                           $scope.SaveandContinueflag=false;
                             $scope.loadingAction = false; 
                             $scope.showLoadingOverlay = false;
                             $scope.saveButtonLabel = $filter('translate')('btnSave');
                       }

                  }
            }

            function saveDataSuccess(data, status, headers, config) {
                $scope.button_clicked = false;
                if (data.d.IsOK) {

                 if(data.d.Object.AppointmentDetailID>0)
                {  
                    sharedservices.parseDates(data.d.Object);
                   
                      $scope.showLoadingOverlay = false;
                          if($scope.FromSOAListScreen)
                          {
                             if($scope.stepThruNumber==2)
                             {
                               $scope.stepThruNumber=3;
                             }
                                $scope.saveButtonLabel = $filter('translate')('btnSave');
                                $scope.loadingAction = false;  
                          }
                          else{
                                  if(globalobject.RedirectFrom == 'EmployeeMedicalProfile')
                                  {
                                      $location.path("/employeemedicalprofile");
                                  }
                                  else{
                                          if($scope.screenType=="encounterDetails")
                                              {
                                                 globalobject.RedirectFrom = 'Encounter';
                                                 $location.path("/encounterdetails");
                                              }
                                          else
                                             {
                                                 $location.path("/appointmentcentral");
                                             }
                                       }
                             }
                         utilityservices.notify("saved");
                  //  $scope.Hour = $scope.appointmentDetails.AppointmentTime.substring(0, 2);
                   // $scope.Minut = $scope.appointmentDetails.AppointmentTime.substring(3, 5);
                } 
                else if(data.d.Object.ErrorType=="Duplicatetime")
                {
                                 $scope.SaveandContinueflag=false;
                                 $scope.loadingAction = false; 
                                 $scope.showLoadingOverlay = false;
                                 $scope.saveButtonLabel = $filter('translate')('btnSave');

                  var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/duplicate-app-time-confirmation-modal.html',
                controller: 'duplicatetimeAppointmentCtrl',
                size: 'sm',
                scope:$scope
                });
                
                }               
                 else
                    {
                    //toastr.error($filter('translate')('msgAppointmentalreadyexistsfortoday'));
                               $scope.SaveandContinueflag=false;
                                 $scope.loadingAction = false; 
                                 $scope.showLoadingOverlay = false;
                                 $scope.saveButtonLabel = $filter('translate')('btnSave');


                                 var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/OccHealth/modals/duplicate-app-confirmation-modal.html',
                controller: 'duplicateAppointmentCtrl',
                size: 'sm',
                scope:$scope
            });

            if($scope.allowDuplicate==true)
            {

            }

                    }
                }
            };

            function saveDataError(data, status, headers, config) {
                 utilityservices.notify("error");
            };

            //*****************************SAVE APPOINTMENT DETAIL END************************************************//
        /* ---------------------------------------------
         ------------------------------------------------
            BACK BUTTON
         ------------------------------------------------
         --------------------------------------------- */
        $scope.back = function(){
            if ($scope.stepThruNumber === 1) {
                $location.path("/appointmentcentral");
            } else if ($scope.stepThruNumber == 2) {
             if(globalobject.RedirectFrom == 'EmployeeMedicalProfile'){
              $location.path("/employeemedicalprofile");
             }
             else
             {
                $scope.stepThruNumber = 1;
                $scope.employeeLookingFor = '';
             }
            } else if ($scope.stepThruNumber == 3) {
                $scope.stepThruNumber = 2;
            }
        }

        /* ---------------------------------------------
         ------------------------------------------------
            JQUERY
         ------------------------------------------------
         --------------------------------------------- */
        $('html').click(function() {
            $scope.showEmployeeList = false;
            $scope.employeeLookingFor = '';
            $scope.$apply();
        });

        $('.picklist-option-list-outter').click(function(event){
            event.stopPropagation();
            $scope.showEmployeeList = true;
            $scope.$apply();
        });


    }])
