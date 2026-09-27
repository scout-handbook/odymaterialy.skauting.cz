# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## What this repo is

Site-specific configuration for the [odymaterialy.skauting.cz](https://odymaterialy.skauting.cz) deployment of the Scout Handbook platform. It contains no application code — only config, static files and a Gulp build that assembles them into `dist/`. The application itself lives in separate `scout-handbook` repositories (`handbook-api`, `handbook-web-admin`, `handbook-web-frontend`), listed in `.gitmodules` as `API/`, `admin/` and `frontend/`. Those submodules are not registered in the git index here, so they are not checked out.

## Commands

```sh
npm ci
cp src/.env.sample src/.env                        # gitignored; required by the build
cp src/api-secrets.php.sample src/api-secrets.php  # gitignored; required by the build
npm run build                                      # gulp build -> dist/
```

There are no tests or linters. CI (`.github/workflows/CI.yml`) only runs the build using the sample secrets.

## Build layout

`gulpfile.js` is the source of truth for what gets deployed and where. `dist/` is the web root:

- Most files in `src/` are copied to `dist/`.
- `src/.env` goes to `dist/API/.env` (Laravel-style env for the API: DB, SkautIS app ID, cookie domain).
- `src/assetlinks.json` and `src/security.txt` go to `dist/.well-known/`.
- `src/frontend-htaccess.txt` becomes `dist/.htaccess`. It contains the Apache rewrite rules that route `/` and `/lesson|field|competence` to `frontend/`, `/API*` to `API/public/index.php` and `/login|logout` to the API, plus the security headers and CSP.
- `dist/images/{tmp,original,web,thumbnail}` are created and `dist/images` is chmodded to 777 for the API's image uploads.

A new file in `src/` is **not** deployed unless it is added to `gulpfile.js`. `src/client-theme.css` and `src/.well-known/assetlinks.json` are currently not part of the build. The deployed assetlinks file is `src/assetlinks.json`.

## Config files

- `src/api-config.php` holds the legacy API paths and URIs. It is guarded by `_API_EXEC`.
- `src/api-secrets.php` holds the legacy API DB/SkautIS secrets. It is guarded by `$_API_SECRETS_EXEC`.
- `src/client-config.json` holds the URIs and site name consumed by the admin and frontend clients.

The domain appears in `api-config.php`, `client-config.json` and `.env` and must be kept consistent across them. Production uses `odymaterialy.skauting.cz` and local development uses `odymaterialy.test`. Do not commit a local `.test` domain in `api-config.php` or `client-config.json`.
