'use strict';

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

window.onload = viewModel.initialize;