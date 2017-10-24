const fs = require('fs');
const Encore = require('@symfony/webpack-encore');

const { paths, js: { entries, vendor } } = JSON.parse(fs.readFileSync('./package.json')).config;
const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

Encore.configureRuntimeEnvironment(env);

Encore
  // directory where all compiled assets will be stored
  .setOutputPath(paths.dist.js)

  // what's the public path to this directory (relative to your project's document root dir)
  .setPublicPath('/')

  // empty the outputPath dir before each build
  .cleanupOutputBeforeBuild()

  .enableSourceMaps(!Encore.isProduction())

  // Split vendor assets from the entries
  .createSharedEntry('vendor', vendor)

  // create hashed filenames (e.g. app.abc123.css)
  .enableVersioning();

// Dynamically load entry points
entries.forEach((entry) => {
  Encore.addEntry(entry.replace('.js', ''), `${paths.source.js}/${entry}`);
});

const config = Encore.getWebpackConfig();

config.bail = true;

console.log(config);

// export the final configuration
module.exports = config;
