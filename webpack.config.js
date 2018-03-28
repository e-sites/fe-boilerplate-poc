const fs = require('fs');
const Encore = require('@symfony/webpack-encore');
const WebpackNotifierPlugin = require('webpack-notifier');
const eslintPretty = require('eslint-formatter-pretty');

const { revisionFiles, paths, js: { entries, vendor } } = JSON.parse(fs.readFileSync('./package.json')).config;

const folder = paths.folders.js;

const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

Encore.configureRuntimeEnvironment(env);

Encore
  // directory where all compiled assets will be stored
  .setOutputPath(paths.dist + folder)

  // what's the public path to this directory (relative to your project's document root dir)
  .setPublicPath('/build/js/')

  // empty the outputPath dir before each build
  // .cleanupOutputBeforeBuild()

  .enableSourceMaps(!Encore.isProduction())

  // Add linting
  .addLoader({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      formatter: eslintPretty,
    },
  })

  // Add notifications
  .addPlugin(new WebpackNotifierPlugin())

  // Split vendor assets from the entries
  .createSharedEntry('vendor', vendor);

// Dynamically load entry points
entries.forEach((entry) => {
  Encore.addEntry(entry.replace('.js', ''), `${paths.source + folder}/${entry}`);
});

// Check for errors and exit the process
if (env === 'production') {
  // eslint-disable-line func-names
  Encore.addPlugin(function () {
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
