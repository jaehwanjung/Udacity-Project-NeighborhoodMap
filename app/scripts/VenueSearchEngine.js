(function (global) {
    'use strict';

    var ENDPOINT = 'https://api.foursquare.com/v2/venues/search?';
    var CREDENTIALS = {
        CLIENT_ID: 'WD5S0ZAJQC3SHWEQYVZAXKQGMK0IWB3YESWWSGG24YDI54QV',
        CLIENT_SECRET: 'PG3H3TEYU4RFGFL24QNJMESWPOVAH4GED51SYO5YMH5JLERP&v=20130815'
    };
    // Max 50 venues
    var COUNT_LIMIT = 50;
    var INTENT = 'checkin';

    function searchTopPicks(position, onSuccessfulSearchFunc) {
        var url = createRequestUrl(position);
        $.getJSON(url, function (data) {
            if (data.meta.code == 200) {
                var venues = getVenues(data.response);
                onSuccessfulSearchFunc(venues);
            }
            else {
                onUnsuccessfulSearch();
            }
        })
    }

    function createRequestUrl(position) {
        return ENDPOINT +
            'client_id=' + CREDENTIALS.CLIENT_ID + '&' +
            'client_secret=' + CREDENTIALS.CLIENT_SECRET + '&' +
            'limit=' + COUNT_LIMIT + '&' +
            'intent=' + INTENT + '&' +
            'll=' + position.lat + ',' + position.lng;
    }

    function getVenues(response) {
        var venues = [];
        var venuesFound = response.venues;
        for (var i in venuesFound) {
            if (venuesFound.hasOwnProperty(i)) {
                var venue = new Venue(venuesFound[i]);
                venues.push(venue);
            }
        }
        return venues;
    }

    function onUnsuccessfulSearch() {
        alert('Venue search engine failed.');
    }

    global.venueSearchEngine = {
        searchTopPicks: searchTopPicks
    };

})(window);
