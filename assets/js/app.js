/*!
 * @section: Application JS module entry file
 * @project: PROJECT-NAME
 * @author: E-sites <frontend@e-sites.nl>
 */
/* eslint-disable import/first */

// Add ES5/6/7 polyfills
import './polyfills/core-js';

// Apply SVG polyfill to load external SVG's in unsupported browsers
import 'svgxuse';

// Google Analytics event tracking based on HTML data attributes
import vestigo from '@e-sites/vestigo';

// Set external links
import './utilities/setExtLinks';

/* eslint-enable import/first */

/**
 * Initialise imported modules
 */
vestigo.init();
