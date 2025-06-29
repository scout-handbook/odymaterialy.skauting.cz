import gulp from 'gulp';
import rename from "gulp-rename";
import shell from 'gulp-shell';
import ordered from 'ordered-read-streams';

gulp.task('install:frontend', shell.task('npm ci', {cwd: 'frontend'}));

gulp.task('build:frontend', gulp.series('install:frontend', shell.task('npm run build -- --config="../src/client-config.json" --theme="../src/client-theme.css"', {cwd: 'frontend'})));

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

gulp.task('build', gulp.parallel('copy:frontend', 'copy:local'));
