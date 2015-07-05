(function () {
    'use strict';

    window.ViewModel = function () {

        var self = this;

        var markers = {};

        self.filterKeyword = ko.observable('');
        self.allVenues = ko.observableArray([]);
        self.isFilterSearchBoxSelected = ko.observable(false);
        self.currentAddress = ko.observable('');
        self.isVenueListToggled = ko.observable(true);
        self.isTypeaheadListMouseOver = ko.observable(false);
        self.isTypeaheadListOn = ko.computed(function () {
            return self.isFilterSearchBoxSelected() || self.isTypeaheadListMouseOver();
        });

        self.allCategories = ko.computed(function () {
            var allVenues = self.allVenues();
            var allCategories = $.map(allVenues, function (venue) {
                return venue.category;
            });
            return allCategories.filter(isUnique);
        });

        function isUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        self.filteredCategories = ko.computed(function () {
            var filterKeyword = self.filterKeyword();
            var allCategories = self.allCategories();
            return $.grep(allCategories, function (category) {
                return filterKeyword == '' || category.toLowerCase().includes(filterKeyword.toLowerCase());
            });
        });

        self.filteredVenues = ko.computed(function () {
            var filteredCategories = self.filteredCategories();

            var allVenues = self.allVenues();
            var filteredVenues = $.grep(allVenues, function (venue) {
                return filteredCategories.indexOf(venue.category) >= 0;
            });

            var filterVenueIdentifiers = $.map(filteredVenues, function (venue) {
                return venue.identifier;
            });

            for (var i in markers) {
                if (markers.hasOwnProperty(i)) {
                    var marker = markers[i];
                    if (filterVenueIdentifiers.indexOf(marker.identifier) >= 0) {
                        marker.show();
                    } else {
                        marker.hide();
                    }
                }
            }

            return filteredVenues;
        });

        self.initialize = function () {
            map.initialize(populateNeighborhood);
        };

        function populateNeighborhood() {
            var currentPosition = map.getCurrentPosition();
            var addMarkersOnSuccessfulSearch = function (venues) {
                for (var i in venues) {
                    if (venues.hasOwnProperty(i)) {
                        var venue = venues[i];
                        markers[venue.identifier] = map.addMarker(venue);
                    }
                    self.allVenues.push(venue);
                }
            };
            venueSearchEngine.searchTopPicks(currentPosition, addMarkersOnSuccessfulSearch);
        }

        self.setNeighborhood = function () {
            var currentAddress = self.currentAddress();
            map.centerMapByAddress(currentAddress);
            populateNeighborhood();
        };

        self.toggleVenueList = function () {
            var listToggled = self.isVenueListToggled();
            self.isVenueListToggled(!listToggled);
        };

        self.clickVenueMarker = function (venue) {
            var marker = markers[venue.identifier];
            marker.click();
        };

        self.clickTypeahead = function (category) {
            self.filterKeyword(category);
        };

        self.typeaheadListMouseOver = function () {
            self.isTypeaheadListMouseOver(true);
        };

        self.typeaheadListMouseOut = function () {
            self.isTypeaheadListMouseOver(false);
        };
    };

})();


