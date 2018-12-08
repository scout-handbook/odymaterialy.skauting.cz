var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('eslint', function() {
	return gulp.src(['**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
} );

gulp.task('npm-check-updates', shell.task(['npm outdated'], {ignoreErrors: true}) );

gulp.task('uglify', function() {
	return gulp.src(['serviceworker.js'])
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.extname = '.min' + path.extname;
		}))
		.pipe(gulp.dest('dist/'));
});
