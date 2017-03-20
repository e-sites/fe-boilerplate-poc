/**
 * Concats/minifies all JS files as defined in config.json under the 'build' key
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const gulp = require('gulp');
const del = require('del');
const tasker = require('gulp-tasker');
const conf = require('../base/conf');
const {handleError, handleSuccess} = require('../base/handlers');
const gulpif = require('gulp-if');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const async = require('async');
const rev = require('gulp-rev');
const notify = require('gulp-notify');

const jsFiles = ['app.js'];
const jsPath = conf.path.build + '/js';
const debug = process.env.NODE_ENV !== 'production';


const cleanjs = (done) => {
	del([jsPath + '/*']);

	done();
}

const js = (allDone) => {
	async.each(jsFiles, (file, jsDone) => {
		// set up the browserify instance on a task basis
		const b = browserify({
			entries: conf.path.js + '/' + file,
			debug: debug
		});

		// See .babelrc for config
		b.transform('babelify')
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
			.pipe(gulpif(!debug, uglify()))
			// Normal output
			.pipe(gulp.dest(jsPath))

			// Revisioned output
			.pipe(rev())
			.pipe(gulp.dest(jsPath))

			// Manifest for revisions
			.pipe(rev.manifest())
			.pipe(gulp.dest(jsPath))
			.pipe(handleSuccess('js', 'JS build succeeded for ' + file, jsDone()));
	}, (err) => {
		if (err)
			console.error(err);

		allDone();
	});
}

const jsTask = gulp.series(cleanjs, js);

gulp.task('js', jsTask);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [conf.path.js + '/**/*.js']);
