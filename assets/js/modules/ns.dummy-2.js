/**
 * Encapsulated dummy module
 * 
 * When using this particular pattern it's not needed to call a separated init method
 * Just load the file and it will be initiated instantly
 *
 * @author Boye Oomens <boye@e-sites.nl>
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
		console.log('do some stuff');
	}
	
	/**
	 * Sets all necessary events and kickstarts the module
	 *
	 * @author Boye Oomens <boye@e-sites.nl>
	 */
	function _init() {
		_privateMethod();
	}

	_init();

})(this, jQuery);