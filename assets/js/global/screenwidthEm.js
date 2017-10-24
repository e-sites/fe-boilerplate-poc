/**
 * Return window.innerwidth in <em> format based on font-size
 *
 * @returns {number}
 */
function screenwidthEm() {
  return window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
}

module.exports = screenwidthEm;
