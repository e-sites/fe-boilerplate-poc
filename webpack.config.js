const path = require('path');
const fs = require('fs');
const Encore = require('@symfony/webpack-encore');

const { revisionFiles, paths, js: { entries, vendor } } = JSON.parse(fs.readFileSync('./package.json')).config;

const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

Encore.configureRuntimeEnvironment(env);

Encore
  // directory where all compiled assets will be stored
  .setOutputPath(paths.dist)

  // what's the public path to this directory (relative to your project's document root dir)
  .setPublicPath('/build')

  .enableSassLoader((options) => {
    options.includePaths = [
      path.resolve(process.cwd(), 'node_modules'),
    ]
  })

  .enablePostCssLoader()

  // empty the outputPath dir before each build
  .cleanupOutputBeforeBuild()

  .enableSourceMaps(!Encore.isProduction())

  // Split vendor assets from the entries
  .createSharedEntry('js/vendor', vendor);


// Dynamically load entry points
entries.forEach((entry) => {
  Encore.addEntry(entry.replace(/(.*)\.(.*?)$/, '$1'), `${paths.source}/${entry}`);
});


// Check for errors and exit the process
if (env === 'production') {
  Encore.addPlugin(function () { // eslint-disable-line func-names, needed to expose `this`
    this.plugin('done', (stats) => {
      if (stats.compilation.errors && stats.compilation.errors.length) {
        throw new Error('webpack build failed');
      }
    });
  });
}

if (revisionFiles) {
  Encore.enableVersioning();
}

// Expose webpack config
const config = Encore.getWebpackConfig();

// export the final configuration
module.exports = config;
