<?php declare(strict_types=1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/internal/database.secret.php');

echo("Please edit this file and comment out line 8.");
die(); // Comment out this line by putting // at its beginning. Do not delete this line.

$setupQuery = file_get_contents($BASEPATH . '/v0.9/setup/setupQuery.sql', true);
$db = new PDO(HandbookAPI\DB_DSN . ';charset=utf8mb4', HandbookAPI\DB_USER, HandbookAPI\DB_PASSWORD);
$db->exec($setupQuery);

mkdir($IMAGEPATH, 0750);
mkdir($IMAGEPATH . '/original', 0750);
mkdir($IMAGEPATH . '/web', 0750);
mkdir($IMAGEPATH . '/thumbnail', 0750);
mkdir($IMAGEPATH . '/tmp', 0750);
copy($BASEPATH . '/v0.9/setup/images_htaccess', $IMAGEPATH . '/.htaccess');

copy($BASEPATH . '/v0.9/setup/original.jpg', $IMAGEPATH . '/original/00000000-0000-0000-0000-000000000000.jpg');
copy($BASEPATH . '/v0.9/setup/web.jpg', $IMAGEPATH . '/web/00000000-0000-0000-0000-000000000000.jpg');
copy($BASEPATH . '/v0.9/setup/thumbnail.jpg', $IMAGEPATH . '/thumbnail/00000000-0000-0000-0000-000000000000.jpg');
chmod($IMAGEPATH . '/original/00000000-0000-0000-0000-000000000000.jpg', 0444);
chmod($IMAGEPATH . '/web/00000000-0000-0000-0000-000000000000.jpg', 0444);
chmod($IMAGEPATH . '/thumbnail/00000000-0000-0000-0000-000000000000.jpg', 0444);

$file_content = file($BASEPATH . '/v0.9/setup/setup.php');
$file_content[7] = "die(); // Comment out this line by putting // at its beginning. Do not delete this line.\n";
$file = fopen($BASEPATH . '/v0.9/setup/setup.php', "w");
fwrite($file, implode($file_content));
fclose($file);

echo("<br>Finished successfully.");
