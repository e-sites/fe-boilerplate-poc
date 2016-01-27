/**
 * @section	: Small jQuery plugins / extensions
 * @project	: PROJECT_NAAM
 * @author	: Naam Developer <developer@e-sites.nl>
 */

(function ($) {

	'use strict';

	$.fn.extend({

		/**
		 * HTML5 autofocus plugin
		 *
		 * Copyright (c) 2009, Mike Taylor, http://miketaylr.com
		 * USAGE: $('[autofocus]').autofocus();, assuming a boolean attribute like:
		 * @return {Object}
		 */
		autofocus: function () {
			// Test to see if autofocus is natively supported before proceeding
			return ( this.first().autofocus !== true ) ? this.focus() : this;
		},

		/**
		 * jQuery extension which scrolls to a given element
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @param {Number} speed - in miliseconds
		 * @param {Number} offset - y-axis in pixels
		 * @param {String} easing - type of easing (swing or linear)
		 * @return {Object}
		 */
		scrollTo: function (speed, offset, easing) {
			return this.each(function () {
				$('html, body').animate({scrollTop: ($(this).offset().top - (offset !== undefined ? offset : 50))}, speed, easing);
			});
		},

		/**
		 * Small plugin to implement a performant scroll listener
		 * Based on an idea by John Resig
		 *
		 * @author Boye Oomens <boye@e-sites.nl>
		 * @see: http://ejohn.org/blog/learning-from-twitter/
		 * @see: https://gist.github.com/boye/9003380
		 */
		perfscroll: function(fn, interval) {
			var didScroll = false,
				evt = null;

			$(this).on('scroll', function (e) {
				evt = e;
				if ( !didScroll ) {
					didScroll = true;
				}
			});

			setInterval($.proxy(function () {
				if ( didScroll ) {
					didScroll = false;
					if (fn && $.isFunction(fn)) {
						fn.apply(this, [evt]);
					}
				}
			}, this), interval || 250);
		}

	});

}(jQuery));