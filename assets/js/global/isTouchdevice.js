/**
 * Useful environment variable to see if we're dealing with a touch device
 *
 * @author Boye Oomens <boye@e-sites.nl>
 * @type {Boolean}
 */
module.exports = function () {
	var msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture,
		touch = (( 'ontouchstart' in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);

	return !!touch;
}