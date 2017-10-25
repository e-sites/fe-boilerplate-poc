/**
 * Does SVG stuff :)
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');
const { handleError, handleSuccess } = require('../base/handlers');
const del = require('del');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const rev = require('../rev/rev');

const { paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const folder = paths.folders.svg;

const cleansvg = (done) => {
  del([`${paths.dist + folder}/*`]);
  del([`${paths.temp + folder}/*`]);
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
  .pipe(gulp.dest(paths.temp + folder))
  .pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));

const svgTask = gulp.series(cleansvg, svgconcat);

gulp.task('svg', gulp.series(svgconcat, rev));

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTask, `${paths.source + folder}/*.svg`);
