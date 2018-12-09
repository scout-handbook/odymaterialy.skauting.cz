var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var rename = require('gulp-rename');
var stylelint = require('gulp-stylelint');
var merge = require('merge-stream');

var minify = composer(uglify, console);

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!API/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('stylelint', function() {
	return gulp.src(['**/*.css', '!node_modules/**', '!API/**'])
		.pipe(stylelint({
			failAfterError: true,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('npm-check-updates', shell.task(['npm outdated'], {ignoreErrors: true}));

gulp.task('uglify', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(minify({ie8: true}))
			.pipe(rename(name + '.min.js'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(bundle('serviceworker', ['src/serviceworker.js']));
});
