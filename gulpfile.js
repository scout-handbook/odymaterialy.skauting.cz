"use strict";

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var merge = require('merge-stream');
var inject = require('gulp-inject-string');

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!admin/**', '!API/**', '!frontend/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('install:admin', shell.task('npm install', {cwd: 'admin'}));

gulp.task('install:API', shell.task('composer install --ignore-platform-reqs', {cwd: 'API'})); // TODO

gulp.task('install:frontend', shell.task('npm install', {cwd: 'frontend'}));

gulp.task('build:admin', gulp.series('install:admin', shell.task('gulp build', {cwd: 'admin'})));

gulp.task('build:frontend', gulp.series('install:frontend', shell.task('gulp build', {cwd: 'frontend'})));

gulp.task('copy:admin', gulp.series('build:admin', function() {
	return gulp.src('admin/dist/**')
		.pipe(gulp.dest('dist/admin/'));
}));

gulp.task('copy:API', gulp.series('install:API', function() {
	return gulp.src(['API/vendor', 'API/v*.*']) // TODO
		.pipe(gulp.dest('dist/API/'));
}));

gulp.task('copy:frontend', gulp.series('build:frontend', function() {
	return gulp.src('frontend/dist/**')
		.pipe(gulp.dest('dist/'));
}));

gulp.task('copy:local', function() {
	return gulp.src('src/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.parallel('copy:admin', 'copy:API', 'copy:frontend', 'copy:local'));
