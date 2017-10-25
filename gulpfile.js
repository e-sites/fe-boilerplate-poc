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
gulp.task('deploy', gulp.series(gulp.parallel(tasker.getTasks('deploy').tasks), 'rev'));

// Default task when run with 'gulp'
gulp.task('default', gulp.series(gulp.parallel(tasker.getTasks('default').tasks), 'rev'));

// Watch task when run with 'gulp watch'
gulp.task('watch', gulp.series('default', () => {
  tasker
    .getTasks('watch')
    .tasks
    .forEach((task) => {
      // gulp.watch(task.folders, gulp.parallel(task.tasks));
      gulp.watch(task.folders, gulp.series(gulp.parallel(task.tasks), 'rev'));
    });
}));
