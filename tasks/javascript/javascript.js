/**
 * Concats/minifies all JS files as defined in config.json under the 'build' key
 */

var browserify = require('browserify');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var async = require('async');
var jsFiles = ['site.js'];
var debug = process.env.NODE_ENV !== 'production';

function js(allDone) {
	async.each(jsFiles, (file, jsDone) => {
		// set up the browserify instance on a task basis
		var b = browserify({
		  entries: conf.path.js + '/' + file,
		  debug: debug
		});

		b.transform('babelify', {presets: ['es2015', 'stage-3']})
			.bundle()
			.on('error', notify.onError(function (err) {
				jsDone(err);

				return {
					title: 'js',
					message: 'Error: ' + (err.annotated ? err.annotated : err.message ? err.message : err)
				}
			}))
			.pipe(source(file))
			.pipe(buffer())
			.pipe(gulpif(!debug, uglify()))
			.pipe(gulp.dest(conf.path.build + '/js'))
			.pipe(handleSuccess('js', 'JS build succeeded for ' + file, jsDone()));
	}, (err) => {
		if ( err ) console.error(err);

		allDone();
	});
}

var jsTask = gulp.parallel(js);

gulp.task('js', js);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [conf.path.js + '/**/*.js']);
