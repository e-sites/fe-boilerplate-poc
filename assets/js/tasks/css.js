/**
 * Less compilation module for node.js
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
    less = require('less'),
    lessClean = new (require('less-plugin-clean-css'))({
        advanced: true,
        compatibility: 'ie8'
    }),
    lessConfig = {
        paths: [csspath],
        plugins: [lessClean]
    },
    notifier = require('node-notifier');

renderLess()

if ( arguments.watch ) {
    watcher = chokidar.watch(csspath + '**/*.less', {usePolling: true})

    watcher.on('ready', initWatch);
}

// Starts watching of less files
function initWatch() {
    console.log('watching less'.underline);

    // Render less initially

    // Render less on each change
    watcher.on('all', renderLess);
}

// Take new input and render it
function renderLess() {
    var lessfile = 'styles.less',
        cssfile = lessfile.replace('.less', '.css'),
        newLessInput = fs.readFileSync(csspath + lessfile, 'utf8'),
        config = Object.assign({
            sourceMap: {
                sourceMapURL: cssfile + '.map'
            }
        }, lessConfig);

    // Start rendering
    less.render(newLessInput, config)
        .then(
            // Success
            function (output) {
                // Write CSS
                fs.writeFile(csspath + cssfile, output.css, 'utf8', handleWrite);
                // Write sourcemap
                fs.writeFile(csspath + cssfile + '.map', output.map, 'utf8');
            },
            // Error
            handleError);
}

// Handle writing of file
function handleWrite(err) {
    if (err) {
        throw err;
    }

    console.log('compiled less'.green);

    notifier.notify({
        title: 'Less',
        message: 'Compiled less'
    });
}

// Handle compiling errors
function handleError(err) {
    var pathsegments = err.filename.split('/'),
        filename = pathsegments[pathsegments.length - 1];

    console.log('error compiling less'.underline.red);
    console.log((filename + ':' + err.line).red);
    console.log(err.message.red);

    notifier.notify({
        title: 'Less',
        subtitle: filename + ':' + err.line,
        message: 'Error: ' + err.message
    });
}