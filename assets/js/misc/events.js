/**
 * @section : Unobtrusive JavaScript events and function calls, triggered on DOMContentLoaded.
 * @project : PROJECT_NAAM
 * @author  : Naam Developer <developer@e-sites.nl>
 */

(function (window, document, $, app) {

	'use strict';

	// Main cachebuster for lazyloaded scripts
	$script.urlArgs('bust=' + app.cachebuster);

	/**
	 * Main init function that kickstarts all site logic when the DOM is loaded
	 * Make sure all event handlers are placed within this function
	 *
	 * @private
	 */
	function _init() {

		// Mimic autofocus for IE<10
		$('[autofocus]').autofocus();

		// Parsley based form validation
		app.util.initFormValidation('.js-validate-form');

		// Custom event tracking
		// Tracks external links and downloads by default
		// Use vestigo.init().debug(); to see all logs
		vestigo.init();

		// General event delegation
		// Use this $(document) reference to chain other delegated events
		$(document)

			// Handle external links (the old way)
			.on('click', 'a[rel="external"]', app.util.setExtLinks)

			// Focus search box when pressing '/'
			.on('keyup', app.util.focusSearchBox);
	}

	// Initialize
	$(document)
		.ready(_init)
		.ajaxError(app.util.processXhrError);

}(window, document, jQuery, app));