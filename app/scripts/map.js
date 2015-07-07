/* map.js
 * Represents the whole page (therefore the map).
 * Encapsulates all map-related 3rd party APIs such as Google Maps and Geocoding
 */

(function () {
    'use strict';

    var googleMap;
    var geocoder;
    var currentPosition;

    // The whole page DOM element for Google Maps
    var mapElement = $('#map-canvas')[0];

    // The DOM element for the address search input
    var addressSearchBar = $('#addressbar')[0];

    var openInfoWindow;

    function loadScript(callback) {
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDYFVxtFk26wbfNGXDY2JWcQWx-0EXyRz4&v=3.exp&signed_in=false&libraries=places&callback=' + callback;
        document.body.appendChild(script);
    }

    // Initializes the map objects, centers the map, and populates the map with the neighborhood information
    function initialize(onInitialization, onAddressAutoCompleteSelected) {
        initializeGoogleMap();
        initializeAddressSearchBar(onAddressAutoCompleteSelected);
        centerMapToCurrentUserPosition(onInitialization);
    }

    // Instantiates Google Maps and Geocoding objects
    function initializeGoogleMap() {
        var mapOptions = {
            center: {lat: 49.283742, lng: -123.122575},
            zoom: 18
        };
        googleMap = new google.maps.Map(mapElement, mapOptions);
        geocoder = new google.maps.Geocoder();
    }

    // Hook up the address search input with Google Maps Autocomplete
    function initializeAddressSearchBar(onAddressAutoCompleteSelected) {
        var addressSearchBarAutocomplete = new google.maps.places.Autocomplete(addressSearchBar, {types: ['geocode']});
        google.maps.event.addListener(addressSearchBarAutocomplete, 'place_changed', function () {
            onAddressAutoCompleteSelected(addressSearchBarAutocomplete.getPlace().formatted_address);
        });
    }

    // Initially center the map to the user's current position and populate neighborhood information around it
    function centerMapToCurrentUserPosition(onMapCentered) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (response) {
                    onGetCurrentPositionSuccess(response);
                    if (onMapCentered) {
                        onMapCentered();
                    }
                },
                onGetCurrentPositionFailure);
        } else {
            handleGeolocationUnsupported();
        }
    }

    function onGetCurrentPositionSuccess(response) {
        var position = new Position(response.coords.latitude, response.coords.longitude);
        centerMap(position);
    }

    function centerMap(position) {
        currentPosition = position;
        googleMap.setCenter(position);
    }

    function onGetCurrentPositionFailure() {
        alert("Geocode failed. Can't get the user's current position.");
    }

    function handleGeolocationUnsupported() {
        alert("Browser doesn't support Geolocation. Can't get the user's current position");
    }

    // Find the position of an address and center the map and the neighborhood information around it
    function centerMapByAddress(address, onCenterMapByAddress) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var position = new Position(location.lat(), location.lng());
                centerMap(position);
                onCenterMapByAddress();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    // Adds a marker to the map and returns it
    function addMarker(venue) {
        var marker = new google.maps.Marker({
            position: venue.position,
            map: googleMap,
            title: venue.name
        });

        var infoWindowContent =
            '<p class="marker-infoWindow-title">' + venue.name + '</p>' +
            '<div  class="marker-infoWindow-content"' +
            '<p>' + venue.contact + '</p>' +
            '<p>' + venue.address + '</p>' +
            '<p>' + venue.category + '</p>' +
            '<p>' + venue.url + '</p>' +
            '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        google.maps.event.addListener(marker, 'click', function () {
            if (openInfoWindow) {
                openInfoWindow.close();
            }
            infoWindow.open(googleMap, marker);
            openInfoWindow = infoWindow;
        });

        var showMarker = function () {
            marker.setMap(googleMap);
        };

        var hideMarker = function () {
            marker.setMap(null);
        };

        var clickMarker = function () {
            google.maps.event.trigger(marker, 'click');
            googleMap.panTo(marker.position);
        };

        var identifier = venue.identifier;
        return new Marker(identifier, showMarker, hideMarker, clickMarker);
    }

    function getCurrentPosition() {
        return currentPosition;
    }

    window.map = {
        loadScript: loadScript,
        initialize: initialize,
        centerMapByPosition: centerMap,
        centerMapByAddress: centerMapByAddress,
        addMarker: addMarker,
        getCurrentPosition: getCurrentPosition
    };

})();
