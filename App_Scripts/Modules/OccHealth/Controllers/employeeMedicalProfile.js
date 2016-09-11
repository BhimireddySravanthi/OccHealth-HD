angular.module("app")
    .controller("ohEmpMedicalProfile", ["$scope",
        "$filter",
        "$location",
        "$modal",
        "$log",
        "sharedservices",
        "utilityservices",
        "toastr",
        "$http",
        "globalobject","$route",
        function ($scope, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject,$route) {


            globalobject.currentPage = "Medical Profile";
            $scope.actionItems =[];
            
            $scope.employeeSelected=false;
            $scope.appointmenttotalList=[];
              // SHOW SUB NAV-BARS
            $scope.showSubNavbars = true;

            //Attachment Initialisation
            globalobject.employeesSelectedList = [];
            $scope.EncounterAttachment = [];
            $scope.EncounterTypeAttachment = [];
            $scope.ClinicNotesAttachment = [];
            $scope.ActionItemAttachment = [];

            $scope.LengthOfAttachments = 0;
           globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;

            $scope.appointmentStatusID=null;
            $scope.PersonnelTypeID=0;
            $scope.employeeLookingFor="";
            $scope.employeeDetails=[];
            $scope.selectedEmployeewithID="";
            $scope.selectedEmployee={};
            $scope.reloadingEmployee=false;
            globalobject.RedirectFrom='EmployeeMedicalProfile';
            $scope.EmployeeIDs= null;
            //$scope.EmployeeStatus= [];
            globalobject.DuplicateAppointmentfromScreen = "EmployeeMedicalProfile";
            $scope.allowDuplicate = false;
             
                $scope.selectEmployeeStatus={};
               $scope.selectEmployeeStatus.EmployeeStatus=[];

             //$scope.selectEmployeeStatus = {EmployeeStatus : ""};
             if(globalobject.selectEmployeeStatus.EmployeeStatus !=null && globalobject.selectEmployeeStatus.EmployeeStatus !="")
             $scope.selectEmployeeStatus.EmployeeStatus=globalobject.selectEmployeeStatus.EmployeeStatus;
            $scope.findEmployeeList=[];
    		// CHANTE SUBVIEW FUNCTION
    		$scope.changeSubView = sharedservices.changeSubView;
            // Default view:
            // $scope.url = "/OccHealth/Medical-Profile/dashboard.html";

           
                  loadEmployeeList();
                  if(globalobject.currentEncounter.EmployeePK>0)
                  {
                   $scope.employeeSelected=true;
                     $scope.selectedEmployee.ID= globalobject.currentEncounter.EmployeePK;
                  }
                  else
                  {
                    $scope.selectedEmployee.ID= null;
                  }
                  $scope.EmployeePK= globalobject.currentEncounter.EmployeePK;                
                  globalobject.currentEncounter.screenType = 'EmployeeMedicalProfile';
                  globalobject.RedirectFrom= 'EmployeeMedicalProfile';
                  globalobject.initalreDirection = "EmployeeMedicalProfile";
            
            

            $scope.$watch(function () {
                return sharedservices.subViewUrl
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.url = sharedservices.subViewUrl;
                }
            });
            
           
                $scope.Attachmentconfigs = {
                MaxFileSize: '',
                ProhibitedFileExtensions: '',
                LocationID: '',
                AttachmentType: 'Encounter',
                Module: 'OccHealth',
                ID:globalobject.currentEncounter.EmployeePK,
                Attachments: [],
                showUpload: true,
                getServiceConfig: {
                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAttachmentsByEmployeeID",
                    data: { EmployeeId: globalobject.currentEncounter.EmployeePK, DocType:'' }
                    
                },
                saveService: {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/SaveDocumentReference",
                    data: { ID: globalobject.currentEncounter.EncounterDetailID, DocumentIds: '', DocType: 'Encounter' }
                },
                deleteService: {
                    url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/DeleteAttachments",
                    data: { ID: globalobject.currentEncounter.EncounterDetailID, DocumentIds: '', DocType: 'Encounter' }
                }
            };

            // ENCOUTER TYPE VIEW FUNCTION
            $scope.selectType = function(viewId){
                // Update globalobject with viewId:
                // Change subview:
                $scope.changeSubView(viewId);
            }

              //  Function to Get Encounter Types ******************

            $scope.loadEncounters = function () {
            $scope.Encounters=[];
                   var configs = {
                    url: "../WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/GetEncounterDetails",
                    data: {employeePK: $scope.EmployeePK}

                };
                sharedservices.xhrService(configs)
              .success(function (data, status, headers, config) {
                  

                  if (data.d.IsOK) {
                      sharedservices.parseDates(data.d.Object);
                      $scope.EncounterList = data.d.Object.EncounterList;
                      

                      $scope.Encounters.push({EncounterTypeDescription: "All"
                       ,Count: $scope.EncounterList.length
                       ,EncounterTypeID:0
                       });// To be displayed

                      angular.forEach(globalobject.EncounterTypeList, function (Object, index) {

				        $scope.Encounters.push({EncounterTypeDescription: Object.Text
                        ,Count:(_.where($scope.EncounterList, { EncounterTypeID: Object.ID }).length)
                        , EncounterTypeID:Object.ID
                        }); 
                        });

                        // Function to to handle Encounter type events ******************
            $scope.encounterTypeAction = function (item) {
            globalobject.EncounterTypeID=item.EncounterTypeID;
            globalobject.EncounterTypeDescription=item.EncounterTypeDescription;
            globalobject.EncounterList=$scope.EncounterList;
            $scope.changeSubView(2009);
            } 
                  }
              })
            };

             function loadEmployeeList() {               
                    var configs = {
                        url: "/WebServices/Foundation/EmployeeListService.asmx/GetOccHealthEmployeeNamesWithIDs",
                        data: { personnelTypeId: $scope.PersonnelTypeID, freeTextSearch: "", SupervisorPermission: globalobject.SupervisorPermission, EmployeeStatus: $scope.selectEmployeeStatus.EmployeeStatus.toString() }
                    };
                    sharedservices.xhrService(configs)
                   .success(function (data, status, headers, config) {
                       if (data.d.IsOK) {
                       $scope.findEmployeeList = data.d.Object==null?[]:data.d.Object;
                       }
                    })
                   .error(function () {
                         utilityservices.notify("error");
                    })
            }
          

           
            $scope.findEmployeeStatusList = [];
            function loadEmployeeStatusList() {
                // Show loader
                $scope.employeeLoader = true;

                var configs = {
                    url: "/WebServices/Foundation/EmployeeListService.asmx/GetEmployeeStatusList"
                };
                sharedservices.xhrService(configs)
            .success(function (data, status, headers, config) {
                $scope.findEmployeeStatusList = data.d.Object;
                if($scope.selectEmployeeStatus.EmployeeStatus==""){
              $scope.selectEmployeeStatus.EmployeeStatus.push("Active");
              }
                loadEmployeeList();
            }).error(function () {
                utilityservices.notify("error");
            })
            }
            loadEmployeeStatusList();

             $scope.$watch('selectEmployeeStatus.EmployeeStatus', function (newValue, oldValue) {
                if (newValue != oldValue) {
               globalobject.selectEmployeeStatus.EmployeeStatus= $scope.selectEmployeeStatus.EmployeeStatus;
                    loadEmployeeList();
                }
               
            });

           
            /////Employee Status List End


               $scope.SelectEmployeeDetails=function() {
            var configs = {
                url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectEmployeeDetails",
                data: { employeePK: $scope.EmployeePK, appointmentStatusID: null }
            };
             sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    if (data.d.IsOK) {
                       // sharedservices.parseDates(data.d.Object);                          
                            $scope.employeeDetails = data.d.Object==null?[]:data.d.Object;
                            //$scope.selectEmployeeStatus.EmployeeStatus="";
                            $scope.selectEmployeeStatus.EmployeeStatus=[];
                            $scope.selectEmployeeStatus.EmployeeStatus.push($scope.employeeDetails.EmployementStatus);
                            globalobject.employeeDetails=$scope.employeeDetails==null?[]:$scope.employeeDetails;
                            $scope.appointmentList = data.d.Object.AppointmentList==null?[]:data.d.Object.AppointmentList;
                            $scope.appointmenttotalList=data.d.Object.AppointmentList;   

                            $scope.selectedEmployeewithID=$scope.employeeDetails.LastName;  
                            globalobject.currentEncounter.EmployeePK =$scope.EmployeePK; 
                            globalobject.currentEncounter.EmployeeID =$scope.employeeDetails.EmployeeID;                           
                                                    
                            AppointmentListCount();
                            $scope.employeeSelected=true;
                            $scope.showLoadingOverlay = false;
                            $scope.SyncToHRMS();
                    }
                    else {
                        $scope.appointments = [];
                    }
                })
                .error(function () {
                  utilityservices.notify("error");
                })
            } 
               $scope.appointmentsListByStatus = function(viewId){
                     $scope.appointmentStatusID =viewId;
                       if($scope.employeeSelected)
                       {
                        $scope.SelectEmployeeDetails();
                       }
              }
             $scope.appointmentsListByStatus(null);
	        // HEADER DROPDOWN
	        $scope.toggled = function (open) {
	            // $log.log('Dropdown is now: ', open);
	        };


            $scope.goToEmployeeProfile = function (employee) {
                $scope.showLoadingOverlay = true;
                $scope.EmployeePK = employee.ID;
                $scope.appointmentStatusID = null;
                $scope.employeeSelected=false;

                 globalobject.currentEncounter.EmployeePK=$scope.EmployeePK ;
                 globalobject.employee = employee;
                 $route.reload();
                  $scope.employeeSelected=true;
                  //$location.path("/employeemedicalprofile");
                $scope.employeeSelected=true;
                $scope.SelectEmployeeDetails();
                $scope.loadEncounters();
                $scope.loadClinicNotes();
                $scope.loadActionItems();
                $scope.loadAttachments();
            }

	        // HEADER DROPDOWN MENU ITEMS
	        $scope.menuItems = [
	            {
	                'label': 'lblAppointmentCentral',
	                'link': '#appointmentcentral'
                }, {
	                'label': 'lblInventory',
	                'link': '#'
                }, {
	                'label': 'lblMedicalForms',
	                'link': '#'
                }
            ];
	        $scope.currentMenuItem = $scope.menuItems[0];


           function AppointmentListCount() {
           if($scope.appointmentList.length>0){
                 $scope.upcomingAppointments= _.where($scope.appointmenttotalList, { AppointmentStatusID: 1000 }).length;
                 $scope.cancelledAppointments= _.where($scope.appointmenttotalList, { AppointmentStatusID: 1001 }).length;
                 $scope.completedAppointments= _.where($scope.appointmenttotalList, { AppointmentStatusID: 1003 }).length;            
                 $scope.noShowAppointments= _.where($scope.appointmenttotalList, { AppointmentStatusID: 1002 }).length;
                 $scope.allAppointments=$scope.appointmentList.length;
                     if( $scope.appointmentStatusID!=null)
                     {
                        $scope.appointmentList=  _.where($scope.appointmenttotalList, { AppointmentStatusID: parseInt($scope.appointmentStatusID) });    
                     }
                     else
                     {
                       $scope.appointmentList=  $scope.appointmenttotalList;   
                     } 
            }
            else
            {
                 $scope.upcomingAppointments= 0;
                 $scope.cancelledAppointments= 0;
                 $scope.completedAppointments= 0;          
                 $scope.noShowAppointments= 0;
                 $scope.allAppointments=0;
            }
           $scope.changeSubView(2011);
        }
        	// ENCOUNTER TYPE LIST
	        $scope.displayEncounterTypes = function (data) {
	            //send as string and parse here as JSON and return
	            var obj = data;
	            return obj;
	        };
            $scope.encounterTypes = []; 
            $scope.EncounterTypeTitle = '';
            $scope.viewEncounterType = function(name, viewID){
                // Set Encounter Type Title
                $scope.EncounterTypeTitle = name;
                // Change subView
                $scope.changeSubView( viewID );
            }

            // ADD APPOINTMENT
            $scope.add = function () {
                //put the path for encounter type details screen
                // globalobject.currentEncounter = { 'id': id };
                 globalobject.currentEncounter.AppointmentDetailID=0;
                  globalobject.currentEncounter.PersonnelTypeID= globalobject.employeeDetails.PersonnelTypeID;
                $location.path("/add/2");
            }
        
            //goto AppointmentDetails
            $scope.gotoAppointment = function (item) {
                if(item.NoShow === false && item.Cancelled === false){
                    //send data through factory method
                    globalobject.currentEncounter = { 'id': item.AppointmentID };
                    $location.path("/add/3");
                }
            };

            //goto EncounterDetails
            $scope.gotoEncounter = function (id) {
                //send data through factory method
                globalobject.currentEncounter = { 'id': id };
                $location.path("/encounterdetails/");
            };
            
            // ACTION ITEMS
            $scope.actionItems = [];
           

        //Clinic Notes Section
                
                $scope.clinicNotes = [];

                $scope.loadClinicNotes = function () {
                var configs = {

                    url: "../WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectClinicNoteList",
                    data: { EmployeeId: globalobject.currentEncounter.EmployeePK}
                };

                sharedservices.xhrService(configs)
               .success(function (data, status, headers, config) {
                   sharedservices.parseDates(data.d.Object);

                   if (data.d.IsOK) {

                       $scope.clinicNotes = data.d.Object;
                   }
               })
                  .error(function () {
                       utilityservices.notify("error");
                  })

            };


            $scope.gotoClinicNotesDetails = function (note) {

                globalobject.EncounterClinicNoteID = note.EncounterClinicNoteID;
                globalobject.currentEncounter.EncounterDetailID = note.EncounterDetailID;
                globalobject.hideClinicNote = false;
                $scope.changeSubView(2000);
            }


            // Function to Delete Clinic Note ******************
            $scope.removeClinicNote = function (item,type) {

                $scope.message = $filter('translate')('msgDeleteClinicNotes');
                $scope.item = item;
                $scope.type = type;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteClinicNotesModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }



            //Attachments Section

                $scope.loadAttachments = function () {

                var configs = {

                    url: "/WebServices/OccupationalHealth/Appointments/AppointmentService.asmx/SelectAttachmentsByEmployeeID",
                    data: { EmployeeId: globalobject.currentEncounter.EmployeePK, DocType:'' }
                };

                sharedservices.xhrService(configs)
                .success(function (data, status, headers, config) {
                    sharedservices.parseDates(data.d.Object);

                    if (data.d.IsOK) {

                        $scope.Attachmentconfigs.Attachments = (angular.isArray(data.d.Object.items)) ? data.d.Object.items : [];
                        $scope.EncounterAttachment = _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "Encounter" });
                        $scope.EncounterTypeAttachment = _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "EncounterType" });
                        $scope.ClinicNotesAttachment = _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "ClinicNote" });
                        $scope.ActionItemAttachment = _.where($scope.Attachmentconfigs.Attachments, { KeyWord: "ActionItem" });
                        $scope.Attachmentconfigs.MaxFileSize = data.d.Object.Configs.item.MaxFileSize;
                        $scope.Attachmentconfigs.ProhibitedFileExtensions = data.d.Object.Configs.item.ProhibitedFileExtensions;
                        $scope.Attachmentconfigs.LocationID = data.d.Object.Configs.item.LocationID;
                        $scope.attachmentConfig = $scope.Attachmentconfigs;
                        if (globalobject.AttachmentType != undefined) {
                            if (globalobject.AttachmentType == "EncounterType")
                                $scope.Attachmentconfigs.Attachments= $scope.EncounterTypeAttachment;
                            else if (globalobject.AttachmentType == "ClinicNote")
                                $scope.Attachmentconfigs.Attachments = $scope.ClinicNotesAttachment;
                            else if (globalobject.AttachmentType == "ActionItem")
                                $scope.Attachmentconfigs.Attachments = $scope.ActionItemAttachment;
                            else
                                $scope.Attachmentconfigs.Attachments= $scope.EncounterAttachment;
                        }
                        else
                            angular.extend($scope.Attachmentconfigs.Attachments, $scope.EncounterAttachment);

                        $scope.LengthOfAttachments = $scope.EncounterAttachment.length + $scope.EncounterTypeAttachment.length + $scope.ClinicNotesAttachment.length + $scope.ActionItemAttachment.length;
                        globalobject.AttachmentType = "";
                    }
                })
                .error(function () {
                      utilityservices.notify("error");
                })
            };
            $scope.loadAttachments();

            $scope.attachmentIcon = sharedservices.attachmentIcon;

                $scope.deleteAttachment = function (item) {

                $scope.message = $filter('translate')('msgDeleteAttachment');
                $scope.Attachment = item;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteAttachmentsModalCtrl',
                    size: 'sm',
                    scope: $scope
                });
            }

            $scope.downloadAttachment = function (attachment) {

                window.open(attachment.FullFilePath, 'Attachment', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
				return false;
            }

	        // SECTION LINK MENU ITEMS
	        $scope.sectionLinks = [
	        	{ label: 'Encounters', link: '#/encounterdetails/1002' },
	        	{ label: 'Action Items', link: '1002' },
	        	{ label: 'Attachments', link: '1002' }
	        ];
	        $scope.currentSection = $scope.sectionLinks[0].label;

	        // SECTION MENU ACTION FUNCTION
	        $scope.sectionMenuAction = function(link){
	        	var isHref = link.indexOf('#/') + 1;
	        	if( isHref ){
	        		console.log('LOAD PAGE: ' + link);
	        	} else {
	        		console.log('LOAD VIEW: ' + link);
	        	}
	        }

            // OPEN MODALS
            $scope.openAppointmentActionModal = function (obj) {
                //$scope.currentObject=obj;
                
                globalobject.currentObject = obj;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/appointment-actions-modal.html',
                    controller: 'AppointmentActionModalCtrl',
                    size: 'sm',
                    //scope:$scope
                });

            };

            // DELETE/REMOVE ACCORDION ITEM
            $scope.removeAccordionItem = function (item, obj) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/confirmation-modal.html',
                    controller: 'CancelModalCtrl',
                    size: 'sm',
                    scope:$scope
                });
            }

            // Action Item ********************************
             $scope.loadActionItems = function () {

                $scope.ActionObj = {
                    AdditionalFilter: "Employee:" + globalobject.currentEncounter.EmployeePK
                   , strModules: "occupationalhealth"
                }
                var configs = {
                    url: "../WebServices/OccupationalHealth/Encounters/EncounterService.asmx/GetActionItemList",
                    data: { ActionObj: $scope.ActionObj }

                };
                sharedservices.xhrService(configs)
              .success(function (data, status, headers, config) {
                  sharedservices.parseDates(data.d.Object);

                  if (data.d.IsOK) {

                      $scope.actionItems = data.d.Object;
                  }
              })
            };


            $scope.removeActionItem = function (item, type) {
                $scope.message = "Are you sure you want to delete this Action Item?";
                $scope.item = item;
                $scope.type = type;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/OccHealth/modals/delete-confirmation-modal.html',
                    controller: 'deleteActionItemModalCtrl',
                    size: 'sm',
                    scope: $scope
                });

                //var index = $scope.actionItems.indexOf(item);
                //$scope.actionItems.splice(index, 1);
            }

            $scope.gotoActionItemDetails = function (obj) {
               
                globalobject.actionItem={ aiID: obj.ID, aiSourceID: "", aiTaskType: "occupationalhealth" }
                 globalobject.hideActionItem = false;
                $scope.changeSubView(2001);
            }


            $scope.editEmployee = function(){
                $location.path("/editemployeeinformation");
            }

            $scope.IsSyncYes = false;
            
            $scope.SyncToHRMS = function(){

                if($scope.funPermissionCheck(450085,'Any',0))
                {
                    $scope.IsSyncYes = false;
    //                $scope.customesettingValue = [];
    //                $scope.customsettingValue = utilityservices.GetCustomKeyValue('45', 'EmployeeSyncToHRMS').split(',');
                    
                    $scope.PersonnelTypeID = globalobject.employee.EmployeeTypeId;
                    
                    if(utilityservices.GetCustomKeyValue('45', 'EmployeeSyncToHRMS').contains($scope.PersonnelTypeID))
                    {
                        $scope.IsSyncYes = true;
                    }
                
                }
            }


            /* -----------------------------------------------------------------------------
            	JQUERY
         	----------------------------------------------------------------------------- */
            $(function () {

                // LEFT COLUMN DYNAMIC HEIGHT
                var setLeftColumnHeight = function (affixTop) {
                    var affixTop = affixTop || $("#sidebar").hasClass("affix-top")
                        , $navbar = $('.navbar.navbar-default.navbar-fixed-top')
                        , $mastHead = $('#masthead')
                        , $accordionPanels = $('.accordion.panel')
                        , $accordionTitles = $accordionPanels.find('.panel-heading')
                        , adjustedHeight = Math.ceil($accordionTitles.length * ($accordionTitles.height() * 2))
                        , $panelBody = $accordionPanels.find('.panel-body')
                        , contentHeight = Math.ceil( $navbar.height() + ($mastHead.height()/2) )
                        , panelBodyHeight = $(window).height() - contentHeight
                        , height;
                    // console.log(adjustedHeight, $(window).height(), $navbar.height(), $mastHead.height(), panelBodyHeight);
                    if (affixTop) {
                        height = Math.ceil((panelBodyHeight - contentHeight) - $accordionTitles.height())
                    } else {
                        height = Math.ceil(panelBodyHeight + ($mastHead.height() - contentHeight) - $accordionTitles.height())
                           $panelBody.css({'height': (height - adjustedHeight) - 20 + 'px'});
                    }
                    // console.log(height);
                 

                };
                setLeftColumnHeight(true);

                // SET LEFT COLUMN WIDTH
                var leftColumnAffix = $("#leftCol > #sidebar");
                var setLeftColumnWidth = function () {
                    var leftColumnWidth = $("#leftCol").width();
                    leftColumnAffix.css({"width": leftColumnWidth});
                };
                
                $(window).resize(function () {
                    setLeftColumnWidth();
                    setLeftColumnHeight();
                });

                // AFFIX LEFT COLUMN
                $("#sidebar").affix({
                    offset: {top: 145}
                })
                // THIS EVENT IS FIRED AFTER THE ELEMENT HAS BEEN AFFIXED TO TOP
                .on('affixed.bs.affix', function(){
                    setLeftColumnWidth();
                    setLeftColumnHeight();
                })
                // THIS EVENT IS FIRED AFTER THE ELEMENT HAS BEEN AFFIXED
                .on('affixed-top.bs.affix', function(){
                    setLeftColumnHeight();
                });

            });
            
            // ACCORDIONS:
            // TITLE BAR CLICK
            $("body").on("click", ".accordion .panel-heading", function () {
                var $this = $(this).siblings();
                if (!$this.is(':visible')) {
                    $('.accordion .panel-body, .accordion .panel-body-action-bar').hide();
                    $(this).siblings().show();
                    // $(this).siblings('.panel-body').find('.list-group-item:first-child').trigger('click');
                }
            })

          

            
            
            // LIST ITEM CLICK
            $("body").on("click", ".accordion .list-group > a", function () {
                var $this = $(this)
                    , $others = $(".accordion .list-group > a");
                if (!$this.hasClass('active')) {
                    $others.removeClass('active');
                    $this.addClass('active');
                }
            })

    	}]
	);
