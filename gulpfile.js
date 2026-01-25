import fs from 'fs';
import gulp from 'gulp';
import rename from "gulp-rename";

export const build = gulp.parallel(
	() => gulp.src([
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
	() => gulp.src(['src/.env'], { encoding: false })
		.pipe(gulp.dest('dist/API/')),
	() => gulp.src(['src/assetlinks.json', 'src/security.txt'], { encoding: false })
		.pipe(gulp.dest('dist/.well-known/')),
	() => gulp.src('src/frontend-htaccess.txt', { encoding: false })
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest('dist/')),
	async function createImageDirs(cb) {
		for (const dir of ['dist/images/tmp', 'dist/images/original', 'dist/images/web', 'dist/images/thumbnail']) {
			await fs.promises.mkdir(dir, { recursive: true });
		}
		await fs.promises.chmod('dist/images', 0o777);
		cb();
	},
);

export default build;
