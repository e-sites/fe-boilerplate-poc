/*
 *  Project: Vestigo
 *  Google Analytics event tracking based on HTML data attributes
 *
 *  @author  : Boye Oomens <boye@e-sites.nl>
 *  @version : 0.1.0
 *  @license : MIT
 *  @see     : http://github.e-sites.nl/vestigo/
 */

/* global _gaq, console */
(function (window, document) {

	'use strict';

	// Local vars
	var doc = document,
		reFiletypes = /\.(zip|dmg|exe|pdf|doc*|xls*|ppt*|mp3)$/i,
		reExt = /(?:\.([^.]+))?$/,
		api = {},

		/**
		 * Default configuration
		 *
		 * @type {Object}
		 */
		defaults = {
			nodes: ['a', 'button'],
			prefix: 'ga',
			customFileTypes: []
		},

		/**
		 * Private debug status
		 *
		 * @type {Boolean}
		 */
		_debug = false,

		/**
		 * Main logging method
		 *
		 * @private
		 */
		_log = window.log || function () {
			if ( typeof window.console === 'object' ) {
				console.log((arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments)));
			}
		},

		/**
		 * inArray helper (courtesy of jQuery core)
		 *
		 * @param  {String} elem element
		 * @param  {Array}  arr  array
		 * @param  {Number} i    index
		 * @return {Number} index
		 */
		_inArray = function( elem, arr, i ) {
			var len;

			if ( arr ) {
				if ( arr.indexOf ) {
					return arr.indexOf.call( arr, elem, i );
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

				for ( ; i < len; i++ ) {
					if ( i in arr && arr[ i ] === elem ) {
						return i;
					}
				}
			}

			return -1;
		},

		/**
		 * Cross Browser helper to addEventListener.
		 *
		 * @param  {HTMLElement}     obj The Element to attach event to.
		 * @param  {string}          evt The event that will trigger the binded function.
		 * @param  {function(event)} fn The function to bind to the element.
		 * @return {boolean}         true if it was successfuly binded.
		 * @private
		 */
		_addEventListener = function(obj, evt, fn) {
			// W3C model
			if ( obj.addEventListener ) {
				obj.addEventListener(evt, fn, false);
				return true;
			}
			// Microsoft model
			else if ( obj.attachEvent ) {
				return obj.attachEvent('on' + evt, fn);
			}
			return false;
		},

		/**
		 * Find parent link/button helper
		 *
		 * @param  {HTMLElement}            elem The Element to start iterating from
		 * @return {HTMLElement|boolean}    The found element, or false if there's no match
		 * @private
		 */
		_parentLink = function( elem ) {
			var link = false;

			while ( (elem = elem.parentNode) && elem.nodeType !== 9 ) {
				if ( elem.nodeType === 1 && /^(a|button)$/i.test(elem.nodeName) ) {
					link = elem;
					break;
				}
			}

			return link;
		},

		/**
		 * Returns if the site is trackable by checking for available objects
		 *
		 * @return {Boolean} [description]
		 * @private
		 */
		_isTrackable = function () {
			return (typeof _gaq === 'object' || typeof dataLayer === 'object' || typeof ga === 'function');
		};

	/**
	 * Public API
	 *
	 * @type {Object}
	 */
	api = {

		/**
		 * Vestigo configuration
		 *
		 * @type {Object}
		 */
		config: defaults,

		/**
		 * Event object from the clicked element
		 *
		 * @type {Object}
		 */
		event: null,

		/**
		 * Main init method that kickstarts the event delegation
		 *
		 * @return {Object} api public API
		 */
		init: function () {
			if ( _isTrackable() ) {
				_addEventListener(doc, 'click', api.handle);
			}
			return api;
		},

		/**
		 * Enable debugging
		 *
		 * @return {Object} api public API
		 */
		debug: function () {
			_debug = true;
			return api;
		},

		/**
		 * Reads the given data-* attribute and returns the corresponding value
		 *
		 * @param  {HTMLElement} el the element that holds the actual data
		 * @param  {String}      key attribute key
		 * @return {String}      value of the data attr
		 */
		getData: function (el, key) {
			return (el.dataset ? el.dataset[api.config.prefix + key] : el.getAttribute('data-' + api.config.prefix + '-' + key.toLowerCase()));
		},

		/**
		 * Handles delegated click event and checks if we're dealing with an anchor
		 *
		 * @param {Object} e event object
		 */
		handle: function (e) {
			var evt = e || window.event,
				target = evt.target || evt.srcElement,
				href = target.href || null;

			// Create event reference
			api.event = evt;

			// Override target and href if the clicked element isn't a link or button
			if ( !/^(a|button)$/i.test(target.nodeName) ) {
				target = _parentLink(target);

				if ( !target ) {
					return;
				}

				href = target.href;
			}

			if ( !/^(a|button)$/i.test(target.nodeName) ) {
				return;
			}

			if ( href && href.match(/^https?\:/i) && !href.match(doc.domain) ) {
				api.trackEvent( 'External link', 'Open', href.replace(/^https?\:\/\//i, '') );
			} else if ( href && href.match(/^mailto\:/i) ) {
				api.trackEvent( 'Email', 'Send', href.replace(/^mailto\:/i, '') );
			} else if ( (href && href.match(reFiletypes)) || (href && _inArray( href.match(reExt)[1], api.config.customFileTypes ) !== -1) ) {
				api.trackEvent( 'Files', 'Download', api.parseUrl(href, 'path') );
			} else if ( api.getData(target, 'Category') ) {
				api.trackEvent( api.getData(target, 'Category'), api.getData(target, 'Action'), api.getData(target, 'Label') );
			}
		},

		/**
		 * Calls the push method from the global gaq object.
		 *
		 * @param {String} category
		 * @param {String} action
		 * @param {String} label
		 * @see https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
		 * @see https://developers.google.com/tag-manager/devguide#events
		 */
		trackEvent: function (category, action, label) {
			if ( _debug ) {
				_log(arguments);

				if ( api.event ) {
					api.event.returnValue = false;
					api.event.preventDefault();
				}
			}

			function _sendEvent(category, action, label) {
				if ( typeof dataLayer === 'object' ) {
					dataLayer.push({
						'event': category,
						'action': action,
						'label': label
					});
				} else if ( typeof ga === 'function' ) {
					ga('send', 'event', category, action, label);
				} else if ( typeof _gaq !== 'undefined' ) {
					_gaq.push(['_trackEvent', category, action, label]);
				}
			}

			if ( label ) {
				_sendEvent(category, action, label);
			} else {
				_sendEvent(category, action);
			}
		},

		/**
		 * Parse a URL and return its components
		 * Courtesy of PHP.js: http://phpjs.org/functions/parse_url/
		 *
		 * @author Kevin van Zonneveld, Steven Levithan & Brett Zamir
		 * @example parse_url('http://username:password@hostname/path?arg=value#anchor');
		 * @param {String} str
		 * @param {String} component
		 * @return {String} or {Object}
		 */
		parseUrl: function (str, component) {
			var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
				parser = {
					php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
				},
				md = parser.php.exec(str),
				uri = {},
				i = 14;

			while (i--) {
				if ( md[i] ) {
					uri[key[i]] = md[i];
				}
			}

			if ( component ) {
				return uri[component.replace('PHP_URL_', '').toLowerCase()];
			}

			delete uri.source;

			return uri;
		}

	};

	// Kickstart Vestigo and expose public API
	window.vestigo = api;

}(window, document));