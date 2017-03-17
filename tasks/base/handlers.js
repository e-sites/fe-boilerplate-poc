const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

module.exports = {
	/**
	 * Default error handler for task specific errors
	 *
	 * @param  {String} taskName Name of the task you want to register the error handler for
	 * @param  {String} msg      Text of the message
	 */
	handleError: (taskName, msg) => plumber({
		errorHandler: notify.onError({
			title: taskName,
			message: `Error: ${msg}`
		})
	}),

	/**
	 * Default success notification handler for all tasks
	 *
	 * @param  {String} taskName Name of the task you want to register the success handler for
	 * @param  {String} msg      Text of the message
	 */
	handleSuccess: (taskName, msg) => notify({
		title: taskName,
		message: `Success: ${msg}`
	})
}
