const fs = require('fs');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const rev = require('gulp-rev');

// Expose config
const { revisionFiles, paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const revFiles = () => gulp.src(`${paths.temp}/**/*`)
  .pipe(gulpif(revisionFiles, rev()))
  .pipe(gulp.dest(paths.dist))
  .pipe(gulpif(revisionFiles, rev.manifest({
    path: 'manifest.json',
  })))
  .pipe(gulpif(revisionFiles, gulp.dest(paths.dist)));

gulp.task('rev', revFiles);

module.exports = revFiles;
