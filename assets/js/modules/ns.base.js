/**
 * Site-specific methods that do not belong in functions.js 
 * and can't be grouped in a separated module
 *
 * @author Naam Developer <developer@e-sites.nl>
 */

/* global ns, jQuery */
(function (window, $) {

	'use strict';

	var win = window,
		doc = win.document,

		// Cached DOM elements
		$win = $(win),
		$html = $('html'),

		// Private module variables
		_foo = 10;
	
	/**
	 * Extend namespace with site-specific methods
	 * These methods can be called as follows: `ns.methodName()`
	 */
	$.extend(ns, {

		/**
		 * Returns both foo and bar value (do'h)
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @return {Array}
		 */
		getFoo: function () {
			return _foo;
		}

	});

})(this, jQuery);