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
const gulpif = require('gulp-if');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const async = require('async');
const rev = require('gulp-rev');
const notify = require('gulp-notify');
const { handleSuccess } = require('../base/handlers');

const { paths, revisionFiles } = JSON.parse(fs.readFileSync('./package.json')).config;
const jsFiles = ['app.js'];
const debug = process.env.NODE_ENV !== 'production';

const cleanjs = (done) => {
  del([`${paths.dist.js}/*`]);
  done();
};

const js = (allDone) => {
  async.each(
    jsFiles,
    (file, jsDone) => {
      // set up the browserify instance on a task basis
      const b = browserify({
        entries: `${paths.source.js}/${file}`,
        debug,
      });

      const compilejs = b
        .transform('babelify')
        .bundle()
        .on(
          'error',
          notify.onError((err) => {
            const message = err.message ? err.message : err;
            return {
              title: 'js',
              message: `Error: ${(err.annotated ? err.annotated : message)}`,
            };
          })
        )
        .pipe(source(file))
        .pipe(buffer())
        .pipe(gulpif(!debug, uglify()));

      // Writing revision in new file?
      if (revisionFiles) {
        compilejs
          .pipe(rev())
          .pipe(gulp.dest(paths.dist.js))
          .pipe(rev.manifest())
          .pipe(gulp.dest(paths.dist.js));
      } else {
        compilejs.pipe(gulp.dest(paths.dist.js));
      }

      // Add success message :)
      compilejs.pipe(handleSuccess('js', `JS build succeeded for ${file}`, jsDone()));

      return compilejs;
    },
    (err) => {
      if (err) console.error(err);
      allDone();
    }
  );
};

const jsTask = gulp.series(cleanjs, js);

gulp.task('js', jsTask);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [`${paths.source.js}/**/*.js`]);
