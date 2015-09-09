var gulp = require('gulp');
var eta = require('gulp-eta');
var config = require('./_gulp/config.js');
var apiMarkup = require('./_gulp/tasks/api-markup.js');
var concat = require('./_gulp/tasks/concat.js');
var buildDist = require('./_gulp/tasks/build-dist.js');
var watch = require('./_gulp/tasks/watch.js');

eta(gulp, config.eta);

gulp.task('concat', concat(gulp, config));
gulp.task('build-dist', ['concat'], buildDist(gulp, config));
gulp.task('build-watch', watch(gulp, config));
gulp.task('api-markup', apiMarkup(gulp, config));
gulp.task('default', ['build-dist', 'build-watch']);