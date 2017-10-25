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

const { paths } = JSON.parse(fs.readFileSync('./package.json')).config;

const cleansvg = (done) => {
  del([`${paths.dist.svg}/*`]);
  del([`${paths.temp.svg}/*`]);
  done();
};

const svgconcat = () => gulp
  .src(`${paths.source.svg}/*.svg`)
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
  .pipe(gulp.dest(paths.temp.svg))
  .pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));

const svgTask = gulp.series(cleansvg, svgconcat);

gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTask, `${paths.source.svg}/*.svg`);
