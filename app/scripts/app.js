/* app.js
 * The starting point of the application
 */

'use strict';

var viewModel = new ViewModel();

//bind the view model to Knockout
ko.applyBindings(viewModel);

//initialize the app when the web page has completely loaded all content
window.onload = viewModel.initialize
