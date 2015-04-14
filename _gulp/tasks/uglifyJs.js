var gulp   = require('gulp'),
	config = require('../config').production,
	size   = require('gulp-filesize'),
	uglify = require('gulp-uglify');

gulp.task('uglifyJs', ['browserify', 'copyMain'], function() {
	return gulp.src(config.jsSrcMin)
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest(config.jsDest))
		.pipe(size());
});
