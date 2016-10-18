/**
 * Does SVG stuff :)
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

gulp.task('clean:svg', function () {
	var del = require('del');

	del([
		conf.path.build + '/svg/*'
	]);
});

gulp.task('svgconcat', ['clean:svg'], function () {
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
});

gulp.task('svg2png', ['clean:svg'], function () {
	var rename = require('gulp-rename'),
		svg2png = require('gulp-svg2png');

	return gulp.src(conf.path.svg + '/*.svg')
			.pipe(handleError('svg2png', 'SVG to PNG conversion failed'))
			.pipe(svg2png())
			.on('error', function(err){ console.log(err.message); this.emit('end');})
			.pipe(rename(function (path) {
				path.basename = 'dist.svg.' + path.basename;
			}))
			.on('error', function(err){ console.log(err.message); this.emit('end');})
			.pipe(gulp.dest(conf.path.build + '/svg/'))
			.pipe(handleSuccess('svg2png', 'SVG to PNG conversion succeeded'));
});

gulp.task('svg', ['clean:svg', 'svgconcat', 'svg2png']);

tasker.addTask('default', 'svg');
tasker.addTask('deploy', 'svg');
tasker.addTask('watch', 'svg', conf.path.svg + '/*.svg');