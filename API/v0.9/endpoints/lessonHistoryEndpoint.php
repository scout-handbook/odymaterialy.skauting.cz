<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

require_once($BASEPATH . '/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

use Ramsey\Uuid\Uuid;

$lessonHistoryEndpoint = new HandbookAPI\Endpoint();

$listLessonHistory = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT name, UNIX_TIMESTAMP(version) FROM lesson_history
WHERE id = :id
ORDER BY version DESC;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();
	$versions = [];
	$name = '';
	$version = '';
	$db->bindColumn('name', $name);
	$db->bindColumn(2, $version);
	while($db->fetch())
	{
		$versions[] = ['name' => $name, 'version' => round($version * 1000)];
	}
	return ['status' => 200, 'response' => $versions];
};
$lessonHistoryEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listLessonHistory);

$getLessonHistory = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT body
FROM lesson_history
WHERE id = :id
AND version = FROM_UNIXTIME(:version);
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	$version = ctype_digit($data['id']) ? intval($data['id']) / 1000 : null;
	if($version === null)
	{
		throw new HandbookAPI\InvalidArgumentTypeException('number', ['Integer']);
	}

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->bindParam(':version', $version, PDO::PARAM_INT);
	$db->execute();
	$body = '';
	$db->bindColumn('body', $body);
	$db->fetchRequire('lesson');
	return ['status' => 200, 'response' => $body];
};
$lessonHistoryEndpoint->setGetMethod(new HandbookAPI\Role('editor'), $getLessonHistory);
