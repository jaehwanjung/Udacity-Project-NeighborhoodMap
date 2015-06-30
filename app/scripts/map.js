(function () {
    var googleMap;
    var geocoder;

    window.map = {};

    map.initialize = function () {
        geocoder = new google.maps.Geocoder();
        var mapOptions = {
            zoom: 14
        };
        googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                map.setCenter(pos);
            }, function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    };

    map.setCenterByAddress = function (address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                map.setCenter(location);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }

        });
    };

    map.setCenter = function (location) {
        googleMap.setCenter(location);
        if (map.currentAddressMarker) {
            map.currentAddressMarker.setMap(null);
        }
        map.currentAddressMarker = new google.maps.Marker({
            position: location,
            map: googleMap,
            title: 'Your Location'
        });
        var contentString = "Your Location";
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(map.currentAddressMarker, 'click', function () {
            infowindow.open(googleMap, map.currentAddressMarker);
        });
    };

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: window.map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        googleMap.setCenter(options.position);
    }

    function loadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDYFVxtFk26wbfNGXDY2JWcQWx-0EXyRz4&v=3.exp' +
        '&signed_in=true&callback=map.initialize';
        document.body.appendChild(script);
    }

    window.onload = loadScript;
})(window);