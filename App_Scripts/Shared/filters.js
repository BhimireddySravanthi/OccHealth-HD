angular.module("app")
    .filter('translate', function ($log, translations) {
        return function (item) {
            var translation = (_.where(translations.tags, {
                Field: item
            })[0]);
            return (translation) != undefined ? (translation.FieldTranslation == "" || translation.FieldTranslation == null) ? "[No Translation]" : translation.FieldTranslation : "Fetching..";
        }
    })
    .filter('multiword', function ($log) {
        return function (items, query) {
            if (!query) return items; // return all items if nothing in query box

            var terms = query.$.split(","); //split query terms by comma
            var arrayToReturn = [];

            angular.forEach(items, function (item, key) { // iterate through array of items
                var passTest = true;
                angular.forEach(terms, function (term, subkey) { // iterate through terms found in query box
                    // if any terms aren't found, passTest is set to and remains false
                    passTest = passTest && ((item.keys.toLowerCase().indexOf(term.toLowerCase()) > -1) || (item.description.toLowerCase().indexOf(term.toLowerCase()) > -1) || (item.menu.toLowerCase().indexOf(term.toLowerCase()) > -1));
                });
                // Add item to return array only if passTest is true -- all search terms were found in item
                if (passTest) {
                    arrayToReturn.push(item);
                }
            });

            return arrayToReturn;
        }
    }).filter('parseDate', function () {
        return function (input) {
            if (!moment(input).tz('America/New_York').isDST()) {
                return moment(input).tz('America/New_York').add(moment.duration(1, 'hours')).format('MMM DD, YYYY');
            }
            else {
                return moment(input).tz('America/New_York').format('MMM DD, YYYY');
            }
        }
    });