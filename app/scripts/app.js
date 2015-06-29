var ViewModel = function () {
    var self = this;

    self.address = ko.observable('');
};

ko.applyBindings(new ViewModel());