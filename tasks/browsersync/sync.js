const browserSync = require('browser-sync').create();
const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');

const { paths, sync } = JSON.parse(fs.readFileSync('./package.json')).config;
let hosts = null;

try {
  hosts = JSON.parse(fs.readFileSync('./ebox.json')).hosts;
} catch (e) {
  console.warn('Browsersync: No ebox.json present, using localhost instead of proxied host...');
}

// Initialise browser-sync
const serve = (done) => {
  const config = {
    startPath: sync.openPath,
    open: sync.open,
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center',
      ],
    },
  };

  if (hosts) {
    config.proxy = `https://${hosts[0]}`;
  } else {
    config.server = {
      baseDir: paths.webroot,
    };
  }

  browserSync.init(config);

  // Reload the browser hard!
  const reload = () => {
    browserSync.reload();
  };

  // Reload the browser with injected CSS
  const reloadCSS = () => {
    browserSync.reload('*.css');
  };

  const fileWatcher = gulp.watch(`${paths.dist}/**/*.{html,js,svg}`);
  fileWatcher.on('add', reload);
  fileWatcher.on('change', reload);

  const cssWatcher = gulp.watch(`${paths.dist}/**/style.css`);
  cssWatcher.on('add', reloadCSS);
  cssWatcher.on('change', reloadCSS);

  done();
};

tasker.addTask('sync', serve);
