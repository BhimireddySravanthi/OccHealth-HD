(function () {
    angular.module("app")
        .filter('jsonDate', ['$filter', function ($filter) {
            return function (input, format) {
                return (input) ? $filter('date')(parseInt(input.substr(6)), format) : '';
            };
        } ])

        .directive("encounterDetailsAttachments", encounterDetailsAttachments);

    function encounterDetailsAttachments() {
        return {
            restrict: "A",
            templateUrl: "/App_Scripts/Modules/OccHealth/Directives/Encounter-Details-Dir/encounter-details-attachments/encounter-details-attachment-template.html",
            controller: function ($scope, $filter, $location, $modal, $log, $http, $window, sharedservices, utilityservices, globalobject, toastr) {

                $scope.Attachmentconfigs = {
                    MaxFileSize: '',
                    ProhibitedFileExtensions: '',
                    LocationID: '',
                    AttachmentType: '',
                    Module: '',
                    ID: 0,
                    Attachments: [],
                    showUpload: true,
                    getServiceConfig: {
                        url: "",
                        data: 0
                    },
                    saveService: {
                        url: "",
                        data: 0
                    },
                    deleteService: {
                        url: "",
                        data: 0
                    }
                };
                $scope.attachmentConfigs = "$scope.attachmentConfig";
                $scope.sourceModel = "$scope.$parent.model";
                $scope.querstringParams = "$scope.$parent.queryStringObj";

                $scope.Attachments = $scope.attachmentConfigs.Attachments;
                $scope.uploadAttachments = [];
                $scope.deleteAttachmentsList = [];
                $scope.browsedocument = "Browse Document";
                var count = 0;

                $scope.IsSaved = false;


                $scope.loadAttachments = function () {
                    setTimeout(function () {
                        $scope.attachmentConfigs = $scope.attachmentConfig;
                        $scope.getAttachments();
                    }, 1000);


                }


                $scope.getAttachments = function () {

                    sharedservices.xhrService($scope.attachmentConfigs.getServiceConfig)
                          .success(getAttachmentSuccess)
                          .error(getAttachmentError)



                };

                function getAttachmentSuccess(data, status, headers, config) {
                    if (data.d.IsOK) {
                        //sharedservices.parseDates(data.d.Object);
                        if (!globalobject.currentEncounter.FromSOAListScreen) {
                            $scope.$parent.loadAttachments();
                        }
                        $scope.attachmentConfigs.MaxFileSize = data.d.Object.Configs.item.MaxFileSize;
                        $scope.attachmentConfigs.ProhibitedFileExtensions = data.d.Object.Configs.item.ProhibitedFileExtensions;
                        $scope.attachmentConfigs.LocationID = data.d.Object.Configs.item.LocationID;


                        $scope.Attachments = data.d.Object.items;
                        $scope.Attachments = _.where($scope.Attachments, { ID: parseInt($scope.attachmentConfigs.ID) });
                        globalobject.AttachmentType = $scope.attachmentConfigs.AttachmentType;
                        $scope.uploadAttachments = [];
                        $scope.deleteAttachmentsList = [];
                        $('[id^="hdnfileInput"]').remove();

                        if ($scope.IsSaved) {
                            $scope.showLoadingOverlay = false;
                            $scope.loadingAction = false;
                        }

                    }
                };

                function getAttachmentError(data, status, headers, config) {
                    console.log("getAttachments call failed...");

                    if ($scope.IsSaved) {
                        $scope.showLoadingOverlay = false;
                        $scope.loadingAction = false;
                    }
                };



                $scope.removeAttachments = function (obj) {
                    angular.forEach($scope.Attachments, function (val, i) {
                        if ($scope.Attachments[i].DocumentId == obj.DocumentId) {
                            $scope.Attachments.splice(i, 1);
                            return false;
                        }
                    });
                    $scope.newfileAdded = true;
                    $scope.deleteAttachmentsList.push(obj);
                };


                $scope.removeUploadedAttachments = function (obj) {
                    $scope.newfileAdded = true;
                    angular.forEach($scope.uploadAttachments, function (val, i) {
                        if ($scope.uploadAttachments[i].ID == obj.ID) {
                            $scope.uploadAttachments.splice(i, 1);
                            $("#hdnfileInput_" + obj.ID).remove();
                            return false;
                        }
                    });
                };


                $scope.saveAttachments = function () {

                    $scope.attachmentConfigs = $scope.attachmentConfig;
                    $scope.IsSaved = true;
                    if ($scope.uploadAttachments.length > 0) {
                        $("#frmaAttachmentDrctv").attr("enctype", "multipart/form-data").attr("encoding", "multipart/form-data");
                        $("#filelocation").val($scope.attachmentConfigs.LocationID + "\\MODULES\\" + $scope.attachmentConfigs.AttachmentType + "\\" + $scope.attachmentConfigs.ID); // need to check this
                        $("#PrimaryID").val($scope.attachmentConfigs.ID);
                        $("#Module").val($scope.attachmentConfigs.Module);
                        $("#Location_ID").val($scope.attachmentConfigs.LocationID);
                        $("#AttachmentType").val($scope.attachmentConfigs.AttachmentType);

                        var options = {
                            type: 'POST',
                            contentType: false,
                            async: true,
                            url: "/WebServices/OccupationalHealth/Encounters/EncounterService.asmx/UploadAttachments",
                            dataType: 'json',
                            enctype: "multipart/form-data",
                            processData: false,
                            complete: function (data) {
                                //console.log("Document Upload completed.");
                                $('form').removeAttr("enctype").removeAttr("encoding") // to reset to default form encryption
                                //$scope.getAttachments();

                                if (JSON.parse(data.responseText).Message != "Success") {

                                    toastr.error(JSON.parse(data.responseText).Message);
                                }
                                $scope.deleteAttachments();
                            }
                        };

                        $('form').ajaxSubmit(options);
                    }
                    //else { toastr.warning("error", $filter('translate')('msgNochangesavailableforsaving')); }
                    $scope.deleteAttachments();
                };


                fileChange = function (obj) {

                    var ctrlID = obj.id,
                file, FileLocation, TaskType, files, fileExtension, prohibitedCharacters = new RegExp('/~#%&*{};?/+|\""'),
                maxFileSize, units, decimalIndex = -1,
                fileID, fileEmpty = false;
                    count += 1;
                    fileID = 1000 + count;
                    if (window.navigator.userAgent.indexOf('MSIE') != -1) {
                        var prop = {
                            name: $(obj).val().split('\\').pop(),
                            size: $(obj).val().length //is the length of the fake path , the size of file will be validated server side for ie8/9
                        }
                        if ($(obj).val().length > 5) {
                            files = [prop];
                        }
                    } else {
                        files = obj.files;
                    }
                    if (files.length > 0) {
                        // if required put a loop for multiple files
                        file = files[0];
                        if (file.size > 0) {
                            if (file.size <= $scope.attachmentConfigs.MaxFileSize) {

                                fileExtension = file.name.split('.');
                                fileExtension = fileExtension[fileExtension.length - 1] || '';
                                if ($scope.attachmentConfigs.ProhibitedFileExtensions.indexOf(fileExtension) > 0) {

                                    toastr.warning("error", $filter('translate')('msgThisfiletypeisnotallowedtoupload'));

                                    $(obj).val('');
                                    fileEmpty = true;
                                } else {

                                    if ($scope.Attachments.length > 0) {
                                        $.each($scope.Attachments, function (index, _uploadobjects) {
                                            if (_uploadobjects.FileName == file.name) {

                                                toastr.warning($filter('translate')('msgAttachmentalreadyexists'));
                                                fileEmpty = true;
                                            }
                                        });
                                    }
                                    if ($scope.uploadAttachments.length > 0) {
                                        $.each($scope.uploadAttachments, function (index, obj) {
                                            if (obj.FileName == file.name) {

                                                toastr.warning($filter('translate')('msgAttachmentalreadyexists'));
                                                fileEmpty = true;
                                            }
                                        });
                                    }
                                    if (fileEmpty == false) {
                                        var FileObject = {
                                            ID: fileID,
                                            Files: files,
                                            FileName: file.name,
                                            FileSize: file.size,
                                            FileExtension: fileExtension,
                                            HasFileChanged: true,
                                            FileImg: '',
                                            FileLocation: $scope.attachmentConfigs.FileLocation
                                        }

                                        $scope.uploadAttachments.push(FileObject);
                                        $scope.newfileAdded = true;
                                        var _filCtrlID = fileID + 1;

                                        // Hide File control
                                        $("#" + ctrlID).hide();
                                        //Change the existing file control Id to hdnfile
                                        $("#" + ctrlID).attr("id", "hdnfileInput_" + fileID);
                                        // Add new file control after every upload
                                        $('#dvFileUpload').append("<input id='fileInput_" + _filCtrlID + "' name='fileInput_" + _filCtrlID + "' class='hidden'  type='file' onchange='fileChange(this);'  />");
                                        // Change the for attribut of filecontrol label to new added filecontrolID
                                        $("#lblfileInput").attr("for", "fileInput_" + _filCtrlID);
                                        //Refresh the Div displaying documents to upload
                                        var element = angular.element($('#divuploaddocuments'));
                                        element.scope().$apply();
                                    }

                                    else {
                                        $(obj).val('');
                                        fileEmpty = true;
                                    }
                                }
                            } else {
                                toastr.warning($filter('translate')('msgAttachmentMaxSize'));
                                $(obj).val('');
                                fileEmpty = true;
                            }
                        }
                        else {
                            $(obj).val('');
                            fileEmpty = true;
                        }
                    }
                }


                $scope.deleteAttachments = function () {

                    var DocumentIDs = "";
                    if ($scope.deleteAttachmentsList.length > 0) {
                        angular.forEach($scope.deleteAttachmentsList, function (object, index) {
                            DocumentIDs = DocumentIDs + "," + object.DocumentId;
                        });

                        $scope.attachmentConfigs.deleteService.data.DocumentIds = DocumentIDs;

                        sharedservices.xhrService($scope.attachmentConfigs.deleteService)
                          .success(onSuccess)
                          .error(onError);
                    }
                    $scope.getAttachments();
                };

                function onSuccess(data, status, headers, config) {
                    if (data.d.IsOK) {
                        $scope.getAttachments();
                        console.log("deleteAttachments call Success...");
                    }
                };
                function onError(data, status, headers, config) {
                    console.log("deleteAttachments call failed...");
                };

                $scope.attachmentIcon = sharedservices.attachmentIcon;

                $scope.download = function (filePath) {

                    window.open(filePath, 'Attachment', 'location=no,scrollbars=yes,menubar=no,toolbars=no,resizable=yes');
                    return false;
                }

            }
        }
    }

})();
