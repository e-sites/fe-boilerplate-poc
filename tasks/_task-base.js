/**
 * Task boilerplate
 *
 * @author: Iain van der Wiel <iain@e-sites.nl>
 * @since: 09-03-0216
 */

var notifier = require('node-notifier');
var appRoot = require('app-root-path') + '/';
var assetspaths = require(appRoot + 'package.json').assetspaths;

module.exports = {
    register: function (options) {
        var chokidar = require('chokidar');
        var colors = require('colors');
        var shellArgs = require('shell-arguments');

        if ( !options || typeof options.function === 'undefined' ) throw Error('define a task function, you dummy!');

        options.function();

        if ( shellArgs.watch ) {
            watcher = chokidar.watch(options.watchFile, {usePolling: true})

            watcher.on('ready', initWatch);
        }

        // Starts watching
        function initWatch() {
            console.log((options.name + ': watching ' + options.watchFile.replace(appRoot, '') + ' \uD83D\uDC40 ').underline);

            // Do something on change
            watcher.on('all', options.function);
        }
    },
    notifier: notifier,
    appRoot: appRoot,
    assetspaths: require(appRoot + 'package.json').assetspaths
}