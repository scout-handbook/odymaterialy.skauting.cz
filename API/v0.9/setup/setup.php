<?php declare(strict_types = 1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/v0.9/internal/database.secret.php');

echo("Please edit this file and comment out line 8.");
die(); // Comment out this line by putting // at its beginning. Do not delete this line.

$setupQuery = file_get_contents($CONFIG->basepath . '/v0.9/setup/setupQuery.sql', true);
$db = new PDO(HandbookAPI\DB_DSN . ';charset=utf8mb4', HandbookAPI\DB_USER, HandbookAPI\DB_PASSWORD);
$db->exec($setupQuery);

mkdir($CONFIG->imagepath, 0750);
mkdir($CONFIG->imagepath . '/original', 0750);
mkdir($CONFIG->imagepath . '/web', 0750);
mkdir($CONFIG->imagepath . '/thumbnail', 0750);
mkdir($CONFIG->imagepath . '/tmp', 0750);
copy($CONFIG->basepath . '/v0.9/setup/images_htaccess', $CONFIG->imagepath . '/.htaccess');

copy($CONFIG->basepath . '/v0.9/setup/original.jpg', $CONFIG->imagepath . '/original/00000000-0000-0000-0000-000000000000.jpg');
copy($CONFIG->basepath . '/v0.9/setup/web.jpg', $CONFIG->imagepath . '/web/00000000-0000-0000-0000-000000000000.jpg');
copy($CONFIG->basepath . '/v0.9/setup/thumbnail.jpg', $CONFIG->imagepath . '/thumbnail/00000000-0000-0000-0000-000000000000.jpg');
chmod($CONFIG->imagepath . '/original/00000000-0000-0000-0000-000000000000.jpg', 0444);
chmod($CONFIG->imagepath . '/web/00000000-0000-0000-0000-000000000000.jpg', 0444);
chmod($CONFIG->imagepath . '/thumbnail/00000000-0000-0000-0000-000000000000.jpg', 0444);

$file_content = file($CONFIG->basepath . '/v0.9/setup/setup.php');
$file_content[7] = "die(); // Comment out this line by putting // at its beginning. Do not delete this line.\n";
$file = fopen($CONFIG->basepath . '/v0.9/setup/setup.php', "w");
fwrite($file, implode($file_content));
fclose($file);

echo("<br>Finished successfully.");
