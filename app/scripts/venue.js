(function (global) {
    'use strict';

    global.Venue = function (data) {
        this.name = data.name;
        this.contact = data.contact.formattedPhone;
        this.address = data.location.formattedAddress;
        this.position = new Position(data.location.lat(), data.location.lng());
        this.category = data.categories[0].name;
        this.url = data.url;
    };

    global.Venue.prototype.getIdentifier = function () {
        return this.name + this.position.toString();
    };

})(window);

