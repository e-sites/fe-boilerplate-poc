/**
 * Scss compilation task
 *
 * @author: Iain van der Wiel <iain@e-sites.nl>
 * @since: 10-03-2016
 */

// Base task vars
var task = require('./_task-base.js');
var notifier = task.notifier;
var assetspaths = task.assetspaths;

// Task specific vars
var fs = require('fs');
var sass = require('node-sass');
var csspath = task.appRoot + assetspaths.base + assetspaths.css;
var scssConfig = {
    file: csspath + '/styles.scss',
    outputStyle: 'compressed',
    sourceMap: true,
    outFile: csspath + '/styles.map'
};

// Task configuration
var taskConfig = {
    name: 'Sass',
    function: renderScss,
    watchFile: csspath + '**/*.scss'
};

// Register task
task.register(taskConfig);

// Take new input and render it
function renderScss() {
    // Start rendering
    sass.render(scssConfig, function (err, result) {
        if ( err ) {
            return handleError(err);
        }

        // Write CSS
        fs.writeFile(csspath + 'styles.css', result.css, 'utf8', function () {
            handleWrite(err, result);
        });

        // Write sourcemap
        fs.writeFile(csspath + 'styles.css.map', result.map, 'utf8');
    });
}

// Handle writing of file
function handleWrite(err, result) {
    if (err) {
        console.log('Error writing'.red);
        console.log(err);
        return;
    }

    console.log(('compiled scss in ' + result.stats.duration/1000 + 's').green);

    notifier.notify({
        title: taskConfig.name,
        message: 'Compiled scss'
    });
}

// Handle compiling errors
function handleError(err) {
    var pathsegments = err.file.split('/'),
        filename = pathsegments[pathsegments.length - 1],
        errorPath = filename + '@' + err.line + ':' + err.column,
        errorMsg = err.message;

    console.log('error compiling scss'.underline.red);
    console.log(errorPath.red);
    console.log(errorMsg.red);

    notifier.notify({
        title: taskConfig.name,
        subtitle: errorPath,
        message: 'Error: ' + errorMsg
    });
}