/* venueSearchEngine.js
 * Represents and encapsulates a search engine for venues.
 */

(function () {
    'use strict';

    var ENDPOINT = 'https://api.foursquare.com/v2/venues/search?';
    var CREDENTIALS = {
        CLIENT_ID: 'WD5S0ZAJQC3SHWEQYVZAXKQGMK0IWB3YESWWSGG24YDI54QV',
        CLIENT_SECRET: 'PG3H3TEYU4RFGFL24QNJMESWPOVAH4GED51SYO5YMH5JLERP&v=20130815'
    };

    // Max 50 venues
    var COUNT_LIMIT = 50;
    var INTENT = 'checkin';

    // Finds venues around the position and runs the given function using the venues found
    // The given function would be for add markers and populating the venue list
    function searchTopPicks(position, onSuccessfulSearchFunc) {
        var url = createRequestUrl(position);
        $.getJSON(url, function (data) {
            if (data.meta.code === 200) {
                var venues = getVenues(data.response);
                onSuccessfulSearchFunc(venues);
            }
            else {
                onUnsuccessfulSearch();
            }
        }).fail(onFailedRequest);
    }

    // Creates the REST API string for FourSquare
    function createRequestUrl(position) {
        return ENDPOINT +
            'client_id=' + CREDENTIALS.CLIENT_ID + '&' +
            'client_secret=' + CREDENTIALS.CLIENT_SECRET + '&' +
            'limit=' + COUNT_LIMIT + '&' +
            'intent=' + INTENT + '&' +
            'll=' + position.lat + ',' + position.lng;
    }

    // Converts the venue objects from FourSquare to the custom Venue objects
    function getVenues(response) {
        var venues = [];
        var venuesFound = response.venues;
        for (var i in venuesFound) {
            if (venuesFound.hasOwnProperty(i)) {
                var venueFound = venuesFound[i];
                var venue = new window.Venue(venueFound);
                if (venue.category !== 'Neighborhood') {
                    venues.push(venue);
                }
            }
        }
        return venues;
    }

    function onUnsuccessfulSearch() {
        window.alert('Venue search engine failed.');
    }

    function onFailedRequest() {
        window.alert('Venue search engine could not be reached.');
    }

    window.venueSearchEngine = {
        searchTopPicks: searchTopPicks
    };
})();
