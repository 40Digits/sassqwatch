var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil  = require('gulp-util');

module.exports = function(gulp, config) {

  return function() {
    gutil.log('Uglifying', gutil.colors.green(config.buildDist.src), '...');

    return gulp.src(config.buildDist.src)
      .pipe(rename(function(path) {
        path.basename += '.min'
      }))
      .pipe(uglify())
      .on('end', function() {
        gutil.log('Done uglifying', gutil.colors.green(config.buildDist.src));
      })
      .pipe(gulp.dest(config.buildDist.dest));
  }
};