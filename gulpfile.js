var gulp = require( 'gulp' );
var shell = require( 'gulp-shell' );
var eslint = require('gulp-eslint');

gulp.task( 'eslint', function() {
	return gulp.src([ '**/*.js' ])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
} );

gulp.task( 'npm-check-updates', shell.task([ 'npm outdated' ], {ignoreErrors: true}) );
