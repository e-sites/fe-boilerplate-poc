/**
 * JS concat + minify task
 *
 * @author: Iain van der Wiel <iain@e-sites.nl>
 * @since: 12-05-2016
 */

'use strict';

// Base task vars
var task = require('./_task-base.js');
var notifier = task.notifier;
var assetspaths = task.assetspaths;

// Task specific vars
var fs = require('fs');
var del = require('del');
var uglify = require('uglify-js');
var jspath = assetspaths.base + assetspaths.js;
var jsbuildpath = jspath + 'build/';

// Task configuration
var taskConfig = {
    name: 'JS',
    function: processJS,
    watchFile: jspath + '**/*.js',
    ignorePath: jsbuildpath
};
var jsGroups = {
    main: [
        jspath + 'vendor/script.js',
        jspath + 'misc/functions.js',
        jspath + 'vendor/jsend-1.2.js',
        jspath + 'vendor/vestigo.js',
        jspath + 'vendor/jquery/plugins.js',
        // jspath + 'vendor/jquery/jquery.placeholder-2.0.8.js',
        jspath + 'vendor/parsley.config.js',
        jspath + 'vendor/parsley.js',
        // jspath + 'templates/templates.js',
        jspath + 'misc/events.js'
    ]
};

// Register task
task.register(taskConfig);

// Process all js build groups
function processJS(e, path) {
    Object.keys(jsGroups).forEach(function (group) {
        // Create promise for each group
        var processPromise = new Promise(minifyGroup.bind(group));

        processPromise
            .then(writeGroup)
            .catch(handleError);
    });
}

// Minify input
function minifyGroup(resolve, reject) {
    var group = this;

    try {
        // Process files
        var filename = `${group}.min.js`;
        var result = uglify.minify(jsGroups[group], {
            outSourceMap: `${filename}.map`,
            sourceRoot: '/'
        });

        result.filename = filename;

        resolve(result);
    } catch (e) {
        // Error processing files
        reject(e);
    }
}

// Clean build dir and write minified input
function writeGroup(result) {
    del(jsbuildpath + '*')
        .then(function () {
            fs.writeFileSync(`${jsbuildpath + result.filename}`, result.code);
            fs.writeFileSync(`${jsbuildpath + result.filename}.map`, result.map);

            handleSuccess(result);
        });
}

// Handle compiling errors
function handleError(err) {
    var err = normalizeError(err);

    console.log('Error building JS'.underline.red);
    console.log(err.filename.red);
    console.log(err.message.red);

    notifier.notify({
        title: taskConfig.name,
        subtitle: err.filename,
        message: 'Error: ' + err.message
    });
}

// Normalizes file read and uglify error messages into one error object
function normalizeError(err) {
    var error = {};

    error.path = (err.path || err.filename).replace(task.appRoot, '');
    error.filename = error.path.split('/').slice(-1) + (err.line ? `@${err.line}:${err.col}` : '');
    error.message = err.code === 'ENOENT' ? `Missing file ${error.filename}` : err.message;

    return error;
}

// Show success message + notification
function handleSuccess(result) {
    console.log(`Compiled JS: ${result.filename}`.green);

    notifier.notify({
        title: taskConfig.name,
        message: `Compiled JS: ${result.filename}`
    });
}