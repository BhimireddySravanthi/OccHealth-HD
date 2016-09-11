var app = angular.module("Calendar");
app.controller('picklistCtrl', function ($scope, $http, ngDialog,ngProgress, $timeout, sharedUses, actionItemService) {
    /**
    *PARAMS
    * title:       Optional, String that is used on the top of the picklist to be used as a title
    * name:        Name property of $scope path minus "$scope" as a string.
    *                 EX: actionItem.DM.ActionItem.Object.PrimaryOwner  NOT-> $scope.actionItem.DM.ActionItem.Object.PrimaryOwner
    *                 Only reason property is being called like this is for data mutation for name and id
    * id:          id property of name property of $scope path minus "$scope" as a string. (Same as name property)
    * searchName:  Property key in which the found name will show when searched
    * searchID:    Property key in which the found id of the name will show when searched
    * multiselect: determines single or multi select of found names (radio buttons or checkboxes, true or false)
    * funds: {
    *   url: [required| string] file path containing webmethod. Used to search for picklist items EX: /WebServices/Calendar/CalendarActionItemService.asmx/getQueriedUsers
    *   data: [required | object] The object that represent the parameters that need to be passed to the webmethod defined in the url.
    *   searchMapper: [required | string] Representation of the property that is needed from funds.data that takes the input change from the user and appends that value with the property specified.
    *       ex: if we need the inputField property from funds.data.search.item.inputField to take the value of the user defined input string searchMapper will be written as "data.search.item.inputField"
    * }
    */

    ngProgress.color("#FFF");

    var params = $scope.params;
    params.title = $scope.params.title || '';
    params.nameParam = sharedUses.traversePath($scope, $scope.params.name);
    params.idParam = sharedUses.traversePath($scope, $scope.params.id);
    params.isMultiSelect = $scope.params.multiselect || false;
    params.searchName = $scope.params.searchName || 'name';
    params.searchID = $scope.params.searchID || 'id';
    params.funds = $scope.params.funds || {};

    $scope.selectedItems = [];
    $scope.foundItems;
    $scope.inputText = '';
    $scope.selectedOrder = [
        { id: 0, name: 'Ascending Order', predicate: 'plSearchedName', reverse: false },
        { id: 1, name: 'Descending Order', predicate: 'plSearchedName', reverse: true }
    ];

/*    angular.element(document).ready(function () {
        var position = {
            dismissVertical: true,
            margin: "35px"
        };
        centerViewBySelector("#picklistCallout", position);
        //TODO: Not have callout visible till now
    });*/

    /**
    * Preselect items on callout launch
    */
    if (params.nameParam != null && params.nameParam.length > 0) {//if empty returns [""] giving array length of 1
        var nameArray = params.nameParam.split(", ");
        var idArray = params.idParam.toString().split(","); //if int can not split, make string

        for (var i = 0; i < nameArray.length; i++) {
            var obj = {
                plSearchedName: nameArray[i],
                plSearchedID: idArray[i]
            };
            $scope.selectedItems.push(obj);
        }
    }

    /**
    * Searched item is multi select, function works as a custom checkbox when item is pressed
    */
    $scope.checkboxPressed = function (item) {
        var addSelectedItem = true;                             //Used to determine whether or not clicked item needs to be removed or added to the selected list

        angular.forEach($scope.selectedItems, function (valueL, keyL) {  //loop through collection of selected items
            if ((valueL.plSearchedID.toString()) === (item.plSearchedID).toString()) {
                addSelectedItem = false;                        //if the clicked item is already a selected item it needs to be removed
            }
        });
        if (addSelectedItem) {                    //Add clicked item to selectedItem list
            $scope.selectedItems.push(item);
            $scope.addItemClass(item.plSearchedID);
        }
        else {                                   //Remove clicked item from selectedItem list
            $scope.removeSelectedItem(item);
        }
    };

    /**
    * Custom radio buttons work like checkboxes and need custom logic to have only 1 selected
    * function will ensure there is only 1 item selected and remove the css selected from old properties
    */
    $scope.radioPressed = function (item) {
        $scope.removeAllSelectedClasses($scope.foundItems);
        $scope.selectedItems = [];
        $scope.selectedItems.push(item);
        $scope.addItemClass(item.plSearchedID);
    };

    /**
    * Save button press
    */
    $scope.saveBtn = function () {
        var selected = $scope.selectedItems;
        var name = selected.plSearchedName || ""; //set if radio
        var id = selected.plSearchedID || ""; //set if radio

        for (var i = 0; i < selected.length; i++) {
            name += selected[i].plSearchedName;
            id += selected[i].plSearchedID;
            if ((i + 1) < selected.length) { //No comma at end of string
                name += ", ";
                id += ",";
            }
        }

        sharedUses.traversePath($scope, $scope.params.name, name);
        sharedUses.traversePath($scope, $scope.params.id, (id.toString() || 0)); //property requires string, if blank set 0: AssignedBy can be blank and db requires 0

        ngDialog.closeAll();
    };

    /**
    * When a character is types in search input box
    */
    $scope.inputChange = function(change){
        if (change.length >= 3) {
            ngProgress.set(33);

            sharedUses.traversePath(params.funds, params.funds.searchMapper, change);

            actionItemService.xhrService(params.funds).then(function (response) {
                ngProgress.complete();
                if (response.data.d.IsOK) {
                    $scope.applyFoundList(response.data.d.Object);  //Set found items into proper picklist name & id property
                    $timeout(function () { $scope.preselectFoundList(); });   //timeout is used as the preselection function is now called after the view is updated
                }
                else {   //When no results are found from search data.d is returned false
                    $scope.foundItems = [];     //set found list empty
                }
            });
        }
    };

    /**
    * Called when results the user searched for are found.
    * This formats name & id into proper picklist name & id
    * and overwrites the current found results with the new results
    */
    $scope.applyFoundList = function (foundResults) {
        for (var i = 0; i < foundResults.length; i++) {
            foundResults[i].plSearchedName = (foundResults[i])[params.searchName];
            foundResults[i].plSearchedID = (foundResults[i])[params.searchID];
        }
        $scope.foundItems = foundResults;
    };

    /**
    * When found list loads check if any of the found items are already selected, if so preselect them
    */
    $scope.preselectFoundList = function () {
        angular.forEach($scope.selectedItems, function (valueS, keyS) {
            angular.forEach($scope.foundItems, function (valueF, keyF) {
                if ((valueS.plSearchedID).toString() === (valueF.plSearchedID).toString()) {//data returns sometimes as string or int
                    $scope.addItemClass(valueF.plSearchedID);
                }
            });
        });
    };

    /**
    * Adds selected class to item user clicked
    */
    $scope.addItemClass = function (id) {
        var el = document.getElementById(id);
        if (typeof el != 'undefined' && el != null) {
            el.className += " picklist-selected-searched-record";
        }
    };

    /**
    * Removes selected class from item that was previously selected from the found list
    */
    $scope.removeItemClass = function (item) {
        var el = document.getElementById(item.plSearchedID);
        if (typeof el != 'undefined' && el != null) {
            el.className = el.className.replace(" picklist-selected-searched-record", '');
        }
    };

    /**
    * When 'x' button is pressed on a selected item.
    * Or when a found item is (checkbox) is clicked to be removed from selected list
    * This will remove the item from being selected in the picklist.
    */
    $scope.removeSelectedItem = function (item) {
        var index = 0;
        angular.forEach($scope.selectedItems, function (valueS, keyS) {
            if (valueS.plSearchedID.toString() === item.plSearchedID.toString()) {
                index = keyS;
            }
        });
        $scope.selectedItems.splice(index, 1);
        $scope.removeItemClass(item);
    };

    /**
    * ONLY FOR RADIO BUTTON: Removes the selected class from all search options
    */
    $scope.removeAllSelectedClasses = function (obj) {
        angular.forEach(obj, function (valueF, keyF) {
            var el = document.getElementById(valueF.plSearchedID);
            if (typeof el != 'undefined' && el != null) {
                el.className = el.className.replace(" picklist-selected-searched-record", '');
            }
        });
    };
});