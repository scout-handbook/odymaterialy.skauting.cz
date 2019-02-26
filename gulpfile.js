"use strict";

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var merge = require('merge-stream');
var rename = require("gulp-rename");

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!admin/**', '!API/**', '!frontend/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('install:admin', shell.task('npm install', {cwd: 'admin'}));

gulp.task('install:API', shell.task('composer install --no-dev --optimize-autoloader', {cwd: 'API'}));

gulp.task('install:frontend', shell.task('npm install', {cwd: 'frontend'}));

gulp.task('build:admin', gulp.series('install:admin', shell.task('gulp build --config ../src/client-config.json', {cwd: 'admin'})));

gulp.task('build:frontend', gulp.series('install:frontend', shell.task('gulp build --config ../src/client-config.json', {cwd: 'frontend'})));

gulp.task('copy:admin', gulp.series('build:admin', function() {
	return gulp.src('admin/dist/**')
		.pipe(gulp.dest('dist/admin/'));
}));

gulp.task('copy:API', gulp.series('install:API', function() {
	return merge(
		gulp.src('API/vendor/**/*')
			.pipe(gulp.dest('dist/API/vendor/')),
		gulp.src('API/v*.*/**/*', {dot: true})
			.pipe(gulp.dest('dist/API/'))
	);
}));

gulp.task('copy:frontend', gulp.series('build:frontend', function() {
	return gulp.src('frontend/dist/**')
		.pipe(gulp.dest('dist/'));
}));

gulp.task('copy:local', function() {
	return merge(
		gulp.src(['src/api-config.php', 'src/api-secrets.php', 'src/client-config.json', 'src/google8cbe14e41a3d2e27.html', 'src/pgp-key.asc', 'src/robots.txt'])
			.pipe(gulp.dest('dist/')),
		gulp.src(['src/assetlinks.json', 'src/security.txt'])
			.pipe(gulp.dest('dist/.well-known/')),
		gulp.src('src/admin-htaccess.txt')
			.pipe(rename('.htaccess'))
			.pipe(gulp.dest('dist/admin/')),
		gulp.src('src/frontend-htaccess.txt')
			.pipe(rename('.htaccess'))
			.pipe(gulp.dest('dist/'))
	);
});

gulp.task('lint', gulp.series('eslint'));

gulp.task('build', gulp.parallel('copy:admin', 'copy:API', 'copy:frontend', 'copy:local'));
