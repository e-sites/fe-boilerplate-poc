/**
 * Scss compilation module for node.js
 *
 * @author: Iain van der Wiel <iain@e-sites.nl>
 * @since: 26-01-2016
 */

var appRoot = require('app-root-path') + '/',
    chokidar = require('chokidar'),
    fs = require('fs'),
    colors = require('colors'),
    arguments = require('shell-arguments'),
    assetspaths = require(appRoot + 'package.json').assetspaths,
    csspath = appRoot + assetspaths.base + assetspaths.css,
    sass = require('node-sass'),
    scssConfig = {
        file: csspath + '/styles.scss',
        outputStyle: 'compressed',
        sourceMap: true,
        outFile: csspath + '/styles.map'
    },
    notifier = require('node-notifier');

renderScss();

if ( arguments.watch ) {
    watcher = chokidar.watch(csspath + '**/*.scss', {usePolling: true})

    watcher.on('ready', initWatch);
}

// Starts watching of scss files
function initWatch() {
    console.log('watching scss'.underline);

    // Render scss on each change
    watcher.on('all', renderScss);
}

// Take new input and render it
function renderScss() {
    // Start rendering
    sass.render(scssConfig, function (err, result) {
        if ( err ) handleError(err);

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
        throw err;
    }

    console.log(('compiled scss in ' + result.stats.duration/1000 + 's').green);

    notifier.notify({
        title: 'Sass',
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
        title: 'Sass',
        subtitle: errorPath,
        message: 'Error: ' + errorMsg
    });
}