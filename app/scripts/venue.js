(function () {
    'use strict';

    window.Venue = function (data) {
        this.name = data.name;
        this.contact = getValueOrDefault(data.contact, 'formattedPhone', 'No contact information');
        this.address = getValueOrDefault(data.location, 'formattedAddress', 'No address');
        this.position = new Position(data.location.lat, data.location.lng);
        this.category = getValueOrDefault(data.categories[0], 'name', 'No category');
        this.url = getValueOrDefault(data, 'url', 'No Url');
        this.identifier = getIdentifier(this.name, this.position);
    };

    function getIdentifier(name, position) {
        return name + position.toString();
    }

    function getValueOrDefault(target, property, defaultValue) {
        if (target === undefined || target[property] === undefined) {
            return defaultValue;
        }

        return target[property];
    }

})();

