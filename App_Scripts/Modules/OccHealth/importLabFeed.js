var _tempDeletionObjectArray = new Array();
var _uploadObjectArray = new Array();
var count = 0;
var ID, DocType, UserID, DocumentID, key, deleteobjects;
var fileEmpty = false;
var InputID, url, _url, filename, index;
var result = "";
var _FetchData, _deleteAttachments, _saveAttachments;
var _MaxFileSize = GetCustomKeyValue("0", "WebMaxFileUploadSize");
_MaxFileSize = _MaxFileSize * 1024 * 1024;
var _ProhibitedFileExtensions = "exe,vb,vbe,com,pif,bat,scr,dll,msi";
var _uploadobjects, _FileLocation, _ID, _docType;
var existingfilenames = "";
var _uploadDocuments, _fileChange;

_fileChange = function (obj) {
    var ctrlID = obj.id;
    var file, FileLocation, DocType, files, fileExtension;
    var prohibitedCharacters = new RegExp('/~#%&*{};?/+|\""');
    var maxFileSize, units;
    var decimalIndex = -1;
    var fileEmpty = false;
    count = count + 1;
    fileID = _ID + count;
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
        file = files[0];
        if (file.size <= 0) {
            alert('You may not submit empty files.');
            $("#flLabFeed").remove();
            $('#tdFileUpload').append("<input type='file' id='flLabFeed' name='flLabFeed' onchange='_fileChange(this);'/>");
        }
        else {
            if (file.size <= _MaxFileSize) {
                fileExtension = file.name.split('.');
                fileExtension = fileExtension[fileExtension.length - 1] || '';
                if (_ProhibitedFileExtensions.indexOf(fileExtension) > 0) {
                    alert('Unsupported file type.');
                    $("#flLabFeed").remove();
                    $('#tdFileUpload').append("<input type='file' id='flLabFeed' name='flLabFeed' onchange='_fileChange(this);'/>");
                }
                else {
                    if (fileEmpty == false) {

                        var FileObject = {
                            ID: _ID,
                            Files: files,
                            FileName: file.name,
                            FileSize: file.size,
                            FileExtension: fileExtension,
                            HasFileChanged: true,
                            FileImg: '',
                            FileLocation: FileLocation,
                            DocType: _docType
                        }
                        _uploadObjectArray = new Array();
                        _uploadObjectArray.push(FileObject);
                    }
                }
            }
            else {
                alert("File size exceeded");
                $("#flLabFeed").remove();
                $('#tdFileUpload').append("<input type='file' id='flLabFeed' name='flLabFeed' onchange='_fileChange(this);'/>");
                fileEmpty = true;
            }
        }
    }
}

_uploadDocuments = function (obj) {
    if (_uploadObjectArray.length > 0) {
        $("form").attr("enctype", "multipart/form-data").attr("encoding", "multipart/form-data");
        var options = {
            type: 'POST',
            contentType: false,
            async: true,
            url: "/WebServices/OccupationalHealth/OccHealthService.asmx/UploadAttachments",
            dataType: 'json',
            enctype: "multipart/form-data",
            processData: false,
            complete: function (data) {
                //console.log("Document Upload completed............");
                $("form").removeAttr("enctype").removeAttr("encoding"); // to reset to default form encryption
                if (JSON.parse(data.responseText).Message == "Success") {
                    var str = $("#flLabFeed").val();
                    var n = str.lastIndexOf("\\");
                    var thisFilename = str.substr(n + 1);
                    DisplayMessage("Success", "The file <b>" + thisFilename + "</b> is successfully placed in FTP");
                    $("#flLabFeed").val("");
                }
                else {
                    if (JSON.parse(data.responseText).Message == "ftpError") {
                        DisplayMessage("Failure", "FTP Server not found. Please contact IT team.");
                        $("#flLabFeed").val("");
                    }
                    else {
                        alert(JSON.parse(data.responseText).Message);
                        $("#flLabFeed").val("");
                    }
                }
            }
        };

        jQuery("#frmUploadResults").ajaxSubmit(options);
    }
};