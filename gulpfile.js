// Gulp and some plugins that are used by multiple tasks
const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');

// Expose config
const { paths } = JSON.parse(fs.readFileSync('./package.json')).config;

// Load all tasks
tasker.loadTasks({
  path: paths.tasks,
});

// Default task when run with 'gulp deploy'
gulp.task('deploy', gulp.series(tasker.getTasks('deploy').tasks));

// Default task when run with 'gulp'
gulp.task('default', gulp.series(tasker.getTasks('default').tasks));

// Sync task when run with 'gulp sync'
gulp.task('sync', gulp.series(tasker.getTasks('sync').tasks));

// Watch task when run with 'gulp watch'
gulp.task(
  'watch',
  gulp.series('default', 'sync', () => {
    tasker.getTasks('watch').tasks.forEach((task) => {
      gulp.watch(task.folders, gulp.parallel(task.tasks));
    });
  })
);
