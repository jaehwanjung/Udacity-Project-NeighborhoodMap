/* position.js
 * Represents a position on the map.
 */

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
