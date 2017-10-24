/**
 * Build MJML template
 *
 * @author   John van Hulsen <john@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');
const {handleError, handleSuccess} = require('../base/handlers');
const rename = require('gulp-rename');
const parsemjml = require('gulp-mjml');

const { paths, mjml } = JSON.parse(fs.readFileSync('./package.json')).config;

const mjmlconvert = () => {
	return gulp
		.src(paths.source.mjml + '/**/*.mjml')
		.pipe(handleError('mjmlconvert', 'MJML generation failed'))
		.pipe(parsemjml())
		.pipe(rename(function (file) {
			file.extname += mjml.extension.length > 0 ? mjml.extension : '';
		}))
		.pipe(gulp.dest(function (file) {
			return file.base;
		}))
		.pipe(handleSuccess('mjmlconvert', 'MJML generation succeeded'));
}

const mjmlTask = gulp.series(mjmlconvert);

if ( mjml.enabled ) {
	gulp.task('mjml', mjmlTask);

	tasker.addTask('default', mjmlTask);
	tasker.addTask('deploy', mjmlTask);
	tasker.addTask('watch', mjmlTask, paths.source.mjml + '/**/*.mjml');
}
