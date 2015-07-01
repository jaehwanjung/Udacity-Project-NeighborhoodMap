var Venue = function(data) {
    this.name = data.name;
    this.contact = data.contact.formattedPhone;
    this.location = data.location;
    this.category = data.categories[0].name;
    this.url = data.url;
};

var ViewModel = function () {
    var googleMap;
    var geocoder;
    var currentAddressMarker;
    var currentAddress = '';

    var self = this;

    self.filter = ko.observable('');
    self.allVenues = ko.observableArray([]);

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
        var contentString = "Your Location";
        currentAddressMarker = createMarker('Your Location', location, contentString);
    }

    function createMarker(title, location, contentString){
        var marker = new google.maps.Marker({
            position: location,
            map: googleMap,
            title: title
        });
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(googleMap, marker);
        });
        return marker;
    }

    function populateNeighborhood(location){
        var url = "https://api.foursquare.com/v2/venues/search?client_id=WD5S0ZAJQC3SHWEQYVZAXKQGMK0IWB3YESWWSGG24YDI54QV&client_secret=PG3H3TEYU4RFGFL24QNJMESWPOVAH4GED51SYO5YMH5JLERP&v=20130815&limit=20&section=topPicks&day=any&time=any&locale=en&ll=";
        url = url + location.lat() + ',' + location.lng();
        $.getJSON(url, function(data){
            if (data.meta.code == 200) {
                var venuesFound = data.response.venues;
                for(var i in venuesFound){
                    var venue = new Venue(venuesFound[i]);
                    self.allVenues.push(venue);
                    var markerContentString = createMarkerContentString(venue);
                    createMarker(venue.name, venue.location, markerContentString);
                }
            }
            else {
                //handleUnsuccessfulQuery();
            }
        })
    }

    function createMarkerContentString(venue){
        return '<p>' + venue.name + '</p>' +
            '<p>' + venue.category + '</p>';
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