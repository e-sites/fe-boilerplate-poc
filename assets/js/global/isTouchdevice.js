/**
 * Useful environment variable to see if we're dealing with a touch device
 *
 * @author Boye Oomens <boye@e-sites.nl>
 * @type {Boolean}
 */
function isTouchDevice() {
  const msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture;
  const touch = ((('ontouchstart' in window) || msGesture || window.DocumentTouch) && document instanceof window.DocumentTouch);

  return !!touch;
}

module.exports = isTouchDevice;
