/**
 * @section : Global JavaScript functions / helpers
 * @project : PROJECT_NAAM
 * @author  : Naam Developer <developer@e-sites.nl>
 */

(function (window, document, app, $) {

	'use strict';

	/**
	 * Global wrapper around `console.log` (when available). It won't trigger an error in IE
	 * and will only log on workingcopies
	 *
	 * @method log
	 * @param {Any} Values to log
	 */
	window.log = function () {
		if ( typeof window.console === 'object' && /.dev[1-9]?-/i.test(document.location.host) ) {
			console.log((arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments)));
		}
	};

	/**
	 * General cachebuster based on the lastmodified attribute
	 * Please note that when the [%minify%] component isn't used you'll
	 * need to provide a different value to act as cache buster
	 *
	 * @type {String}
	 */
	app.cachebuster = $('link[data-lastmodified]').eq(0).data('lastmodified');

	/**
	 * Useful environment variable to see if we're dealing with a touch device
	 *
	 * @author Boye Oomens <boye@e-sites.nl>
	 * @type {Boolean}
	 */
	app.isTouchDevice = (function () {
		var msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture,
			touch = (( 'ontouchstart' in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);

		return !!touch;
	}());

	/**
	 * Generic helper and utility methods
	 * Do not use for site-specific logic
	 *
	 * @type {Object}
	 */
	app.util = {

		/**
		 * Helper function as alias for getElementById, mainly used to see if a certain DOM element exists
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @param {String} id - id selector without the hash character
		 * @return {Boolean}
		 */
		isset: function (id) {
			return !!document.getElementById(id);
		},

		/**
		 * Handles external links based on rel="external"
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 */
		setExtLinks: function () {
			this.target = '_blank';
		},

		/**
		 * Global XHR error handling function, so we can log all our "unknown" XHR errors
		 *
		 * @param  {Object} e - jQuery event object
		 * @param  {Object} xhr - jQuery XHR object
		 * @param  {Object} exception
		 * @return {Object} error Object
		 * @author Joris van Summeren <joris@e-sites.nl>
		 */
		processXhrError: function (e, xhr, exception, error) {
			var msg = '',
				url;

			if ( exception && exception.url ) {
				url = exception.url;
			}

			if ( exception === 'timeout' || error === 'timeout' ) {
				msg = 'Timeout error.';
			} else if ( xhr.status === 0 ) {
				msg = 'Can\'t connect. Verify network.';
			} else if ( xhr.status === 403 ) {
				msg = 'Forbidden [403]';
			} else if ( xhr.status === 404 ) {
				msg = 'Not Found [404]';
			} else if ( xhr.status === 500 ) {
				msg = 'Internal Server Error [500].';
			} else if ( exception === 'parsererror' ) {
				msg = 'Requested JSON parse failed.';
			} else if ( exception === 'abort' ) {
				msg = 'Ajax request aborted.';
			} else if ( error.message ) {
				msg = error.message + '.';
			} else {
				msg = 'Uncaught Error. ' + xhr.responseText + ' [' + xhr.status + '].';
			}

			throw new Error('A XHR error occurred: ' + msg + (url ? ' (URL: ' + url + ')' : '') );
		},

		/**
		 * Small wrapper around $script to fix conditional loading
		 *
		 * @param  {Object} setup options
		 * @author Boye Oomens <boye@e-sites.nl>
		 */
		loadScript: function (setup) {
			if ( typeof $script === 'undefined' ) {
				return console.warn('Could not load module: $script is undefined');
			}
			if ( !setup || !$.isPlainObject(setup) ) {
				return console.warn('Could not load module: no setup given or `setup` is not an object');
			}
			if ( setup.hasOwnProperty('test') && !!setup.test ) {
				$script.order(($.isArray(setup.url) ? setup.url : [setup.url]), setup.callback || $.noop);
			}
		},

		/**
		 * Kickstarts form validation based on Parsley.js
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @param  {String} selector target elements
		 * @param  {Object} conf optional config object
		 * @see    http://parsleyjs.org/
		 */
		initFormValidation: function (selector, conf) {
			var $forms = $(selector);

			// Fail silenty when there are no forms in the DOM
			if ( !$forms.length ) {
				return;
			}

			// First, set Parsley locale
			window.ParsleyValidator.setLocale($('html').attr('lang'));

			// Instantiate Parsley plugin (no chaining after this)
			$forms.parsley($.extend({
				focus: 'none'
			}, conf || {}));

			// Apply main listener that display the corresponding error container
			$forms.each(function () {
				$(this).parsley().on('form:validated', app.util.showErrorContainer);
			});
		},

		/**
		 * Shows parsley error container and sets focus to make sure that screenreaders
		 * will read the corresponding message(s)
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @param  {Object} e Event object
		 */
		showErrorContainer: function (e) {
			if ( !e.validationResult ) {
				$(e.$element[0])
					.find('.parsley-error-container')
					.fadeIn()
					.scrollTo(500)
					.attr({
						'tabindex': '0',
						'role': 'error'
					})
					.trigger('focus');
			} else {
				// Prevent multiple submits by disabling the submit button
				// Small check to see if we're dealing with a legit submit event
				if ( e.submitEvent ) {
					$(e.$element[0])
						.find('[type="submit"]')
						.attr('disabled', 'disabled');
				}
			}
		},

		/**
		 * Focus search box when pressing '/'
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @param  {Object} e Event object
		 */
		focusSearchBox: function (e) {
			if ( e.keyCode === 191 && !/(input|textarea)/.test(e.target.nodeName.toLowerCase()) ) {
				$('form[role="search"]').eq(0).find('input').eq(0).trigger('focus');
			}
		}
	};

}(window, document, app, jQuery));