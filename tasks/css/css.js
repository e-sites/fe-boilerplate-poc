/**
 * Compiles the main styles.scss file and creates a source-map
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const del = require('del');
const tasker = require('gulp-tasker');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const { handleError, handleSuccess } = require('../base/handlers');

const { paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const debug = process.env.NODE_ENV !== 'production';

const cleancss = (done) => {
  del([`${paths.dist.css}/*`]);
  del([`${paths.temp.css}/*`]);
  done();
};

const compilecss = () => gulp
  .src([`${paths.source.css}/styles.scss`])
  .pipe(handleError('sass', 'SASS compiling failed'))
  .pipe(gulpif(debug, sourcemaps.init()))
  .pipe(sass().on('error', sass.logError))
  .pipe(cleanCSS({
    level: debug ? 0 : 2,
  }))
  .pipe(autoprefixer())
  .pipe(gulpif(debug, sourcemaps.write('./')))
  .pipe(gulp.dest(paths.temp.css))
  .pipe(handleSuccess('sass', 'SASS compiling succeeded'));

const cssTask = gulp.series(cleancss, compilecss);

gulp.task('css', cssTask);

tasker.addTask('default', cssTask);
tasker.addTask('deploy', cssTask);
tasker.addTask('watch', cssTask, `${paths.source.css}/**/*.scss`);
