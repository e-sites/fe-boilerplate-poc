/**
 * Concats/minifies all JS files as defined in config.json under the 'build' key
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const del = require('del');
const tasker = require('gulp-tasker');
const webpack = require('webpack-stream');
const notify = require('gulp-notify');
const notifier = require('node-notifier'); // eslint-disable-line
const webpackConfig = require('../../webpack.config.js');

const { paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const clean = (done) => {
  del([`${paths.dist.js}/*`]);
  del([`${paths.temp.js}/*`]);
  done();
};

const js = (allDone) => {
  const stream = webpack(webpackConfig);

  return stream
    .on('error', notify.onError(error => error))
    .pipe(gulp.dest(paths.temp.js))
    .on('close', () => {
      notifier.notify({
        title: 'js',
        message: 'Files written to disk',
      });
      allDone();
    });
};

const jsTask = gulp.series(clean, js);

gulp.task('js', jsTask);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [`${paths.source.js}/**/*.js`]);
