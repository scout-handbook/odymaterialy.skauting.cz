var gulp = require( 'gulp' );
var shell = require( 'gulp-shell' );

gulp.task( 'npm-check-updates', shell.task([ 'npm outdated' ], {ignoreErrors: true}) );
