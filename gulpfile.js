import gulp from 'gulp';
import rename from "gulp-rename";
import shell from 'gulp-shell';
import ordered from 'ordered-read-streams';

gulp.task('build', gulp.parallel(
	function() {
		return ordered([
			gulp.src([
				'src/api-config.php',
				'src/api-secrets.php',
				'src/client-config.json',
				'src/google8cbe14e41a3d2e27.html',
				'src/manifest.json',
				'src/pgp-key.asc',
				'src/privacy.html',
				'src/robots.txt'
			], { encoding: false })
				.pipe(gulp.dest('dist/')),
			gulp.src(['src/.env'], { encoding: false })
				.pipe(gulp.dest('dist/API/')),
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
