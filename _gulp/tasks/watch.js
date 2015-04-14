var gulp       = require('gulp'),
	watch      = require('../util/watch'),
	config     = require('../config'),
	gulpStart  = require('../util/gulpstart'),
	livereload = require('gulp-livereload');

gulp.task('watch', function () {
	livereload({ start: true });
	watch({
		root: config.watch.src,
		match: [{
			when: 'js/**/*.+(js|ejs)',
			then: gulpStart('browserify')
		}]
	});
});