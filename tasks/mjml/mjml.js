/**
 * Build MJML template
 *
 * @author   John van Hulsen <john@e-sites.nl>
 * @version  0.1.0
 */

const gulp = require('gulp');
const tasker = require('gulp-tasker');
const conf = require('../base/conf');
const {handleError, handleSuccess} = require('../base/handlers');
const rename = require('gulp-rename');
const mjml = require('gulp-mjml');

const mjmlconvert = () => {
	return gulp
		.src(conf.path.mjml + '/**/*.mjml')
		.pipe(handleError('mjmlconvert', 'MJML generation faild'))
		.pipe(mjml())
		.pipe(rename(function (file) {
			file.extname += conf.mjml.extension.length > 0 ? conf.mjml.extension : '';
		}))
		.pipe(gulp.dest(function (file) {
			return file.base;
		}))
		.pipe(handleSuccess('mjmlconvert', 'MJML generation succeeded'));
}

const mjmlTask = gulp.series(mjmlconvert);

if ( conf.mjml.enabled ) {
	gulp.task('mjml', mjmlTask);

	tasker.addTask('default', mjmlTask);
	tasker.addTask('deploy', mjmlTask);
	tasker.addTask('watch', mjmlTask, conf.path.mjml + '/**/*.mjml');
}