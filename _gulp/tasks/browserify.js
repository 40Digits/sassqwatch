/* browserify task
	 ---------------
	 Bundle javascripty things with browserify!

	 This task is set up to generate multiple separate bundles,
	 from different sources.

	 See browserify.bundleConfigs in gulp/config.js
*/

var gulp            = require('gulp');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var bundleLogger    = require('../util/bundleLogger');
var handleErrors    = require('../util/handleErrors');
var config          = require('../config').browserify;
var fs              = require('fs');
var livereload      = require('gulp-livereload');

var browserifyTask = function(callback, devMode) {

	var bundleQueue = config.bundleConfigs.length;

	var browserifyThis = function(bundleConfig) {

		var bundler = browserify({
			// Required args
			cache: {}, packageCache: {}, fullPaths: false,
			// Specify the basedir to resolve relative paths
			basedir: bundleConfig.basedir,
			// Specify the entry point of your app
			files: bundleConfig.outputFile,
			// Don't parse these libraries
			noParse: bundleConfig.noParse,
			// Add file extentions to make optional in your requires
			extensions: config.extensions,
			// Enable source maps!
			debug: config.debug
		})
			// Ignore these files in the bundle
			.ignore(bundleConfig.ignore)
			// Export the main module for use outside of the bundle
			.require(bundleConfig.sourceJS, {expose: bundleConfig.outputName});

		var bundle = function() {
			// Log when bundling starts
			bundleLogger.start(bundleConfig.outputFile);

			return bundler
				.bundle()
				// Report compile errors
				.on('error', handleErrors)
				// Use vinyl-source-stream to make the
				// stream gulp compatible. Specifiy the
				// desired output filename here.
				.pipe(source(bundleConfig.outputFile))
				// Specify the output destination
				.pipe(gulp.dest(bundleConfig.dest))
				.on('end', reportFinished)
				.pipe(livereload());
		};

		var reportFinished = function() {
			// Log when bundling completes
			bundleLogger.end(bundleConfig.outputFile)

			if(bundleQueue) {
				bundleQueue--;
				if(bundleQueue === 0) {
					// If queue is empty, tell gulp the task is complete.
					// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
					callback();
				}
			}
		};

		return bundle();
	};

	// Start bundling with Browserify for each bundleConfig specified
	config.bundleConfigs.forEach(browserifyThis);
};

gulp.task('browserify', browserifyTask);

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask