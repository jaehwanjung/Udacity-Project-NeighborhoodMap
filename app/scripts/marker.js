/* marker.js
 * Represents a marker on the map.
 * Must be created by the map object (map.js)
 */

(function () {
    'use strict';

    // Takes function parameters that manipulates the marker
    window.Marker = function (identifier, showFunc, hideFunc, clickFunc) {
        this.identifier = identifier;
        this.showFunction = showFunc;
        this.hideFunction = hideFunc;
        this.clickFunction = clickFunc;
    };

    window.Marker.prototype.show = function () {
        this.showFunction();
    };

    window.Marker.prototype.hide = function () {
        this.hideFunction();
    };

    window.Marker.prototype.click = function () {
        this.clickFunction();
    }

})();
