'use strict';

(function (window, document, app, $) {
	/**
	 * Generic helper and utility methods
	 * Do not use for site-specific logic
	 *
	 * @type {Object}
	 */
	app.util = {
		/**
		 * Useful environment variable to see if we're dealing with a touch device
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @type {Boolean}
		 */
		isTouchDevice: function () {
			var msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture,
				touch = (( 'ontouchstart' in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);

			return !!touch;
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
		 * Check if value is a number
		 *
		 * @param number
		 * @returns {boolean}
		 */
		isNumber: function(number) {
			return !isNaN( parseFloat(number) ) && isFinite(number);
		}
	};
}(window, document, app, jQuery));