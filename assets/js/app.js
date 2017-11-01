/*!
 * @section: Application JS module entry file
 * @project: PROJECT-NAME
 * @author: E-sites <frontend@e-sites.nl>
 */

// Apply SVG polyfill to load external SVG's in unsupported browsers
import 'svgxuse';

// Google Analytics event tracking based on HTML data attributes
import '@e-sites/vestigo';

// Add ES5/6/7 polyfills
import './polyfills/core-js';

// Set external links
import './utilities/setExtLinks';
