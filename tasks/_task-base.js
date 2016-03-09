/**
 * Task boilerplate
 *
 * @author: Iain van der Wiel <iain@e-sites.nl>
 * @since: 09-03-0216
 */

var appRoot = require('app-root-path') + '/',
    chokidar = require('chokidar'),
    fs = require('fs'),
    colors = require('colors'),
    shellArgs = require('shell-arguments'),
    assetspaths = require(appRoot + 'package.json').assetspaths,
    notifier = require('node-notifier');

doSomething();

if ( shellArgs.watch ) {
    watcher = chokidar.watch('##FILETOWATCH##', {usePolling: true})

    watcher.on('ready', initWatch);
}

// Starts watching
function initWatch() {
    console.log('watching ##SOMETHING##'.underline);

    // Do something on change
    watcher.on('all', doSomething);
}

// Start doing something
function doSomething() {
    // If successful
    success({
        message: 'DID SOMETHING! YAY!'
    });

    // Or less sucessful
    error({
        message: 'DID SOMETHING WRONG! NOES!'
    });
}

// Handle successful outcome of doing something
function success(result) {
    console.log(result.message.green);

    notifier.notify({
        title: '##TASKNAME##',
        message: result.message
    });
}

// Handle errors
function error(err) {
    console.log(err.message.red);

    notifier.notify({
        title: '##TASKNAME##',
        subtitle: '##PATH OF ERROR FILE##',
        message: 'Error: ' + err.message
    });
}