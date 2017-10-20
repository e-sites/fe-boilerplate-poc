# E-sites front-end workflow

This is the E-sites front-end dev workflow repository. This is where we centralise our Gulp tasks, JS and CSS structure and directory structure for images and SVGs.

## Requirements

- Node 6
- Gulp CLI (`npm install -g gulp-cli`)
- **For Linux users**: Linux: `notify-send`/`notify-osd` should be installed (On Ubuntu this is installed per default). See [gulp-notify requirements](https://github.com/mikaelbr/gulp-notify#requirements).
- **Optional**: [Yarn](https://yarnpkg.com/en/docs/install) For faster installation of modules.

## How to use it

First of all, make a checkout of this repository by doing:

`git clone https://github.com/e-sites/fe-boilerplate-poc.git && cd fe-boilerplate-poc`

If you have Yarn installed, run `yarn` or otherwise run `npm install`.

Configure the paths for Gulp to watch in `tasks/base/conf.js` and where to store the built output.

Then run `gulp watch` and the tasks should start watching the configured folders. Tasks are run automatically for a first time when watching. If you don't need watching, just run `gulp`.

## Separate tasks

These tasks are included in this setup:

- `gulp css`
- `gulp js`
- `gulp svg`
- `gulp sprite` (Requires Glue)
- `gulp watch`

## Features

- Gulp 4
- ITCSS directory structure for CSS
- Sass base with Normalize, Bourbon and Neat
- ESLint config (`eslint-plugin-compat` + `babel-eslint` for now, will add specific rules later)
- Babel config (`babel-preset-env` + `stage-3`)
- Path configuration for input and output folders (`tasks/base/conf.js`)
- Success and error notifications for tasks (`tasks/base/handlers.js`)
- Browserify JS bundler task (`tasks/javascript/javascript.js`)
- Sass compilation and minification task (`tasks/sass/sass.js`)
- SVG sprite generation task (`tasks/svg/svg.js`)
- Asset versioning via `gulp-rev`. Stores hashed filenames and generates a manifest with mapping from original filenames to hashed filenames.
- External SVG polyfill for IE10/11 (`svgxuse`) so SVG sprites can be a separate file and can thus be cached easier
