/**
 * Build MJML template
 *
 * @author   John van Hulsen <john@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');
const { handleError, handleSuccess } = require('../base/handlers');
const rename = require('gulp-rename');
const parsemjml = require('gulp-mjml');

const { paths, mjml } = JSON.parse(fs.readFileSync('./package.json')).config;

const folder = paths.folders.mjml;

const mjmlconvert = () => gulp
  .src(`${paths.source + folder}/**/*.mjml`)
  .pipe(handleError('mjmlconvert', 'MJML generation failed'))
  .pipe(parsemjml())
  .pipe(rename((file) => {
    file.extname += mjml.extension.length > 0 ? mjml.extension : '';
  }))
  .pipe(gulp.dest(file => file.base))
  .pipe(handleSuccess('mjmlconvert', 'MJML generation succeeded'));


const mjmlTask = gulp.series(mjmlconvert);

if (mjml.enabled) {
  gulp.task('mjml', mjmlTask);

  tasker.addTask('default', mjmlTask);
  tasker.addTask('deploy', mjmlTask);
  tasker.addTask('watch', mjmlTask, `${paths.source.mjml}/**/*.mjml`);
}
