<?php
const _API_EXEC = 1;

header('content-type:text/markdown; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

use Ramsey\Uuid\Uuid;

$endpoint = new OdyMaterialyAPI\Endpoint('lesson');

$getLesson = function($skautis, $data)
{
	$SQL = <<<SQL
SELECT body
FROM lessons
WHERE id = ?;
SQL;

	$id = Uuid::fromString($data['id'])->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('s', $id);
	$db->execute();
	$body = '';
	$db->bind_result($body);
	$db->fetch_require(); // TODO: Message
	return ['status'=> 200, 'body' => $body];
};
$endpoint->setGetMethod(new OdyMaterialyAPI\Role('guest'), $getLesson);

$endpoint->handle();
