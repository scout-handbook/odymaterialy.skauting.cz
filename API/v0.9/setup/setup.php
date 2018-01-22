<?php declare(strict_types=1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/internal/database.secret.php');

echo("Please edit this file and comment out line 8.");
die(); // Comment out this line by putting // at its beginning. Do not delete this line.

$setupQuery = file_get_contents($BASEPATH . '/v0.9/setup/setupQuery.sql', true);
$db = new PDO(DB_DSN . ';charset=utf8', DB_USER, DB_PASSWORD);
$db->exec($setupQuery);

mkdir($IMAGEPATH, 0750);
mkdir($IMAGEPATH . '/original', 0750);
mkdir($IMAGEPATH . '/web', 0750);
mkdir($IMAGEPATH . '/thumbnail', 0750);
mkdir($IMAGEPATH . '/tmp', 0750);

copy($BASEPATH . '/v0.9/setup/original.jpg', $IMAGEPATH . '/original/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg');
copy($BASEPATH . '/v0.9/setup/web.jpg', $IMAGEPATH . '/web/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg');
copy($BASEPATH . '/v0.9/setup/thumbnail.jpg', $IMAGEPATH . '/thumbnail/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg');
chmod($IMAGEPATH . '/original/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg', 0444);
chmod($IMAGEPATH . '/web/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg', 0444);
chmod($IMAGEPATH . '/thumbnail/ed02b61f-ef4c-40e8-9018-3acbe071316d.jpg', 0444);

$file_content = file($BASEPATH . '/v0.9/setup/setup.php');
$file_content[7] = "die(); // Comment out this line by putting // at its beginning. Do not delete this line.\n";
$file = fopen($BASEPATH . '/v0.9/setup/setup.php', "w");
fwrite($file, implode($file_content));
fclose($file);

echo("<br>Finished successfully.");
