(function (global) {

	'use strict';

	// Expose config, Gulp and some plugins that are used by multiple tasks
	global.conf = {
		'path': {
			'css': './web/assets/css',
			'svg': './web/assets/svg',
			'js': './web/assets/js',
			'build': './web/build',
			'tasks': '/tasks/'
		}
	};
	global.gulp = require('gulp');
	global.plumber = require('gulp-plumber');
	global.sourcemaps = require('gulp-sourcemaps');
	global.tasker = require('gulp-tasker');
	global.fs = require('fs');
	global.notify = require('gulp-notify');

	// Load all tasks
	tasker.loadTasks({
		path: conf.path.tasks
	});

	/**
	 * Default error handler for task specific errors
	 *
	 * @param  {String} taskName Name of the task you want to register the error handler for
	 * @param  {String} msg      Text of the message
	 */
	global.handleError = function (taskName, msg) {
		return plumber({
			errorHandler: notify.onError({
				title: taskName,
				message: 'Error: ' + msg
			})
		});
	};

	/**
	 * Default success notification handler for all tasks
	 *
	 * @param  {String} taskName Name of the task you want to register the success handler for
	 * @param  {String} msg      Text of the message
	 */
	global.handleSuccess = function (taskName, msg) {
		return notify({
			title: taskName,
			message: 'Success: ' + msg
		});
	};

	// Default task when run with 'gulp'
	gulp.task('default', gulp.parallel(tasker.getTasks('default').tasks));

	// Default task when run with 'gulp deploy'
	gulp.task('deploy', gulp.parallel(tasker.getTasks('deploy').tasks));

	// Watch task when run with 'gulp watch'
	gulp.task('watch', function () {
		tasker.getTasks('watch').tasks.forEach(function(task) {
			gulp.watch(task.folders, gulp.parallel(task.tasks));
		});
	});
}(global));