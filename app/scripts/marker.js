(function (global) {
    'use strict';

    var showFunction;
    var hideFunction;

    global.Marker = function (identifier, showFunc, hideFunc) {
        this.identifier = identifier;
        showFunction = showFunc;
        hideFunction = hideFunc;
    };

    global.Marker.prototype.show = function () {
        showFunction();
    };

    global.Marker.prototype.hide = function () {
        hideFunction();
    };

})(window);

