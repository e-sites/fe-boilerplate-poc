/**
 * Image optimization task
 *
 * @author: Tom Schalken <tom@e-sites.nl>
 * @since:  12-05-2016
 */

// Base task vars
const task = require('./_task-base.js');
const notifier = task.notifier;
const assetspaths = task.assetspaths;

// Task specific vars
const optimizer = require('optimage');
const path = task.appRoot + assetspaths.base + assetspaths.images;

// Task configuration
const taskConfig = {
    name: 'Image optimization',
    function: imgOptimize,
    watchPath: path + '**/*.{jpg|jpeg|png}',
    watchEvents: 'change, add',
    chokidarOptions: {
        atomic: 2000,
        awaitWriteFinish: true
    }
};

// Register task
task.register(taskConfig);

// Optimize added or changed images
function imgOptimize(filePath) {
    optimizer({
        inputFile: filePath,
        outputFile: filePath
        }, function(err, res){
            if ( err ) {
                console.log(('Error optimizing ' + filePath.replace(path, '')).red);
            } else {
                console.log(('Optimized ' + filePath.replace(path, '')).green);
            }
    });
}