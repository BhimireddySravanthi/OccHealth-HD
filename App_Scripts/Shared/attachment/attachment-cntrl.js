
(function () {
    var app = angular.module("Calendar");
    app.controller("attachmentController", function ($scope, actionItemService, $location, ngDialog, toast, sharedUses, toaster, $timeout) {

        $scope.attachmentConfig = [];
        $scope.sourceModel = $scope.$parent.actionitem;
        $scope.querstringParams = $scope.$parent.queryStringObj;
        $scope.getServiceConfig = $scope.$parent.attachmentConfig.getServiceConfig;
        $scope.saveService = $scope.$parent.attachmentConfig.saveService;
        $scope.deleteService = $scope.$parent.attachmentConfig.deleteService;
        $scope.Attachments = [];
        $scope.uploadAttachments = [];
        $scope.deleteAttachmentsList = [];
        $scope.MaxFileSize = 0;
        $scope.ProhibitedFileExtensions = "";
        $scope.FileLocation = "";
        var count = 0;

        $scope.getAttachments = function () {

            $scope.sourceModel = $scope.$parent.actionitem;
            $scope.Getconfigs = {
                url: $scope.getServiceConfig,
                data: { EventID: $scope.sourceModel.ActionItemID }

            };

            actionItemService.xhrService($scope.Getconfigs)
                          .success(getAttachmentSuccess)
                          .error(getAttachmentError);
        };

        function getAttachmentSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                $scope.Attachments = [];
                $scope.Attachments = data.d.Object.items;
                $scope.MaxFileSize = data.d.Object.Configs.item.MaxFileSize;
                $scope.ProhibitedFileExtensions = data.d.Object.Configs.item.ProhibitedFileExtensions;
                $scope.FileLocation = data.d.Object.Configs.item.FileLocation;
                $scope.uploadAttachments = [];
                $scope.deleteAttachmentsList = [];
                var element = angular.element($('#divuploaddocuments'));
                element.scope().$apply();

                $('[id^="hdnfileInput"]').remove();
            }
        };

        function getAttachmentError(data, status, headers, config) {
            console.log("call failed...");
        };



        $scope.removeAttachments = function (obj) {

            //            angular.forEach($scope.Attachments, function (object, index) {
            //                if (obj.ID == object.ID)
            //                    $scope.Attachments.pop(object);
            //                var element = angular.element($('#divuploaddocuments'));
            //                element.scope().$apply();
            //            });

            $.each($scope.Attachments, function (i) {
                if ($scope.Attachments[i].ID == obj.ID) {
                    $scope.Attachments.splice(i, 1);
                    var element = angular.element($('#divuploaddocuments'));
                    element.scope().$apply();
                    return false;
                }
            });

            $scope.deleteAttachmentsList.push(obj);
        };


        $scope.removeUploadedAttachments = function (obj) {

            $.each($scope.uploadAttachments, function (i) {
                if ($scope.uploadAttachments[i].ID == obj.ID) {
                    $scope.uploadAttachments.splice(i, 1);
                    $("#hdnfileInput_" + obj.ID).remove();
                    var element = angular.element($('#divuploaddocuments'));
                    element.scope().$apply();
                    return false;
                }
            });
        };


        $scope.saveAttachments = function () {

            if ($scope.uploadAttachments.length > 0) {
                $("form").attr("enctype", "multipart/form-data").attr("encoding", "multipart/form-data");
                $("#filelocation").val($scope.FileLocation + "ACTIONITEM\\" + $scope.sourceModel.SourceID); // need to check this
                $("#EventID").val($scope.sourceModel.ActionItemID);
                $("#TaskType").val($scope.querstringParams.aiTaskType);
                $("#Location_ID").val($scope.sourceModel.LocationID);

                var options = {
                    type: 'POST',
                    contentType: false,
                    async: true,
                    url: $scope.saveService,
                    dataType: 'json',
                    enctype: "multipart/form-data",
                    processData: false,
                    complete: function (data) {
                        //console.log("Document Upload completed.");
                        $('form').removeAttr("enctype").removeAttr("encoding") // to reset to default form encryption
                        $scope.getAttachments();
                       
                        if (JSON.parse(data.responseText).Message != "Success") {

                            alert(JSON.parse(data.responseText).Message);
                        }
                    }
                };

                $('form').ajaxSubmit(options);
            }
            $scope.getAttachments();
            
        };


        $scope.deleteAttachments = function () {

            var DocumentIDs = "";
            if ($scope.deleteAttachmentsList.length > 0) {
                angular.forEach($scope.deleteAttachmentsList, function (object, index) {
                    DocumentIDs = DocumentIDs + "," + object.ID;
                });

                var configs = {
                    url: $scope.deleteService,
                    data: { EventID: $scope.sourceModel.ActionItemID, TaskType: $scope.sourceModel.TaskType, DocumentIDs: DocumentIDs }

                };
                actionItemService.xhrService(configs)
                          .success(onSuccess)
                          .error(onError);
            }
            else
                $scope.saveAttachments();
        };

        function onSuccess(data, status, headers, config) {
            if (data.d.IsOK) {
                $scope.saveAttachments();
            }
        };
        function onError(data, status, headers, config) {
            console.log("call failed...");
        };


        fileChange = function (obj) {

            var ctrlID = obj.id, file, FileLocation, TaskType, files, fileExtension, prohibitedCharacters = new RegExp('/~#%&*{};?/+|\""'), maxFileSize, units, decimalIndex = -1, fileID, fileEmpty = false;
            count += 1;
            fileID = $scope.sourceModel.ActionItemID + count;
            if ($.browser.msie) {
                var prop = { name: $(obj).val().split('\\').pop(),
                    size: $(obj).val().length //is the length of the fake path , the size of file will be validated server side for ie8/9
                }
                if ($(obj).val().length > 5) {
                    files = [prop];
                }
            }
            else {
                files = obj.files;
            }
            if (files.length > 0) {
                // if required put a loop for multiple files
                file = files[0];
                if (file.size <= $scope.MaxFileSize) {
                    fileExtension = file.name.split('.');
                    fileExtension = fileExtension[fileExtension.length - 1] || '';
                    if ($scope.ProhibitedFileExtensions.indexOf(fileExtension) > 0) {
                        alert('The name of the file should not contain any special characters (e.g. characters like ~#%&*{},;?/+|\").');
                        $(obj).val('');
                        fileEmpty = true;
                    }
                    else {

                        if ($scope.Attachments.length > 0) {
                            $.each($scope.Attachments, function (index, _uploadobjects) {
                                if (_uploadobjects.FileName == file.name) {
                                    alert('Attachment already exists');
                                    fileEmpty = true;
                                }
                            });
                        }
                        if ($scope.Attachments.length > 0) {
                            $.each($scope.Attachments, function (index, obj) {
                                if (obj.FileName == file.name) {
                                    alert('Attachment already exists');
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
                                FileLocation: $scope.FileLocation,
                                TaskType: $scope.querstringParams.aiTaskType
                            }

                            $scope.uploadAttachments.push(FileObject);

                            var _filename = "'" + file.name + "'";
                            var LiID = "tblAttachment_" + count;
                            var _tblName = "'tblAttachment_" + count + "'";
                            var _filCtrlID = fileID + 1;

                            $("#" + ctrlID).hide();
                            $("#" + ctrlID).attr("id", "hdnfileInput_" + fileID);
                            $('#tdFileUpload').append("<input id='fileInput_" + _filCtrlID + "' name='fileInput_" + _filCtrlID + "' class='inputValue'  type='file' onchange='fileChange(this);'  />");
                            //$("#ulDocumentsExisting").append('<li id="' + LiID + '"  ><div style="background-color: #f2f0f0;width:100%;height:18px;padding: 0 5px 2px;top: -1px;margin: 0 3px 5px 1px;" ><div style="width:100%" title="' + file.name + '"><span style="margin:5px 5px;position: absolute;">' + file.name + '</span><div title="Delete Attachment" style="float:right;width:20px;height:20px;margin-top: 5px;color:#ff3232;float:right;font-weight:bold;"><i class="fa fa-times"></i></div></div></div></li>');
                            var element = angular.element($('#divuploaddocuments'));
                            element.scope().$apply();
                        }
                    }
                }
                else {
                    alert("File size exceeded");
                    $(obj).val('');
                    fileEmpty = true;
                }
            }
        }



       

    });
} ()
)
