$(document).ready(function () {
    var LocationId = getURLParameter("Location_ID");
    $("#hdnLocationID").val(LocationId);
    $.ajax
    ({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/WebServices/OccupationalHealth/OccHealthService.asmx/GetHealthCareProviders",
        success: function (data) {

            if (data.d.IsOK == true) {
                $("#txtNames").val(data.d.Object.Value);
                $("#hdnUserIds").val(data.d.Object.Text);
            }
        },
        error: function (x, e) {
            DisplayMessage("Failure", "Something Wrong.");
        }
    });

    $("#SubmitBtn").on("click", function () {
        $.ajax
         ({
             type: "POST",
             contentType: "application/json; charset=utf-8",
             url: "/WebServices/OccupationalHealth/OccHealthService.asmx/UpdateHealthCareProviders",
             data: "{UserIds: '" + $("#hdnUserIds").val() + "'}",
             success: function (data) {

                 if (data.d.IsOK == true) {
                     DisplayMessage("Success", "The Record(s) has been successfully Saved.");
                 }
             },
             error: function (x, e) {
                 DisplayMessage("Failure", "Something Wrong.");
             }
         });
    });



});