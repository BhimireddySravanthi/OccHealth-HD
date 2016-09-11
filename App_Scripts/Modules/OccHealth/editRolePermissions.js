var RoleId = getURLParameter("Role_Id");
var ModuleId = getURLParameter("Module_Id");

$(document).ready(function () {

    $("#aDetails").attr("href", "../edit_roles.asp?Role_Id=" + RoleId + "&Module_Id=" + ModuleId);

    $.ajax
    ({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/WebServices/Foundation/FoundationService.asmx/RolePermissionsScreen",
        data: "{RoleID:'" + RoleId + "', ModuleID:'" + ModuleId + "'}",
        success: function (data) {
            if (data.d.IsOK == true) {
                strInnerHTML = data.d.Object.innerHTML;
                strTitle = data.d.Object.Title;
                $("#spnTitle").html(strTitle);
                $("#tbPermissions").html(strInnerHTML);
                $("#divLoader").hide();
            }
        }
    });

});

function SavePermissions() {
    $("#divLoader").show();
    var PermissionsNames = "";
    $("input[type=checkbox]").each(function () {
        if ($(this).prop("checked") == true) {
            if (PermissionsNames == "")
                PermissionsNames = $(this).attr("name");
            else
                PermissionsNames = PermissionsNames + "," + $(this).attr("name");
        }
    });

    $.ajax
    ({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/WebServices/Foundation/FoundationService.asmx/SavePermissions",
        data: "{strPermissions:'" + PermissionsNames + "', RoleID:'" + RoleId + "', ModuleID:'" + ModuleId + "'}",

        success: function (data) {
            if (data.d.IsOK == true) {
                DisplayMessage('Success', "The Records have been successfully saved.");
                var LastUpdatedBy = data.d.Object.LastUpdatedBy;
                var LastUpdatedDate = data.d.Object.LastUpdatedDate;
                $("[id^='LUBy_']").html("&nbsp;");
                $("[id^='LUDt_']").html("&nbsp;");
                $("input[type=checkbox]").each(function () {
                    if ($(this).prop("checked") == true) {
                        $("#LUBy_" + $(this).val()).html(LastUpdatedBy + "&nbsp;");
                        $("#LUDt_" + $(this).val()).html(LastUpdatedDate + "&nbsp;");
                    }
                });
                $("#divLoader").hide();
            }
        }
    });
}

function permisionsChanged(aclId, parentAclId, aclType, chkBoxChecked, chkboxId, aclName) {
    var thisId;
    if (aclType == "Self") {
        if (aclName == "View") {
            if (chkBoxChecked == false) {
                thisId = chkboxId.replace("View", "");
                $("[id^='" + thisId + "']").prop("checked", false);
            }
        }
        if (aclName == "Add") {
            if (chkBoxChecked == true) {
                thisId = chkboxId.replace("Add", "");
                $("#" + thisId + "Edit").prop("checked", true);
                $("#" + thisId + "View").prop("checked", true);
            }
        }
        if (aclName == "Edit" || aclName == "Delete") {
            if (chkBoxChecked == true) {
                thisId = chkboxId.replace(aclName, "");
                $("#" + thisId + "View").prop("checked", true);
            }
        }

        if (chkBoxChecked == false) {
            thisId = chkboxId.replace("Self", "Others");
            $("#" + thisId).prop("checked", false);
            permisionsChanged(aclId, parentAclId, "Others", false, thisId, aclName);
            thisId = chkboxId.replace("Self", "Owned");
            $("#" + thisId).prop("checked", false);
            permisionsChanged(aclId, parentAclId, "Owned", false, thisId, aclName);
        }
    }

    if (aclType == "Others") {
        if (chkBoxChecked == true) {
            thisId = chkboxId.replace("Others", "Self");
            if ($("#" + thisId).prop("checked") == true) {
                if (aclName == "View") {
                    if (chkBoxChecked == false) {
                        thisId = chkboxId.replace("View", "");
                        $("[id^='" + thisId + "']").prop("checked", false);
                    }
                }
                if (aclName == "Edit" || aclName == "Delete") {
                    if (chkBoxChecked == true) {
                        thisId = chkboxId.replace(aclName, "");
                        $("#" + thisId + "View").prop("checked", true);
                    }
                }
            }
            else {
                $("#" + chkboxId).prop("checked", false);
                permisionsChanged(aclId, parentAclId, "Others", false, chkboxId, aclName);
                DisplayMessage("Failure", "Corresponding Self permission must be assigned to assign Others permission.");
            }
        }
        else {
            if (aclName == "View") {
                if (chkBoxChecked == false) {
                    thisId = chkboxId.replace("View", "");
                    $("[id^='" + thisId + "']").prop("checked", false);
                }
            }
            if (aclName == "Edit" || aclName == "Delete") {
                if (chkBoxChecked == true) {
                    thisId = chkboxId.replace(aclName, "");
                    $("#" + thisId + "View").prop("checked", true);
                }
            }
        }
    }

    if (aclType == "Owned") {
        if (chkBoxChecked == true) {
            thisId = chkboxId.replace("Owned", "Self");
            if ($("#" + thisId).prop("checked") == true) {
                if (aclName == "View") {
                    if (chkBoxChecked == false) {
                        thisId = chkboxId.replace("View", "");
                        $("[id^='" + thisId + "']").prop("checked", false);
                    }
                }
                if (aclName == "Edit" || aclName == "Delete") {
                    if (chkBoxChecked == true) {
                        thisId = chkboxId.replace(aclName, "");
                        $("#" + thisId + "View").prop("checked", true);
                    }
                }
            }
            else {
                $("#" + chkboxId).prop("checked", false);
                permisionsChanged(aclId, parentAclId, "Owned", false, chkboxId, aclName);
                DisplayMessage("Failure", "Corresponding Self permission must be assigned to assign Owned permission.");
            }
        }
        else {
            if (aclName == "View") {
                if (chkBoxChecked == false) {
                    thisId = chkboxId.replace("View", "");
                    $("[id^='" + thisId + "']").prop("checked", false);
                }
            }
            if (aclName == "Edit" || aclName == "Delete") {
                if (chkBoxChecked == true) {
                    thisId = chkboxId.replace(aclName, "");
                    $("#" + thisId + "View").prop("checked", true);
                }
            }
        }
    }
}