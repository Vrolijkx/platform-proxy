'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var src = ['./bin.js', './lib/**/*.js'];
var tests = ['./test/**/*.jsgu'];
var filesToWatch = src.concat(tests);

gulp.task('test', function () {
	return gulp.src('test/**/*.js')
		.pipe(jasmine({
			includeStackTrace : true,
			verbose: true
		}));
});

gulp.task('watch', ['test'], function () {
	gulp.watch(filesToWatch, ['test']);
});
