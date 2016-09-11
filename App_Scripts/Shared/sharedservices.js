//common module will be linked to shred services
angular.module("app")
    .factory("translations", function () {
        return {};
    })
    .factory("globalobject", function () {
        return {


        };
    })
    .factory("sharedservices", ["$http", "$modal", "$q", "globalobject", function ($http, $modal, $q, globalobject) {
        var factoryObject = {};
        factoryObject.confirm = function (msg, scope) {

            $modal.open({
                animation: true,
                templateUrl: '/OccHealth/modals/confirmation-modal.html',
                controller: 'confirmationCtrl',
                size: 'sm',
                scope: scope
            });
        }

        factoryObject.xhrService = function (configs) {
            var config = configs || {};
            config.header = configs.header || "application/json; charset=utf-8";
            config.method = configs.method || "POST";
            config.url = configs.url || null;
            config.data = configs.data || {};

            return $http(config);
        };

        factoryObject.httpCall = function (configs) {
            var config = configs || {};
            config.header = configs.header || "application/json; charset=utf-8";
            config.method = configs.method || "POST";
            config.url = configs.url || null;
            config.data = configs.data || {};

            var deferred = $q.defer(); //To have code wait for everything to be done before returning to caller.
            return $http(config).then(function (data) { //Calls webmethod defined in funds.

                return deferred.promise; //Wait for the possible .add call above to add before returning
            },
                function (err) { //While then accounts for some errors returned it does not account for all. 500 status errors are not caught as this function here is needed to handle it
                    err.data = err.data || {}; //Set values savedOffline & IsOK to false
                    err.data.IsOK = false; //NOTE: .d was removed because many of our conditions currenly check for data.d.IsOk where if not an else is called to show a generic error. if .d is left in this will trigger the else if offline is not accounted for showing a confusing message that the record was added and an error occurred which is not the case

                    return deferred.promise; //Wait for the possible .add call above to add before returning
                });
        };

        factoryObject.getURLParameter = function (name) {
            // Function to get queryString Params.
            var i = 0,
                qsObject = {},
                pair = null,
                sPageURL = window.location.search.substring(1),
                qArr = sPageURL.split('&');
            if (qArr[0].length > 1) {
                for (i = 0; i < qArr.length; i++) {
                    pair = qArr[i].split('=');
                    //qsObject[pair[0]] = pair[1];
                    qsObject[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
                }
                ;
            }
            return qsObject;
        };

        //parse date
        factoryObject.parseDates = function (obj, dates, format) {
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
                        if (moment(value).year() == '0000') {
                            value = moment('1900-01-01');
                        }
                        else if (moment(value).year() == 1) {
                            value = moment('1900-01-01');
                        }
                        if (!moment(value).tz('America/New_York').isDST()) {
                            obj[prop] = moment(value).tz('America/New_York').add(moment.duration(1, 'hours')).format(dateFormat);
                        }
                        else {
                            obj[prop] = moment(value).tz('America/New_York').format(dateFormat);
                        }
                    
                    }
                } else {
                    for (var i = 0; i < dates.length; i++) {
                        if (dates[i] === prop) {
                            if (val.indexOf("/Date(") >= 0) {
                                if (moment(value).year() == '0000') {
                                    value = moment('1900-01-01');
                                }
                                else if (moment(value).year() == 1) {
                                    value = moment('1900-01-01');
                                }
                                if (!moment(value).tz('America/New_York').isDST()) {
                                    obj[dates[i]] = moment(value).tz('America/New_York').add(moment.duration(1, 'hours')).format(dateFormat);
                                }
                                else {
                                    obj[dates[i]] = moment(value).tz('America/New_York').format(dateFormat);
                                }

                             
                            }
                        }
                    }
                }
            }

        };

        factoryObject.subViewUrl = "";
        factoryObject.screenId = 0;
        
        factoryObject.changeSubView = function (screenId, data) {
            //debugger;
            var path = "";
            var ran = Math.random();
            factoryObject.screenId = screenId;

            path = (_.where(globalobject.ScreenViewsList, { ID: screenId })[0]).Text;
            path = path + '?r=' + ran;
            factoryObject.subViewUrl = path;
        };


        factoryObject.attachmentIcon = function (type) {

            var icons = ''
            switch (type) {
                case "doc":
                    icons = 'fa fa-file-word-o';
                    break;

                case "docx":
                    icons = 'fa fa-file-word-o';
                    break;

                case "txt":
                    icons = 'fa fa-file-text-o';
                    break;

                case "pdf":
                    icons = 'fa fa-file-pdf-o';
                    break;

                case "htm":
                    icons = 'fa fa-file-code-o';
                    break;

                case "html":
                    icons = 'fa fa-file-code-o';
                    break;

                case "zip":
                    icons = 'fa fa-file-archive-o';
                    break;

                case "rar":
                    icons = 'fa fa-file-archive-o';
                    break;

                case "xls":
                    icons = 'fa fa-file-excel-o';
                    break;

                case "xlsx":
                    icons = 'fa fa-file-excel-o';
                    break;

                case "ppt":
                    icons = 'fa fa-file-powerpoint-o';
                    break;

                case "pptx":
                    icons = 'fa fa-file-powerpoint-o';
                    break;

                case "bmp":
                    icons = 'fa fa-file-video-o';
                    break;

                case "gif":
                    icons = 'fa fa-picture-o';
                    break;

                case "jpg":
                    icons = 'fa fa-picture-o';
                    break;

                case "jpeg":
                    icons = 'fa fa-picture-o';
                    break;

                case "png":
                    icons = 'fa fa-picture-o';
                    break;

                case "avi":
                    icons = 'fa fa-file-video-o';
                    break;

                case "flv":
                    icons = 'fa fa-file-video-o';
                    break;

                case "mkv":
                    icons = 'fa fa-file-video-o';
                    break;

                case "mov":
                    icons = 'fa fa-file-video-o';
                    break;

                case "wmv":
                    icons = 'fa fa-file-video-o';
                    break;

                case "mp4":
                    icons = 'fa fa-file-video-o';
                    break;

                case "mpg":
                    icons = 'fa fa-file-video-o';
                    break;

                case "mpeg":
                    icons = 'fa fa-file-video-o';
                    break;

                case "3gp":
                    icons = 'fa fa-file-video-o';
                    break;

                default:
                    icons = 'fa fa-file-image-o status-icon';
            }

            return icons;
        };

        factoryObject.reloadParent = function()// TO handle the cancel functionality from SOA screen.
        {
            var URL;
            if (window.opener) {
                URL = window.opener.location.href;
            }
            else {
                URL = window.parent.location.href;
            }
            URL = URL.split("#")[0];
            URL = URL.split("?");
            var baseURL = URL[0];
            var queryString = "";
            if (URL.length > 1) {
                queryString = URL[1];
            }
            queryString = queryString.replace(/&status=[^&]*/ig, "");
            queryString = queryString.replace(/^status=[^&]*/ig, "");
            queryString = queryString.replace(/&+/g, "&");
            queryString = queryString.replace(/^&/, "");
            queryString = queryString.replace(/&$/, "");

            URL = baseURL + "?" + queryString;
            window.parent.location.href = URL;

        }

        // TIMES
        factoryObject.setTime = function (hour, minute) {
            if (hour != null && minute != null) {
                var d = new Date();
                d.setHours(hour);
                d.setMinutes(minute);
                return d;
            }
        };
        factoryObject.hourStep = 1;
        factoryObject.minuteStep = 1;

        //return object
        return factoryObject;


    } ]);
