/**
 * Adds global functions or values and make this available in app.global
 */
import screenwidthEm from './screenwidthEm';
import touchDevice from './isTouchdevice';

window.app.global = {
  screenWidth: screenwidthEm,
  isTouchDevice: touchDevice,
};
