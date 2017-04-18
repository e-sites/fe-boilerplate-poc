/**
 * Return window.innerwidth in <em> format based on font-size
 * 
 * @returns {number}
 */
module.exports = function () {
	return window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
};