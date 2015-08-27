var gulp = require('gulp');
var config = require('./_gulp/config.js');
var concat = require('./_gulp/tasks/concat');
var buildDist = require('./_gulp/tasks/build-dist');
var watch = require('./_gulp/tasks/watch');

gulp.task('concat', concat(gulp, config));
gulp.task('build-dist', ['concat'], buildDist(gulp, config));
gulp.task('watch', watch(gulp, config));
gulp.task('default', ['build-dist', 'watch']);