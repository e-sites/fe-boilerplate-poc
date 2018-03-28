/**
 * Compiles the main styles.scss file and creates a source-map
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  1.0
 */

const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');
const { exec } = require('child_process');

const { paths, patternlib } = JSON.parse(fs.readFileSync('./package.json')).config;

const patternlib = (done) => {
  exec('php core/console --generate', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done();
  });
});

// tasker.addTask('default', patternlib');
// tasker.addTask('deploy', patternlib');
if ( patternlib ) {
  tasker.addTask('watch', patternlib', `${paths.patterns}/**/*`);
}
