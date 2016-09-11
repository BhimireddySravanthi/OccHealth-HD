(function () {
    angular.module("app")
        .controller("postOfferPhysicalCtrl", postOfferPhysicalCtrl);

    function postOfferPhysicalCtrl($scope, $timeout, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {
        
        $scope.changeSubView = sharedservices.changeSubView;
        $scope.Check = false;

        $scope.globalobject = globalobject;
        $scope.navBarOptions = {
            detailsFormId: 1006,
           // resultsFormId: undefined,
           // investigationFormId: undefined
        };

        $scope.showSubNavbars = true;
        $scope.IsDisable = false;

        $scope.hourStep = sharedservices.hourStep;
        $scope.minuteStep = sharedservices.minuteStep;

        $scope.DrawTimet = new Date();

        // -------------------------------------- GET DATA FROM globalobject ---------------------------------------------------------------

        var strGlobalPostOfferPhysicalID = globalobject.currentEncounter.ExposureEncounterSummaryID;
        var strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
        var strGlobalEncounterDetailID = globalobject.currentEncounter.EncounterDetailID;


        //----------------------------------------POST OFFER PHYSICAL ENCOUNTER TYPE OBJECT----------------------------------------------

           $scope.postOfferPhysicalRecord = {
              PostOfferPhysicalID: strGlobalPostOfferPhysicalID
            , AppointmentEncounterTypeID: strGlobalAppointmentEncounterTypeID
            , SampleID: ""
            , PhysicalResult: null
            , MedicalQuestionnaire: null
            , POET: null
            , OnHoldReason : ""
            , DateAudiometricTestCompleted: ""
            , DateDrugAlcoholTestCompleted: ""
            , DateVisionTestCompleted: ""
            , PostOfferPhysicalNote: ""
            , EncounterStatus: 1002
            , ReasonEncounterIncomplete: ""
            , DiagnosticMethodID: null
            , ScheduleFollowUp: false
            , StatusTypeID: ""
           
        };

        //----------------------------------------DROPDOWN LIST--------------------------------------------------------------------------




            $scope.ActivityStatusList = globalobject.ActivityStatusList;
            $scope.DiagnosticMethodList = globalobject.DiagnosticMethodList;
            $scope.TestTypeList = globalobject.TestTypeList;

            $scope.createdBy = globalobject.currentSession.userid;

            $scope.GoToPreviousPage = function () {
                 $window.history.back();
            }
       
            
            $scope.cancelPOP = function () {

                if ($scope.frmPOP.$dirty) {

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
       
        //--------------------------------CHECK IN USE IDS DETAILS FOR DROP-DOWN BINDING-----------------------------------------------------

        function CheckForInUseIdsDetails() {
         var i, innerHTML, c = 0;
                 var ddlReplace = '<option value="? object:null ?"></option>';

                 if ($scope.postOfferPhysicalRecord.DiagnosticMethodID != null) {
                     for (i = $scope.DiagnosticMethodList.length - 1; i > -1; i--) {
                         if ($scope.DiagnosticMethodList[i].DiagnosticMethodID === $scope.postOfferPhysicalRecord.DiagnosticMethodID) {
                             c++;
                         }
                     }
                     if (c == 0) {
                         innerHTML = $('#ddlDiagonosticMethodList').html();
                         innerHTML = innerHTML.replace(ddlReplace, "");
                         innerHTML = innerHTML + '<option value="' + $scope.postOfferPhysicalRecord.DiagnosticMethodID + '" selected="selected" >' + $scope.postOfferPhysicalRecord.DiagnosticMethodTitle + '</option>';
                         $('#ddlDiagonosticMethodList').html(innerHTML);
                     }
                 }

                 setTimeout(function () { $('#ddlDiagonosticMethodList').val($scope.postOfferPhysicalRecord.DiagnosticMethodID); }, 1000);

                 setTimeout(function () { $('#ddlHealthcareProvider').val($scope.scheduleFollowUp.HealthCareProviderID); }, 1000);

                 setTimeout(function () { $('#ddlFollowType').val($scope.scheduleFollowUp.FollowUpTypeID); }, 1000);
        }

        $scope.resetSchedulefollwupdetails = function () {
                 $scope.postOfferPhysicalRecord.ScheduleFollowUp = false;
             }

       //------------------------------------------------------------------ INTIALIZATION FOR ENCOUNTERDETAILS ----------------------------------------------------------------

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
                        strGlobalPostOfferPhysicalID =globalobject.currentEncounter.ExposureEncounterSummaryID;
                        strGlobalAppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;
                        $scope.getPostOfferPhysical();
                        
                        if ($scope.postOfferPhysicalRecord.postOfferPhysicalRecordID != 0 )
                            CheckForInUseIdsDetails();
                    });

             };
          
         

           $scope.getPostOfferPhysical = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/POPService.asmx/GetPOPDetails",
                     data: { EncounterDetailID: strGlobalEncounterDetailID , PostOfferPhysicalID : strGlobalPostOfferPhysicalID }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };

             
             function getDetailDataSuccess(data, status, headers, config) {
             
                 if (data.d.IsOK) {
                
                  
                     sharedservices.parseDates(data.d.Object);
                     $scope.postOfferPhysicalRecord = data.d.Object;
                     strGlobalPostOfferPhysicalID = $scope.postOfferPhysicalRecord.PostOfferPhysicalID;
                     $scope.postOfferPhysicalRecord.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

                    
                     
                     if($scope.postOfferPhysicalRecord.EncounterStatus == null || $scope.postOfferPhysicalRecord.EncounterStatus == undefined ||  $scope.postOfferPhysicalRecord.EncounterStatus == '') {
                        $scope.postOfferPhysicalRecord.EncounterStatus =   1002;
                     }
                     if($scope.postOfferPhysicalRecord.ScheduleFollowUp == null || $scope.postOfferPhysicalRecord.ScheduleFollowUp == undefined ||  isNaN($scope.postOfferPhysicalRecord.ScheduleFollowUp) ) {
                        $scope.postOfferPhysicalRecord.ScheduleFollowUp = false;
                     }

                    
                     
                if ($scope.postOfferPhysicalRecord.ScheduleFollowUp && strGlobalPostOfferPhysicalID != 0) {

                    $scope.getScheduleFollowUpDetails();
                }

            }

             };

             
             function getDetailDataError(data, status, headers, config) {

             };    

      //-------------------------------------------------------------------------------------SAVE ENCOUNTERS DETAILS-------------------------------------------------
              $scope.savePostOfferPhysical = function () {

                 $scope.saveStatus = true;
                 $scope.msg = '';
                  var currentDate = new Date().setHours(0,0,0,0);

                 $scope.postOfferPhysicalRecord.AppointmentEncounterTypeID = globalobject.currentEncounter.AppointmentEncounterTypeID;

       //-----------------------------------MODEL NULL------------------------------------------------//
        if(!$scope.postOfferPhysicalRecord.PhysicalResult) {
                      $scope.postOfferPhysicalRecord.MedicalQuestionnaire = null;
                      $scope.postOfferPhysicalRecord.OnHoldReason = '';
                      $scope.postOfferPhysicalRecord.POET = null;
             }

            if($scope.postOfferPhysicalRecord.MedicalQuestionnaire == 1001 && $scope.postOfferPhysicalRecord.PhysicalResult == true) {
                      $scope.postOfferPhysicalRecord.POET = null;
                      $scope.postOfferPhysicalRecord.OnHoldReason = '';  
            }

            if($scope.postOfferPhysicalRecord.MedicalQuestionnaire == 1000 && $scope.postOfferPhysicalRecord.PhysicalResult == true) {
                      $scope.postOfferPhysicalRecord.OnHoldReason = '';  
            }

            if($scope.postOfferPhysicalRecord.EncounterStatus != 1003) {
                    $scope.postOfferPhysicalRecord.ReasonEncounterIncomplete = '';
            }
        //--------------------------------------------------------------------------------------------//
                
      //------------------------------------VALIDATION-------------------------------------------------------------------------------------------------------------------------//

              if($scope.postOfferPhysicalRecord.PhysicalResult == null
             || ($scope.postOfferPhysicalRecord.PhysicalResult == true && ($scope.postOfferPhysicalRecord.MedicalQuestionnaire == null 
             || ($scope.postOfferPhysicalRecord.MedicalQuestionnaire != 1001 && ($scope.postOfferPhysicalRecord.POET == null 
             || ($scope.postOfferPhysicalRecord.MedicalQuestionnaire == 1002 && ($scope.postOfferPhysicalRecord.OnHoldReason == '' || $scope.postOfferPhysicalRecord.OnHoldReason == null))))))
             || $scope.postOfferPhysicalRecord.DateAudiometricTestCompleted == null || $scope.postOfferPhysicalRecord.DateAudiometricTestCompleted == ''
             || $scope.postOfferPhysicalRecord.DateDrugAlcoholTestCompleted  == null || $scope.postOfferPhysicalRecord.DateDrugAlcoholTestCompleted == '' 
             || $scope.postOfferPhysicalRecord.DateVisionTestCompleted == null ||  $scope.postOfferPhysicalRecord.DateVisionTestCompleted == ''
             || $scope.postOfferPhysicalRecord.PostOfferPhysicalNote == '' || $scope.postOfferPhysicalRecord.PostOfferPhysicalNote == null
             || $scope.postOfferPhysicalRecord.EncounterStatus == null || ( $scope.postOfferPhysicalRecord.EncounterStatus == 1003 && ($scope.postOfferPhysicalRecord.ReasonEncounterIncomplete == '' || $scope.postOfferPhysicalRecord.ReasonEncounterIncomplete == null)))
              {
              

                     $scope.saveStatus = false;
                     $scope.msg = $filter('translate')('msgRequiredfieldmustbecompleted');
              }

            
             if($scope.saveStatus && currentDate < new Date($scope.postOfferPhysicalRecord.DateAudiometricTestCompleted).setHours(0,0,0,0)) {
                 $scope.saveStatus = false;
                 $scope.msg = $filter('translate')('msgDateAudiometricTestCompletedShouldNotBeGreaterThanCurrentDate');
             }

             if($scope.saveStatus && currentDate < new Date($scope.postOfferPhysicalRecord.DateDrugAlcoholTestCompleted).setHours(0,0,0,0)) {
                 $scope.saveStatus = false;
                 $scope.msg = $filter('translate')('msgDateDrugAlcoholTestCompletedShouldNotBeGreaterThanCurrentDate');
             }
             
             if($scope.saveStatus && currentDate < new Date($scope.postOfferPhysicalRecord.DateVisionTestCompleted).setHours(0,0,0,0)) {
                 $scope.saveStatus = false;
                 $scope.msg = $filter('translate')('msgDateVisionTestCompletedShouldNotBeGreaterThanCurrentDate');
             }
            
            if($scope.saveStatus && $scope.postOfferPhysicalRecord.ScheduleFollowUp) {
                    
                    $scope.ValidateSF();

              }
                 
              if ($scope.saveStatus) {
              $scope.showLoadingOverlay = true;
                $scope.loadingAction = true;
                     var configs = {
                         url: "/WebServices/OccupationalHealth/EncounterTypes/POPService.asmx/SavePOPDetails",
                         data: { POPDetailsObj: $scope.postOfferPhysicalRecord }
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

             
             function saveDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     $scope.postOfferPhysicalRecord.PostOfferPhysicalID = data.d.Object.PostOfferPhysicalID; 
                     strGlobalPostOfferPhysicalID = data.d.Object.PostOfferPhysicalID;
                     globalobject.currentEncounter.ExposureEncounterSummaryID = strGlobalPostOfferPhysicalID;

                     $scope.frmPOP.$dirty = false;

                     if ($scope.postOfferPhysicalRecord.ScheduleFollowUp == false) {
                            
                        $scope.emptySchedulefollowupObject();
                     }


                     if($scope.postOfferPhysicalRecord.ScheduleFollowUp) {
                        strGlobalPostOfferPhysicalID=data.d.Object.PostOfferPhysicalID;
                        
                        $scope.saveScheduleFollowUpDetails();
                        sharedservices.parseDates(data.d.Object);
                     }

//                     if(!$scope.postOfferPhysicalRecord.ScheduleFollowUp) {
//                        $scope.scheduleFollowUp = {};
//                     }
//                     $scope.scheduleFollowUp.AppointmentScheduledByTitle = globalobject.currentSession.username;

                    
            else{
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
                             if($scope.postOfferPhysicalRecord.ScheduleFollowUp == false){
                           utilityservices.notify("saved");
                           }
                     }
                 }
             };

             function saveDetailDataError(data, status, headers, config) {
                $scope.showLoadingOverlay = false;
                $scope.loadingAction = false;
             };
   };
 
})();

