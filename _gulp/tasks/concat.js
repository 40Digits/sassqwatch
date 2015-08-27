var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var bundleLogger    = require('../util/bundleLogger');
var handleErrors    = require('../util/handleErrors');

module.exports = function(gulp, config) {
  var reportFinished;

  config = config.concat;

  reportFinished = function() {
    bundleLogger.end(config.filename);
  }

  return function() {
    var bundle = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      extensions: false,
      debug: false,
      basedir: config.basedir,
      entries: config.entry,
    });

    // expose the name of the package for external use
    bundle.require(config.entry, { expose: config.alias });
    bundleLogger.start(config.filename);

    return bundle.bundle()
      .on('error', handleErrors)
      .pipe(source(config.entry))
      .pipe(buffer())
      .on('end', reportFinished)
      .pipe(gulp.dest(config.dest));
  }
};