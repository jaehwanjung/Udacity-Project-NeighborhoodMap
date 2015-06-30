var ViewModel = function () {
    var googleMap;
    var geocoder;
    var currentAddressMarker;
    var currentAddress = '';

    var self = this;

    self.filter = ko.observable('');

    self.initialize = function () {
        var mapOptions = {
            zoom: 14
        };

        googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        geocoder = new google.maps.Geocoder();

        var addressbar = document.getElementById('addressbar');
        autocomplete = new google.maps.places.Autocomplete(( addressbar), {types: ['geocode']});
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            self.resetNeighborhood();
        });

        setNeighborhoodToCurrentUserPosition();
    };

    function setNeighborhoodToCurrentUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                setNeighborhood(pos);
            }, function () {
                // Geocode failed
                handleNoGeolocation();
            });
        } else {
            // Browser doesn't support Geolocation
            handleGeolocationUnsupported();
        }
    }

    function setNeighborhood(location) {
        googleMap.setCenter(location);
        setNeighborhoodMarker(location);
        populateNeighborhood(location);
    }

    function setNeighborhoodMarker(location) {
        if (currentAddressMarker) {
            currentAddressMarker.setMap(null);
        }
        currentAddressMarker = new google.maps.Marker({
            position: location,
            map: googleMap,
            title: 'Your Location'
        });
        var contentString = "Your Location";
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(currentAddressMarker, 'click', function () {
            infowindow.open(googleMap, currentAddressMarker);
        });
    }

    function populateNeighborhood(){
        var url = "https://api.foursquare.com/v2/venues/search?client_id=WD5S0ZAJQC3SHWEQYVZAXKQGMK0IWB3YESWWSGG24YDI54QV&client_secret=PG3H3TEYU4RFGFL24QNJMESWPOVAH4GED51SYO5YMH5JLERP&v=20130815&ll=40.7,-74&query=sushi";
        $.getJSON(url, function(data){
            alert(data);
        })
    }

    function handleNoGeolocation() {
        alert("Error: The Geolocation service failed")
    }

    function handleGeolocationUnsupported() {
        alert('Error: Your browser doesn\'t support geolocation.')
    }

    self.resetNeighborhood = function () {
        currentAddress = $("#addressbar").val();
        setNeighborhoodByAddress(currentAddress);
    };

    function setNeighborhoodByAddress(address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                setNeighborhood(location);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }

        });
    }

    window.onload = self.initialize;
};

ko.applyBindings(new ViewModel());