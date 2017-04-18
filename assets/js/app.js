/**
 * Main entry file for app logic
 */

// Apply SVG polyfill to load external SVG's in unsupported browsers
require('svgxuse');

// Global functions
require('./global/_global');

// Config
app.config = {
	breakpoints: {
		sm: 30,
		md: 40,
		lg: 60,
		xl: 74
	}
};