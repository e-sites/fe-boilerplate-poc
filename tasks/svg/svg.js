/**
 * Does SVG stuff :)
 */

function cleansvg(done) {
	var del = require('del');

	del([
		conf.path.build + '/svg/*'
	]);

	done();
}

function svgconcat() {
	var svgstore = require('gulp-svgstore');
	var imagemin = require('gulp-imagemin');
	var rename = require('gulp-rename');

	return gulp.src(conf.path.svg + '/*.svg')
			.pipe(handleError('svgconcat', 'SVG concatenation failed'))
			.pipe(svgstore())
			.pipe(imagemin([
				imagemin.svgo({
					plugins: [{
						removeTitle: true
					},
					{
						removeDesc: true
					},
					{
						removeUselessDefs: false
					},
					{
						cleanupIDs: false
					}]
				})
			]))
			.pipe(rename('dist.svg'))
			.pipe(gulp.dest(conf.path.build + '/svg/'))
			.pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));
}

var svgconcatTask = gulp.series(cleansvg, svgconcat);
var svgTask = gulp.series(cleansvg, gulp.parallel(svgconcat));

gulp.task('svgconcat', svgconcatTask);
gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTask, conf.path.svg + '/*.svg');