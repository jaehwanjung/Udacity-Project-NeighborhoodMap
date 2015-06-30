var ViewModel = function () {
    var self = this;

    var currentAddress = '';

    self.filter = ko.observable('');

    self.centerMap = function () {
        currentAddress = $("#addressbar").val();
        map.setCenterByAddress(currentAddress);
    }
};

ko.applyBindings(new ViewModel());