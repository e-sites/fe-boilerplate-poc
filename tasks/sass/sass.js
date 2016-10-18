/**
 * Compiles the main styles.scss file and creates a source-map
 *
 * @author   Wouter Buit <wouter@e-sites.nl>
 * @version  1.0
 */

gulp.task('sass', function () {
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');

	return gulp.src([conf.path.css + '/styles.scss'])
		.pipe(handleError('sass', 'SASS compiling failed'))
		.pipe(sourcemaps.init())
		.pipe(
			sass({outputStyle: 'compressed'})
				.on('error', (err) => { console.log(err.message); this.emit('end');})
		)
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ios_saf 8']
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(conf.path.css))
		.pipe(handleSuccess('sass', 'SASS compiling succeeded'));
});

tasker.addTask('default', 'sass');
tasker.addTask('deploy', 'sass');
tasker.addTask('watch', 'sass', conf.path.css + '/**/*.scss');