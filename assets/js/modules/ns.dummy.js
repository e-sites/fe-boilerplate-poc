/**
 * Namespaced dummy module
 * 
 * This particular pattern fits in best when the file is loaded conditionally
 * and the init method is being invoked in events.js
 *
 * @author Boye Oomens <boye@e-sites.nl>
 */

/* global ns, jQuery */
ns.dummy = (function (window, $) {

	'use strict';

	var win = window,
		doc = win.document,

		// Cached DOM elements
		$win = $(win),
		$html = $('html'),

		// Private module variables
		_foo = 10,
		_bar = 5,

		// Reserved vars
		varX, varY, varZ;

	/**
	 * Private method that does something with local variables
	 *
	 * @author Boye Oomens <boye@e-sites.nl> 
	 * @private
	 */
	function _privateMethod() {
		console.log('do some private stuff');
	}
	
	/**
	 * Public methods
	 */
	return {

		/**
		 * Sets all necessary events and kickstarts the module
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @return {Object} dummy public API methods
		 */
		init: function () {
			_privateMethod();
			return dummy;
		},

		/**
		 * Returns both foo and bar value (do'h)
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @return {Array}
		 */
		getFooBar: function () {
			return [_foo, _bar];
		}

	};

})(this, jQuery);