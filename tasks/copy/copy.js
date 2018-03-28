/**
 * Copies/optmizes images to frontend dir
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  0.1.0
 */

const gulp = require('gulp');
const fs = require('fs');
const tasker = require('gulp-tasker');
const { handleSuccess } = require('../base/handlers');

const { paths, copyAssets } = JSON.parse(fs.readFileSync('./package.json')).config;

const copySVGS = () =>
  gulp
    .src(`${paths.source + paths.folders.svg}/**/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.svg}`))
    .pipe(handleSuccess('copySVGS', 'SVG copying succeeded'));

const copyImages = () =>
  gulp
    .src(`${paths.source + paths.folders.images}/**/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.images}`))
    .pipe(handleSuccess('copyImages', 'Image copying succeeded'));

const copyFonts = () =>
  gulp
    .src(`${paths.source + paths.folders.fonts}/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.fonts}`))
    .pipe(handleSuccess('copyFonts', 'Font copying succeeded'));

const copyTask = gulp.parallel(copyImages, copyFonts, copySVGS);

if (copyAssets) {
  gulp.task('copy', copyTask);

  tasker.addTask('default', copyTask);
  tasker.addTask('watch', copyImages, `${paths.source + paths.folders.images}/**/*`);
  tasker.addTask('watch', copyFonts, `${paths.source + paths.folders.fonts}/**/*`);
  tasker.addTask('watch', copySVGS, `${paths.source + paths.folders.svg}/**/*`);
}
