/**
 * Does SVG stuff :)
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const gulp = require('gulp');
const tasker = require('gulp-tasker');
const conf = require('../base/conf');
const {handleError, handleSuccess} = require('../base/handlers');
const del = require('del');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const clean = (done) => {
	del([conf.path.build + '/svg/*']);

	done();
}

const svgconcat = () => {
	return gulp
		.src(conf.path.svg + '/*.svg')
		.pipe(handleError('svgconcat', 'SVG concatenation failed'))
		.pipe(svgstore())
		.pipe(imagemin([imagemin.svgo({
				plugins: [
					{
						removeTitle: true
					}, {
						removeDesc: true
					}, {
						removeUselessDefs: false
					}, {
						cleanupIDs: false
					}
				]
			})]))
		.pipe(rename('dist.svg'))
		.pipe(gulp.dest(conf.path.build + '/svg/'))
		.pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));
}

const svgTask = gulp.series(clean, svgconcat);

gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTask, conf.path.svg + '/*.svg');
