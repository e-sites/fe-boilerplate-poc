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

import * as conditioner from 'conditioner-core';

// Set external links
import './utilities/setExtLinks';

/* eslint-enable import/first */

/**
 * Initialise imported modules
 */
vestigo.init();

/**
 * Configure conditioner
 */
conditioner.addPlugin({
  // converts module aliases to paths
  moduleSetName: name => `${name}.js`,
  // get the module constructor
  moduleGetConstructor: module => module.default,
  // override the import
  // prettier-ignore
  moduleImport: name => import(
    /* https://webpack.js.org/api/module-methods/#import- */
    /* set to "eager" to create a single chunk for all modules */
    /* set to "lazy" to create a separate chunk for each module */
    /* webpackChunkName: "[request]" */
    /* webpackMode: "lazy" */
    `./modules/${name}`),
});

conditioner.hydrate(document.documentElement);
