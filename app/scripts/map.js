(function (global) {
    'use strict';

    var googleMap;
    var geocoder;

    var mapElement = $('#map-canvas')[0];
    var addressSearchBar = $('#addressbar')[0];

    function initialize() {
        initializeGoogleMap();
        initializeAddressSearchBar();
        centerMapToCurrentUserPosition();
    }

    function initializeGoogleMap() {
        var mapOptions = {
            center: {lat: 49.283742, lng: -123.122575},
            zoom: 14
        };
        googleMap = new google.maps.Map(mapElement, mapOptions);
        geocoder = new google.maps.Geocoder();
    }

    function initializeAddressSearchBar() {
        var addressSearchBarAutocomplete = new google.maps.places.Autocomplete(addressSearchBar, {types: ['geocode']});
        google.maps.event.addListener(addressSearchBarAutocomplete, 'place_changed', function () {
            self.resetNeighborhood();
        });
    }

    function centerMapToCurrentUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                onGetCurrentPositionSuccess,
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
        googleMap.setCenter(position);
    }

    function onGetCurrentPositionFailure() {
        alert("Geocode failed. Can't get the user's current position.");
    }

    function handleGeolocationUnsupported() {
        alert("Browser doesn't support Geolocation. Can't get the user's current position");
    }

    function centerMapByAddress(address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var position = new Position(location.lat(), location.lng());
                centerMap(position);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function createMarker(venue) {
        var marker = new google.maps.Marker({
            position: venue.position,
            map: googleMap,
            title: venue.name
        });

        var infoWindow = new google.maps.InfoWindow({
            content: venue.category
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(googleMap, marker);
        });

        var showMarker = function () {
            marker.setMap(googleMap);
        };

        var hideMarker = function () {
            marker.setMap(null);
        };

        var identifier = venue.getIdentifier();
        return new Marker(identifier, showMarker, hideMarker);
    }

    global.map = {
        initialize: initialize,
        centerMapByPosition: centerMap,
        centerMapByAddress: centerMapByAddress,
        createMarker: createMarker
    };

})(window);