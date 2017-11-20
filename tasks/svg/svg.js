/**
 * Does SVG stuff :)
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const rev = require('gulp-rev');
const tasker = require('gulp-tasker');
const gulpif = require('gulp-if');
const { handleError, handleSuccess } = require('../base/handlers');
const del = require('del');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const { revisionFiles, paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const folder = paths.folders.svg;

const cleansvg = (done) => {
  del([`${paths.dist + folder}/*`]);
  done();
};

const svgconcat = () => gulp
  .src(`${paths.source + folder}/*.svg`)
  .pipe(svgstore())
  .pipe(handleError('svgconcat', 'SVG concatenation failed'))
  .pipe(imagemin([
    imagemin.svgo({
      plugins: [
        {
          removeTitle: true,
        },
        {
          removeDesc: true,
        },
        {
          removeUselessDefs: false,
        },
        {
          cleanupIDs: false,
        },
      ],
    }),
  ]))
  .pipe(handleError('svgconcat', 'SVG concatenation failed'))
  .pipe(rename('dist.svg'))
  .pipe(gulpif(revisionFiles, rev()))
  .pipe(gulp.dest(paths.dist + folder))
  .pipe(gulpif(revisionFiles, rev.manifest({
    merge: true,
    path: 'manifest.json',
  })))
  .pipe(gulpif(revisionFiles, gulp.dest(paths.dist + folder)))
  .pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));

const svgTask = gulp.series(cleansvg, svgconcat);

gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTask, `${paths.source + folder}/*.svg`);
