/**
 * Compiles the main styles.scss file and creates a source-map
 */

function sass() {
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	var importCss = require('gulp-import-css');
	var gulpif = require('gulp-if');
	var uglifycss = require('gulp-uglifycss');
	var debug = process.env.NODE_ENV !== 'production';

	return gulp.src(conf.path.css + '/styles.scss')
		.pipe(handleError('sass', 'SASS compiling failed'))
		.pipe(sourcemaps.init())
		.pipe(
			sass({outputStyle: debug ? 'expanded' : 'compressed'})
				.on('error', (err) => {
					console.log(err.message);
				})
		)
		.pipe(importCss())
		.pipe(autoprefixer({
			browsers: ['last 3 versions', 'ios_saf 7']
		}))
		.pipe(gulpif(!debug, uglifycss({
			"maxLineLen": 120,
			"uglyComments": true
		})))
		.pipe(gulpif(debug, sourcemaps.write('./')))
		.pipe(gulp.dest(conf.path.build + '/css'))
		.pipe(handleSuccess('sass', 'SASS compiling succeeded'));
}

var sassTask = gulp.series(sass);

gulp.task('sass', sass);

tasker.addTask('default', sassTask);
tasker.addTask('deploy', sassTask);
tasker.addTask('watch', sassTask, conf.path.css + '/**/*.scss');