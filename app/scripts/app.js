var ViewModel = function () {
    var self = this;

    self.address = ko.observable('');
    self.filter = ko.observable('');
};

ko.applyBindings(new ViewModel());