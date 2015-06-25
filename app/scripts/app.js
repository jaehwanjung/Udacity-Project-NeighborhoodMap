var filterItems = [
    {
        name: 'Food',
        imageSource: ''
    },
    {
        name: 'Coffee',
        imageSource: ''
    },
    {
        name: 'Nightlife',
        imageSource: ''
    },
    {
        name: 'Fun',
        imageSource: ''
    },
    {
        name: 'Shopping',
        imageSource: ''
    }
];

var Filter = function (data) {
    this.isSelected = ko.observable(false);
    this.name = ko.observable(data.name);
    this.imageSource = ko.observable(data.imageSource);

    this.clicked = function () {
        this.isSelected = !this.isSelected;
    }
};

var ViewModel = function () {
    var self = this;

    var DISPLAYED_FILTER_COUNT = 3;

    this.hiddenFilters = [];
    filterItems.forEach(function (filterItem) {

        self.hiddenFilters.push(new Filter(filterItem));
    });
    var initialFilters = self.hiddenFilters.splice(0, DISPLAYED_FILTER_COUNT);
    this.displayedFilters = ko.observableArray(initialFilters);

    this.scrollFiltersToLeft = function () {
        var filterToHide = self.displayedFilters.splice(0, 1);
        self.hiddenFilters.push(filterToHide);
        var filterToDisplay = self.hiddenFilters.splice(0, 1);
        self.displayedFilters.push(filterToDisplay);
    };

    this.scrollFiltersToRight = function () {
        var filterToHide = self.displayedFilters.pop();
        self.hiddenFilters.unshift(filterToHide);
        var filterToDisplay = self.hiddenFilters.pop();
        self.displayedFilters.unshift(filterToDisplay);
    };
};

ko.applyBindings(new ViewModel());