<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/RoleException.php');

$getLesson = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT body
FROM lessons
WHERE id = :id;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'lesson');

	if(!checkLessonGroup($id, true))
	{
		throw new HandbookAPI\RoleException();
	}

	$id = $id->getBytes();

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();
	$body = '';
	$db->bindColumn('body', $body);
	$db->fetchRequire('lesson');
	return ['status' => 200, 'response' => $body];
};
