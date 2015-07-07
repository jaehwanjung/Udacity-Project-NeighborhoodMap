/* app.js
 * The starting point of the application
 */

(function () {
    'use strict';

    window.viewModel = new window.ViewModel();

    //bind the view model to Knockout
    window.ko.applyBindings(window.viewModel);

    //initialize the app when the web page has completely loaded all content
    window.onload = function () {
        window.viewModel.loadScript('window.viewModel.initialize');
    };
}());