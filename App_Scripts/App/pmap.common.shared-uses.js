angular.module("App")
.service("sharedUses", function (ngDialog) {
        /**
        * Parses the epoch date (DateTime property) "/Date(xxxxxxxxxx)/" from the sent object (obj).
        * "dates" are the properties that need to be parsed from as an array of strings.
        * If dates is undefined or blank the function will parse all
        * property values that are prefixed with "/Date".
        * "format" will take the user defined date format if defined.
        * if format is not defined the default value of MMM DD, YYYY will be used.
        */
        this.parseDates = function (obj, dates, format) {
            var dateFormat = format || 'MMM DD, YYYY';
            traverse(obj, dates, dateFormat);

            function traverse(o, dates, dateFormat) {
                angular.forEach(o, function (value, prop) {
                    process(value, prop, dates, dateFormat, o);
                    if (value !== null && typeof (value) == "object") {
                        traverse(value, dates, dateFormat);
                    }
                });
            }

            function process(value, prop, dates, dateFormat, obj) {
                var val = String(value);
                if (typeof dates === 'undefined' || dates === '') {
                    if (val.indexOf("/Date(") >= 0) {
                        obj[prop] = moment(value).format(dateFormat);
                    }
                }
                else {
                    for (var i = 0; i < dates.length; i++) {
                        if (dates[i] === prop) {
                            if (val.indexOf("/Date(") >= 0) {
                                obj[dates[i]] = moment(value).format(dateFormat);
                            }
                        }
                    }
                }
            }
        };

        /**
        * Takes a single /Date() value and formats it into a readable/formattable time interval value.
        * /Date(1407988800000) -->  Thu Aug 14 2014 00:00:00 GMT-0400
        * params:
        *      date: [required | DateTime, /Date() value] takes /Date() value and returns ISO value
        */
        this.formatDateTime = function (date) {
            if (date.indexOf("/Date(") >= 0) {
                date = new Date(parseInt(date.substr(6))); //creates time interval from /Date(12341234)
            }
            return date;
        };

        /**
        * Returns proper css classes associated if item is open, closed, or overdue.
        * This function uses the generic function formStatus
        * Params:
        *  statusID [required | int] The current option selected for the status ddl, determines if this id is open or closed
        *  dueDate [required | date of any format] Needed to determine overdue. Pass in the due date of the item.
        *  additionalClasses [optional | string]: any additional classes to be returned with the string already being returned
        */
        this.statusIcon = function (statusID, dueDate, additionalClasses) {
            var status = this.formStatus(statusID, dueDate,"Open","Closed");

            if (status === 'open') {
                return { color: '#FE642E' };
            }
            else if (status === 'closed') {
                return { color: '#31B404' };
            }
            else if (status === 'overdue') {
                return { color: '#DF0101' };
            }
        };

        /**
        *  Returns the status (open, closed or overdue) of the id sent.
        *  statusID [required | int] The current option selected for the status ddl, determines if this id is open or closed
        *  dueDate [required | date of any format] Needed to determine overdue. Pass in the due date of the item.
        *  open [optional | int] Value that represents open value.
        *  closed [optional | int] Value that represents closed value.
        */
        this.formStatus = function (id, dueDate, open, closed) {
            var todayEpoch = moment.utc().startOf('day').valueOf(),
            dueDateEpoch = moment.utc(dueDate).startOf('day').valueOf(),
            openVal = open || '1003',
            closedVal = closed || '1004';

            if (id == openVal) {//Open or Overdue
                if (dueDateEpoch < todayEpoch) {
                    return 'overdue';
                }
                else {
                    return 'open';
                }
            }
            else if (id == closedVal) { //Closed
                return 'closed';
            }
        };

        /**
        * Takes the permissions associated with the element and returns if it is enabled or disabled
        * This function is essential for bringing in permissions to callout buttons. (see single-record-callout as an example)
        * Params:
        *  permissionList: [required | object]: Entire permission object containing the element variable array & the permissions properties.
        *  propArr: [required | string]: String representation of the "key" property which will traverse through its initialized array of string.
        *
        *EXAMPLE W/ COMMENTS:
        *      IN CONTROLLER:
        *      =============
        *      permissions: {          //This is the permissionList variable
        *          //3 properties in which the "propArray" variables will make use of to determine if the element is enabled or disabled
        *          canCreate: false,    //3 properties needed to determine if the 2 buttons (independently) are enabled or disabled
        *          canRead: true,      //NOTE: These variables should be initialized with their proper permissions brought back from data.
        *          canDelete: true,
        *
        *          //2 properties below are the "propArray" variables. The are initialized with an array of strings where the strings present the key of the permission above the needs to be checked.
        *          deleteBtn: ['canDelete'],     //Property set in the view element(in this case the delete button) where "canDelete" is the only permission needed to check for this element.
        *          actionBtn: ['canCreate', 'canRead'] //Button "actionBtn" has 2 elements in its array. These 2 elements both need to be true for the button permission to be true.
        *      }
        *
        *      IN VIEW
        *      =======
        *      //Here the button will show as enabled or disabled depending on what is returned from permissionIsEnabled.
        *      //the permission object is passed as is the string, 'deleteBtn'. deleteBtn is initialized with the properties needed to check which was done in the controller.
        *      //canDelete is true meaning "null" is called and the button will be shown as enabled.
        *        <button ng-class="permissionIsEnabled(permissions, 'deleteBtn') ? null : 'disabled'"></button>
        *
        *      //the permission object is passed as is the string, 'actionBtn'. actionBtn is initialized with the properties needed to check which was done in the controller.
        *      //actionBtn has 2 properties that both need to be true for it to be enabled. canRead is true but canCreate is false meaning false is returned and the button will appear disabled.
        *        <button ng-class="permissionIsEnabled(permissions, 'actionBtn') ? null : 'disabled'"></button>
        */
        this.permissionIsEnabled = function (permissionList, propArr) {
            if ((typeof permissionList != 'undefined') &&
            (typeof permissionList[propArr] != 'undefined')) {          //if nothing is passed in just return true as not every button requires permissions
                for (var i = 0; i < permissionList[propArr].length; i++) {  //traverses through array of propArr
                    var propToInspect = permissionList[propArr][i];         //inspects 1 element of propArr at a time, if false return false, if true continue to loop through array.
                    if (!permissionList[propToInspect]) {                   //if so much as 1 element is false the entire element needs to be disabled
                        return false;                                       //function returns false and loop ends.
                    }
                }
            }
            return true;                                                    //function returns true: either all properties inspected are true or the permissions were not set
        };

        /**
        * Compares two non-complex objects, (returns boolean).
        * Returns true of so much as 1 property value does not match the other.
        * Returns false if the two objects and all their properties are identical.
        * (Used in calendar form to determine if there has been a change in the form)
        * Params:
        *  dataOrig: [required | object] one of the object to compare with dataMod.
        *  dataMod:  [required | object] the other object to compare with dataOrig.
        */
        this.dataCompare = function (dataOrig, dataMod) {
            var hasChanged = false;
            angular.forEach(dataMod, function (modValue, modKey) {
                angular.forEach(dataOrig, function (origValue, origKey) {
                    if (origKey === modKey) {
                        if (origValue !== modValue) {
                            hasChanged = true;
                        }
                    }
                });
            });
            return hasChanged;
        };

        /**
        * Determines if one date variable is a date greater than or equal to the other. (returns boolean)
        * params:
        *  shouldBeLess [required | date of any format] variable that represents the date that should be less than or equal to its counter part, shouldBeGreater
        *  shouldBeGreater [required | date of any format] variable that represents the date that should be greater than or equal to its counter part, shouldBeLess
        */
        this.dateGreaterOrEqual = function (shouldBeLess, shouldBeGreater) {
            var valid = false;
            var dateShouldBeLess = moment.utc(shouldBeLess).valueOf();
            var dateShouldBeGreater = moment.utc(shouldBeGreater).valueOf();

            if (dateShouldBeGreater >= dateShouldBeLess) {
                valid = true;
            }
            return valid;
        };

        /**
        * GET & SET FUNCTIONALITY FOR COMPLEX OBJECTS THAT RETURNS THE PROPERTY VALUE (Get) OR
        * REQUIRES DATA MUTATION ON THE $scope (Set)
        *
        * Function has 2 uses:
        * --------------------
        *  1. To get the value of a $scope variable property
        *  EX: The path "$scope.ex.exA.exB.propNeeded" where we need "propNeeded"
        *
        *  2. To set (mutate) a value of a $scope variable property
        *  EX: The path "$scope.ex.exA.exB.propNeeded" is being watched and property "propNeeded" needs to be changed.
        *
        *  PARAMETERS
        *  ----------
        *  traversePath takes 3 parameter, 2 Required 1 Optional(req if need to set property)
        *      collection: should always be "$scope" when using angular, collection list if not
        *      path: string representation of path to property needed minus "$scope"
        *         EX: $scope.ex.exA.exB.propNeeded, path should be initialized as:
        *              path = "ex.exA.exB.propNeeded"
        *      valueToSet: Only initialize if looking to "Set".
        *          Do not initialize if using traversePath for "Get" purposes.
        *          Variable value to set to property of heiarchy is initialized here
        */
        this.traversePath = function (collection, path, valueToSet) {
            var pathArray = path.split(".");                //Split path into array to traverse through
            var obj = collection[pathArray[0]];             //Get first child of collection, this variable will be overwritten with each iteration of loop.
            for (var i = 1; i < pathArray.length; i++) {     //loop until path is complete
                if ((i === pathArray.length - 1) && (typeof valueToSet !== 'undefined')) {
                    obj[pathArray[i]] = valueToSet;         //if property is meant to be overwritten it will be here 1 iteration before loop ends
                }
                else {
                    obj = obj[pathArray[i]];                //sets one child deeper into the heiarchy
                }
            }
            return obj; //Returns property value at end of heiarchy
        };


        /**
        * Creates complex object defined by string representation of path
        * Returns an object heiarchy defined by "." separated string that represents the desired object to create.
        * Params{
        *      depth: [required | string] string that represents the object to return. to nest objects place a . to separate objects.
        *          ex: "Object.ActionItems.Collection", an object with a parameter Object that has a parameter Actionitems that has a parameter collection will be returned
        *      endContent: [optional | object/anything] content that will be placed as a parameter in the last property (deepest) of the newly created object.
        * }
        *
        * EXAMPLE:
        *  var depth = "Object.ActionItems.Collection"
        *  var list = {
        *      name: "John",
        *      id: "1000"
        *  };
        *  var filterBy = sharedUses.defineObject(depth, obj);
        *  //filterBy Will equal below value
        *  filterBy: {
        *      Object: {
        *          ActionItems: {
        *              Collection: {
        *                  name: "John",
        *                  id: "1000"
        *              }
        *          }
        *      }
        *  }
        */
        this.defineObject = function (path, endContent) {
            var pathArray = path; //splits the string representation of the heiarchy in an array

            if (typeof path === 'string') {
                pathArray = path.split(".");
            }
            var len = pathArray.length - 1; //length of array path -1 for the loop
            var obj = {};                   //content is injected in reverse starting with the last element of the array, this starts it
            obj[pathArray[len]] = {};      //Creates the final empty object and injects it in an  empty object
            if (typeof endContent !== 'undefined') { //if end content is defined
                obj[pathArray[len]] = endContent;   //Will inject the content into the last property in the heiarchy.
            }
            for (var i = len - 1; i >= 0; i--) {    //Takes defined object and wraps it in object whose key is defined by the current iteration of loop
                var o = {};
                o[pathArray[i]] = obj;
                obj = o;
            }
            return obj;                 //returns object
        };

        /**
        * Some array of objects are structured with multiple objects in each object.
        * This returns the object sent as just a pure array of objects
        *  -EX: data.d.Object.ActionItem[i].Object.DM.Object -> ['Object','DM','Object']
        *      -THIS COLLECTION: data.d.Object.ActionItem[i].Object.DM.Object IS NOW: data.d.Object.ActionItem[i].
        *          Where the properties in Object.DM.Object are now in ActionItem[i]
        * singleArray: if collections outcome to an array length 1 ([0]) we may want to simplifiy it further, set true to do so
        *      -Cases like data.d will create an extra (array[0]) which will be the parent most element, this removes that
        * PARAMS:
        * collection: array of objects to traverse through
        * propArray: array of string fo the heiarchy, ["d", "Object", "ActionItem"], can also be defined using a period delimited string "d.Object.ActionItem"
        * removeArray, returned array will not be returned as an array
        */
        this.simplifyCollection = function (collection, propArray, removeArray) {
            var remArray = removeArray || false;
            var trimmedCollection = [];
            if (typeof propArray === 'string') {
                propArray = propArray.split(".");
            }

            if (typeof propArray != 'undefined') {                       //if no property elements have been defined return untouched collection
                angular.forEach(collection, function (value, key) {     //Traverses through array of objects from collection
                    var obj = value[propArray[0]];                      //Sets obj to first child of current object
                    for (var i = 1; i < propArray.length; i++) {        //Go as deep into the heiarchy as defined from propArray
                        if (typeof obj[propArray[i]] != 'undefined') {  //if data has been mutated but is being traversed again
                            obj = obj[propArray[i]];                    //set current object
                        }
                    }
                    trimmedCollection.push(obj);                        //When as deep as need to be push current object into flat array
                });
                if (remArray) {                                         //if set true: take only contents in array [0]
                    trimmedCollection = trimmedCollection[0];
                }
            }
            else {
                return collection;                                      //if propArray can in undefined return original collection
            }
            return trimmedCollection;                                   //return flat array of objects
        };

        /**
        * Html Drop down (select) preselection on ng-init to set the ng-model & other forms of setting preselect on the "select" element.
        * params: ddl [required | array of objects] Only requires the drop down array of objects, returns the object that needs to be preselected.
        */
        this.preselectDDL = function (ddl) {
            var index = 0;
            angular.forEach(ddl, function (value, key) {
                if (value.selected === true) {
                    index = key;
                }
            });
            return ddl[index];
        };

        /**
        * Returns the top and left of element passed via ID or class so is centered vertically and horizontally.
        * Should be called in document.ready in most cases such as callouts.
        * Params:
        * sel: [required | string] the selector of the div to fully center.
        *          Needs to be a string prefixed with # or . depending on if it is a class or id
        * position: [optional | object{margin, padding}] Will default to 0px for both padding and margin
        *  position.margin: sets margins the user passes
        *  position.padding: sets padding the user passes
        *  position.dismissVertical: will not center vertically, will set left to 0px
        *  position.dismissHorizontal: will not center horizontally, will set top to 0px
        */
        this.centerViewBySelector = function (sel, position) {
            var directive = sel.charAt(0);      //gets first character of selected passed in, needed to check for class or id
            var selector = sel.substring(1);    //removes the first character from string

            //gets the element based on the first character of the passed in selector. From here we can manipulate it.
            var element = (directive === "#") ? document.getElementById(selector) :
            (directive === ".") ? document.getElementsByClassName(selector)[0] :
                null;

            //if the selector passed was not an id or class it will alert the developer in the console
            if (element != null) {
                var pos = position || {};
                var margin = pos.margin || "0px"; //applies margins
                var padding = pos.padding || "0px"; //applies padding
                var dismissTop = pos.dismissVertical || false;
                var dismissLeft = pos.dismissHorizontal || false;

                var w = element.clientWidth;    //gets the width of the element
                var h = element.clientHeight;   //gets the height of the element

                var top = (window.innerHeight / 2) - (h / 2);   //gets the vertically centered top value to inject into the element.
                var left = (window.innerWidth / 2) - (w / 2);   //gets the horizontally centered left value to inject into the element.

                //Inject top & left values into element, if additional parameters were passed for padding & margin inject them as well other wise set both to 0 px
                element.style.top = (dismissTop) ? "0px" : (top + "px");
                element.style.left = (dismissLeft) ? "0px" : (left + "px");
                element.style.margin = (margin);
                element.style.padding = (padding);
            }
            else {
                console.log('Unknown Selector. Please pass in an id or class with "#" or "." prefixed respectively.');
            }
        };

        /**
        * Will convert an integer of bytes to its closest base value.
        * Returns formatted size & base in form of an object{size, base} ex: 2500000 Bytes = 2.38 Megabytes
        * params{
        * bytes: [Required | Int] integer value of bytes to be formatted.
        * decimalCap: [Optional | boolean] If set to false will not cap the decimal value.
        * }
        */
        this.formatBytes = function (bytes, decimalCap) {
            var fileSize = bytes;
            var sizeBase = "Bytes";
            var capDecimal = (typeof decimalCap === 'undefined') ? true : decimalCap;

            var baseSizes = ["Kilobytes", "Megabytes", "Gigabytes"];
            for (var i = 0; baseSizes.length > i; i++) {
                if (fileSize >= 1024) {
                    fileSize /= 1024;
                    sizeBase = baseSizes[i];
                }
            }

            if (capDecimal) {
                fileSize = parseFloat(Math.round(fileSize * 100) / 100).toFixed(2);
            }

            return { size: fileSize, base: sizeBase };
        };

        /**
        * Used to determine if node from a collection already exists or not.
        * (Used in calendar form attachment to not have duplicate attachments)
        * params:
        *  node: [required | any type] value to check if exists.
        *  collection: [required | array of objects] array of objects to traverse through to determine if node already exists before adding it to this collection.
        *  collectionProp: [required | string] property name of the object from the collection to check if the node already exists
        */
        this.doesNodeExist = function (node, collection, collectionProp) {
            for (var i = 0; i < collection.length; i++) {
                if (node === ((collection[i])[collectionProp])) {
                    return true;
                }
            }
            return false;
        };

        /**
        * Function returns the CSS top & left values to be set for the single record callout
        *  IMPORTANT: In HTML, action item & single select section are expected to have an id that
        *  concats a specific string with the action item id.
        *  EX: action item id = record23043 or (params.actionItemSelectorPrefix + params.actionItemID)
        *      right action selector = rightActions38584 or (params.rightActionsSelector + params.actionItemID)
        *
        * PARAMS:
        *  scrollBarID:                 [Required | String] The html id set for the scrollbar that contains the list of objects.
        *  actionItemSelectorPrefix:    [Required/Optional | String] The selector (id or class) of the prefix for the html id of the selected action item. Options as id may not have a prefix
        *  actionItemID:                [Required | int] The unique id that represents the action item & rightActions clicked on.
        *  rightActionsSelector:        [Required/Optional | String] The selector (id or class) of the the actual single select button.
        */
        this.singleRecordPosition = function (params) {
            //TODO: Remove hardcoded values

            //scroll top position (not fixed)
            var ngScrollPositionTop = document.getElementById(params.scrollBarID).scrollTop;

            //selected action item top
            var ngActionItem = angular.element(document.querySelector(params.actionItemSelectorPrefix + params.actionItemID))[0];
            var ngActionItemTop = ngActionItem.offsetTop;
            var ngListTop = ngActionItemTop - ngScrollPositionTop; //gets top in accordance to scroll bar being top of window, need to account for header & blackbar

            //additional factors to get the position just right when creating the callout
            var ngScrollTop = document.getElementById(params.scrollBarID).getBoundingClientRect().top; //fixed Scroll div top returns 143px accounts for header & 2 blackbars
            var ngHalfActionItem = (ngActionItem.clientHeight) / 2; //height of selected aciton item / 2
            var ngHalfOfArrow = -20 - 10; //TODO: not hard code this value, used to adjust arrow height, takes arrow height & top padding both in half
            var ngAdditionalFactors = ngScrollTop + ngHalfActionItem + ngHalfOfArrow; //additional factors to be added to the top
            var topVal = (ngListTop + ngAdditionalFactors);

            //Gets callout left
            var ngElementRight = angular.element(document.querySelector(params.rightActionsSelector + params.actionItemID))[0];
            var ngActionSingleLeft = ngElementRight.offsetLeft; //left value of single action view section
            var leftVal = ngActionSingleLeft - 350; //TODO: not hard code, 350 for callout width + arrow width

            var position = {
                top: topVal,
                left: leftVal
            };

            return { top: topVal, left: leftVal };
        };


        /** Opens the file attachment preview popup
        *  params:
        * scope [required | scope variable]: From the controller, the $scope need to be passed in
        * attachmentData [required | String or any type]: The attachment data or path. Can be base64, http path, file system path, ect.
        * */
        this.fileGlimpse = function (scope, attachmentData) {
            var params = {
                attachmentData: attachmentData
            };

            scope.params = params;

            ngDialog.open({
                template: '../ui/shared/display-attachment-callout/displayAttachment.html',
                controller: 'displayAttachmentCtrl',
                className: '',
                scope: scope
            });
        };

        /** Mime types that are accepted for preview popup
        * If the file contains the mime typed needed to put a preview in the popup the function will return true
        * params:
        * mimeType [required | String] checks if this value matches with type valid from the allowedTypes array, if so returns true
        */
        this.allowedGlimpseTypes = function (mimeType) {
            var allowedTypes = [
            "image",
            "pdf",
            "video",
            "audio"
        ];
            for (var i = 0; i < allowedTypes.length; i++) {
                if (mimeType.indexOf(allowedTypes[i]) > -1) {
                    return true;
                }
            }
            return false;
        };

        /** Takes image's natural dimensions and resizing it based on the window size so it retains its proper aspect while giving
        * enough padding around it to click away to close
        */
        this.safeDimensions = function (scope) {
            var spacingResize = 100;                                  //Width & height spacing (pixels) to give the user room to close the callout
            var maxW = (window.innerWidth - spacingResize > 0) ? window.innerWidth - spacingResize : window.innerWidth;             //Gets current height & width of window and subtracts a number from it to ensure the user has room to close the image
            var maxH = (window.innerHeight - spacingResize > 0) ? window.innerHeight - spacingResize : window.innerHeight;

            var widthToSet = scope.naturalDimensions.widthToSet;                //Begins by assuming width & height of attachment fit within the window space provided
            var heightToSet = scope.naturalDimensions.heightToSet;

            var difference = widthToSet / heightToSet;          //To keep dimensions consistent we find the difference of the width & height

            if ((heightToSet > maxH) || (widthToSet > maxW)) {    //if attachment width or height exceed the max window width or height
                heightToSet = maxH;                             //Set height to max window height
                widthToSet = maxH * difference;                 //Set width to proper dimensions of that of max height

                if (widthToSet > maxW) {                          //If the width of the image is still to large for the window with the max height taken into account call this conditional
                    heightToSet = maxW / difference;            //Set height to the max window width divided by the dimension difference
                    widthToSet = maxW;                          //Set width the the max window width
                }
            }

            if (document.getElementById(scope.glimpseEl[0].id) !== null) {
                document.getElementById(scope.glimpseEl[0].id).style.width = (widthToSet + "px");
                document.getElementById(scope.glimpseEl[0].id).style.height = (heightToSet + "px");
                document.getElementById(scope.glimpseEl[0].id).style.visibility = ("visible");  //the "invisible" class may have been set to wait for the image to be complete before being displayed to the user, this overrides it as it is finished now.
            }
        };
    });