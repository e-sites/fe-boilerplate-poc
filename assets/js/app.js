/**
 * Main entry file for app logic
 */

// Config
app.config = {
	width_sm: 480,
	width_md: 640,
	width_lg: 960
};

// Apply SVG polyfill to load external SVG's in unsupported browsers
require('svgxuse');
