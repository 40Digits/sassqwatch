var gulp = require('gulp'),
  fs = require('fs'),
  prodConfig = require('../config').production;

var copyFile = function() {
  fs
    .createReadStream(prodConfig.jsSrc)
    .pipe(fs.createWriteStream(prodConfig.jsSrcMin));

  return;
};

gulp.task('copyMain', ['browserify'], copyFile);