(function (global) {
    'use strict';

    global.Position = function (lat, lng) {
        this.lat = lat;
        this.lng = lng;
    };

    global.Position.prototype.toString = function () {
        return '{lat: ' + this.lat + ', lng: ' + this.lng + '}';
    };

})(window);

