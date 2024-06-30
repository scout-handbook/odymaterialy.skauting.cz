import gulp from 'gulp';
import rename from "gulp-rename";
import shell from 'gulp-shell';
import ordered from 'ordered-read-streams';

gulp.task('install:admin', shell.task('npm ci', {cwd: 'admin'}));

gulp.task('install:API', shell.task('composer install --no-dev --optimize-autoloader', {cwd: 'API'}));

gulp.task('install:frontend', shell.task('npm ci', {cwd: 'frontend'}));

gulp.task('build:admin', gulp.series('install:admin', shell.task('VITE_CONFIG="../src/client-config.json" VITE_THEME="../src/client-theme.css" npm run build', {cwd: 'admin'})));

gulp.task('build:frontend', gulp.series('install:frontend', shell.task('npm run build -- --config="../src/client-config.json" --theme="../src/client-theme.css"', {cwd: 'frontend'})));

gulp.task('copy:admin', gulp.series('build:admin', function() {
	return gulp.src(['admin/dist/**'], { dot: true, encoding: false })
		.pipe(gulp.dest('dist/admin/'));
}));

gulp.task('copy:API', gulp.series('install:API', function() {
	return ordered([
		gulp.src('API/setup/**/*', { encoding: false })
			.pipe(gulp.dest('dist/API/setup/')),
		gulp.src('API/Skaut/**/*', { encoding: false })
			.pipe(gulp.dest('dist/API/Skaut/')),
		gulp.src('API/vendor/**/*', { encoding: false })
			.pipe(gulp.dest('dist/API/vendor/')),
		gulp.src('API/v*.*/**/*', { dot: true, encoding: false })
			.pipe(gulp.dest('dist/API/'))
	]);
}, shell.task('chmod 777 dist/API/vendor/mpdf/mpdf/tmp')));

gulp.task('copy:frontend', gulp.series('build:frontend', function() {
	return gulp.src('frontend/dist/**', { encoding: false })
		.pipe(gulp.dest('dist/frontend/'));
}));

gulp.task('copy:local', gulp.parallel(
	function() {
		return ordered([
			gulp.src(['src/api-config.php', 'src/api-secrets.php', 'src/client-config.json', 'src/google8cbe14e41a3d2e27.html', 'src/pgp-key.asc', 'src/privacy.html', 'src/robots.txt'], { encoding: false })
				.pipe(gulp.dest('dist/')),
			gulp.src(['src/assetlinks.json', 'src/security.txt'], { encoding: false })
				.pipe(gulp.dest('dist/.well-known/')),
			gulp.src('src/frontend-htaccess.txt', { encoding: false })
				.pipe(rename('.htaccess'))
				.pipe(gulp.dest('dist/')),
		]);
	},
	gulp.series(
		gulp.parallel(
			shell.task('mkdir -p dist/images/tmp'),
			shell.task('mkdir -p dist/images/original'),
			shell.task('mkdir -p dist/images/web'),
			shell.task('mkdir -p dist/images/thumbnail')
		),
		shell.task('chmod -R 777 dist/images')
	)
));

gulp.task('build', gulp.parallel('copy:admin', 'copy:API', 'copy:frontend', 'copy:local'));
