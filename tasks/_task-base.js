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
        var chokidarDefaultOptions = {
            usePolling: true,
            ignored: /[\/\\]\./,
            atomic: true
        };
        var chokidarOptions = Object.assign(chokidarDefaultOptions, options.chokidarOptions);
        var colors = require('colors');
        var args = require('yargs').argv;
        var watchEvents = options.watchEvents || ['all'];

        if ( !options || typeof options.function === 'undefined' ) throw Error('define a task function, you dummy!');

        options.function();

        if ( args.watch ) {
            watcher = chokidar.watch(options.watchPath, chokidarOptions)

            watcher.on('ready', initWatch);
        }

        // Starts watching
        function initWatch() {
            console.log((options.name + ': watching ' + options.watchPath.replace(appRoot, '') + ' \uD83D\uDC40 ').underline);

            // Do something on change
            if ( options.watchEvents ) {
                var type = watchEvents.constructor.name;

                if ( type === 'String' ) {
                    watchEvents = ( watchEvents.indexOf(',') > -1 )? watchEvents.split(',') : [watchEvents];
                } else if ( type != 'Array' ) {
                    console.log('error creating watchers'.underline.red);
                    console.log('Can\'t create watcher(s) from ' + type + '.'.red);
                }

                watchEvents.forEach( function(event, index) {
                    watchEvents[index] = event.trim();
                } );
            }

            watchEvents.forEach( function(event) {
                watcher.on(event, options.function);
            } );

            console.log(`Events: ${watchEvents.join(', ')}`);
        }
    },
    notifier: notifier,
    appRoot: appRoot,
    assetspaths: require(appRoot + 'package.json').assetspaths
}