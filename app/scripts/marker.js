(function () {
    'use strict';

    window.Marker = function (identifier, showFunc, hideFunc) {
        this.identifier = identifier;
        this.showFunction = showFunc;
        this.hideFunction = hideFunc;
    };

    window.Marker.prototype.show = function () {
        this.showFunction();
    };

    window.Marker.prototype.hide = function () {
        this.hideFunction();
    };

})();

