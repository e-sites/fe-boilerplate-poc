/**
 * Concats/minifies all JS files as defined in config.json under the 'build' key
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const del = require('del');
const tasker = require('gulp-tasker');
const {handleError, handleSuccess} = require('../base/handlers');
const gulpif = require('gulp-if');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const async = require('async');
const rev = require('gulp-rev');
const notify = require('gulp-notify');

const config = JSON.parse(fs.readFileSync('./package.json')).config;
const jsFiles = ['app.js'];
const debug = process.env.NODE_ENV !== 'production';

const cleanjs = (done) => {
	del([config.paths.dist.js + '/*']);
	done();
};

const js = (allDone) => {
	async.each(jsFiles, (file, jsDone) => {
		// set up the browserify instance on a task basis
		const b = browserify({
			entries: config.paths.source.js + '/' + file,
			debug: debug
		});

		let compilejs = b.transform('babelify')
			.bundle()
			.on('error', notify.onError(function(err) {
				return {
					title: 'js',
					message: 'Error: ' + (err.annotated
						? err.annotated
						: err.message
							? err.message
							: err)
				}
			}))
			.pipe(source(file))
			.pipe(buffer())
			.pipe(gulpif(!debug, uglify()));

		// Writing revision in new file?
		if ( config.revisionFiles ) {
			compilejs
				.pipe(rev())
				.pipe(gulp.dest(config.paths.dist.js))

				.pipe(rev.manifest())
				.pipe(gulp.dest(config.paths.dist.js));
		} else {
			compilejs
				.pipe(gulp.dest(config.paths.dist.js));
		}

		// Add success message :)
		compilejs.pipe(handleSuccess('js', 'JS build succeeded for ' + file, jsDone()));

		return compilejs;

	}, (err) => {
		if (err)
			console.error(err);

		allDone();
	});
};

const jsTask = gulp.series(cleanjs, js);

gulp.task('js', jsTask);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [config.paths.source.js + '/**/*.js']);
