/**
 * Small wrapper around $script to fix conditional loading
 */
import $script from 'scriptjs';

const noop = () => {};

const loadScript = (setup) => {
  if (typeof $script === 'undefined') {
    console.warn('Could not load module: $script is undefined');
    return;
  }

  if (!setup || typeof setup !== 'object') {
    console.warn('Could not load module: no setup given or `setup` is not an object');
    return;
  }

  const hasTestProp = Object.prototype.hasOwnProperty.call(setup, 'test');

  if (hasTestProp && !!setup.test) {
    $script.order((setup.url.isArray() ? setup.url : [setup.url]), setup.callback || noop);
  }
};

export default loadScript;

