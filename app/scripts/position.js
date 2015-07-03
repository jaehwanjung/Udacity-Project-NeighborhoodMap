(function () {
    'use strict';

    window.Position = function (lat, lng) {
        this.lat = lat;
        this.lng = lng;
    };

    window.Position.prototype.toString = function () {
        return '{lat: ' + this.lat + ', lng: ' + this.lng + '}';
    };

})();

