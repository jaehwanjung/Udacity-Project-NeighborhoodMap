(function () {
    'use strict';

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

