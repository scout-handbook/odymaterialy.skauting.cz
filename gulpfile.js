"use strict";
/* eslint-env node */

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');

var pkg = require('./package.json');

var minify = composer(uglify, console);

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!API/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('npm-check-updates', shell.task(['npm outdated'], {ignoreErrors: true}));

gulp.task('build:html', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.html'))
			//.pipe(gulp.dest('dist/'));
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('frontend', [
			'src/frontend/html/index.html'
		]),
		bundle('admin', [
			'src/admin/html/index.html'
		])
	);
});

gulp.task('build:js', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.js'))
			.pipe(inject.replace('\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/', '"' + pkg.version + '"'))
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('serviceworker', [
			'src/frontend/js/serviceworker.js'
		]),
		bundle('frontend-pushed', [
			'src/frontend/js/tools/cacheThenNetworkRequest.js',
			'src/frontend/js/tools/request.js',
			'src/frontend/js/UI/header.js',
			'src/frontend/js/UI/navigation.js',
			'src/frontend/js/UI/TOC.js',
			'src/frontend/js/views/lesson.js',
			'src/frontend/js/AfterLoadEvent.js',
			'src/frontend/js/authentication.js',
			'src/frontend/js/config.js',
			'src/frontend/js/history.js',
			'src/frontend/js/main.js',
			'src/frontend/js/metadata.js'
		]),
		bundle('frontend', [
			'src/frontend/js/tools/urlEscape.js',
			'src/frontend/js/UI/lessonView.js',
			'src/frontend/js/views/competence.js',
			'src/frontend/js/views/competenceList.js',
			'src/frontend/js/views/field.js',
			'src/frontend/js/views/lessonList.js',
			'src/frontend/js/getLessonById.js',
			'src/frontend/js/OdyMarkdown.js',
			'src/frontend/js/xssOptions.js'
		]),
		bundle('admin-pushed', [
			'src/admin/js/lessonEditor/refreshPreview.js',
			'src/admin/js/tools/ActionQueue.js',
			'src/admin/js/tools/refreshLogin.js',
			'src/admin/js/tools/request.js',
			'src/admin/js/views/main.js',
			'src/admin/js/AfterLoadEvent.js',
			'src/admin/js/config.js',
			'src/admin/js/history.js',
			'src/admin/js/main.js',
			'src/admin/js/metadata.js'
		]),
		bundle('admin-worker', [
			'src/admin/js/lessonEditor/previewWorker.js',
		]),
		bundle('admin-worker-deps', [
			'src/admin/js/OdyMarkdown.js',
			'src/admin/js/xssOptions.js'
		]),
		bundle('admin', [
			'src/admin/js/actions/addCompetence.js',
			'src/admin/js/actions/addField.js',
			'src/admin/js/actions/addGroup.js',
			'src/admin/js/actions/addImage.js',
			'src/admin/js/actions/changeCompetence.js',
			'src/admin/js/actions/changeField.js',
			'src/admin/js/actions/changeGroup.js',
			'src/admin/js/actions/changeLessonCompetences.js',
			'src/admin/js/actions/changeLessonField.js',
			'src/admin/js/actions/changeLessonGroups.js',
			'src/admin/js/actions/changeUserGroups.js',
			'src/admin/js/actions/changeUserRole.js',
			'src/admin/js/actions/deleteCompetence.js',
			'src/admin/js/actions/deleteField.js',
			'src/admin/js/actions/deleteGroup.js',
			'src/admin/js/actions/deleteImage.js',
			'src/admin/js/actions/deleteLesson.js',
			'src/admin/js/actions/importGroup.js',
			'src/admin/js/actions/restoreLesson.js',
			'src/admin/js/lessonEditor/defaultContent.js',
			'src/admin/js/lessonEditor/editor.js',
			'src/admin/js/lessonEditor/history.js',
			'src/admin/js/lessonEditor/imageSelector.js',
			'src/admin/js/lessonEditor/settings.js',
			'src/admin/js/tools/addOnClicks.js',
			'src/admin/js/tools/parseBoolForm.js',
			'src/admin/js/tools/parseVersion.js',
			'src/admin/js/UI/button.js',
			'src/admin/js/UI/dialog.js',
			'src/admin/js/UI/pagination.js',
			'src/admin/js/UI/sidePanel.js',
			'src/admin/js/UI/spinner.js',
			'src/admin/js/views/mainSubviews/competence.js',
			'src/admin/js/views/mainSubviews/group.js',
			'src/admin/js/views/mainSubviews/image.js',
			'src/admin/js/views/mainSubviews/lesson.js',
			'src/admin/js/views/mainSubviews/user.js',
			'src/admin/js/views/addLesson.js',
			'src/admin/js/views/editLesson.js',
			'src/admin/js/views/restoreLesson.js',
			'src/admin/js/getLessonById.js'
		])
	);
});

gulp.task('build:css', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.css'))
			.pipe(postcss([autoprefixer()]))
			//.pipe(gulp.dest('dist/'));
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('frontend-pushed', [
			'src/frontend/css/fontello.css',
			'src/frontend/css/lesson.css',
			'src/frontend/css/main.css',
			'src/frontend/css/mainPage.css',
			'src/frontend/css/nav.css',
			'src/frontend/css/topUI.css'
		]),
		bundle('frontend-computer', [
			'src/frontend/css/computer.css'
		]),
		bundle('frontend-handheld', [
			'src/frontend/css/handheld.css'
		]),
		bundle('frontend', [
			'src/frontend/css/competenceBubble.css',
			'src/frontend/css/offlineSwitch.css'
		]),
		bundle('admin-pushed', [
			'src/admin/css/button.css',
			'src/admin/css/dialog.css',
			'src/admin/css/fontello.css',
			'src/admin/css/lesson.css',
			'src/admin/css/main.css',
			'src/admin/css/mainPage.css',
			'src/admin/css/mainView.css',
			'src/admin/css/sidePanel.css'
		]),
		bundle('admin', [
			'src/admin/css/competenceSubview.css',
			'src/admin/css/editor.css',
			'src/admin/css/fieldSubview.css',
			'src/admin/css/form.css',
			'src/admin/css/groupSubview.css',
			'src/admin/css/imageSubview.css',
			'src/admin/css/lessonSubview.css',
			'src/admin/css/pagination.css',
			'src/admin/css/userSubview.css'
		])
	);
});

gulp.task('build:php', function() {
	return merge(
		gulp.src('src/admin/php/*')
			.pipe(gulp.dest('dist/'))
	);
});

gulp.task('build', gulp.parallel('build:html', 'build:css', 'build:js', 'build:php'));
