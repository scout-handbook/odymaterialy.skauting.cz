<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

require_once($BASEPATH . '/v0.9/internal/exceptions/InvalidArgumentTypeException.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/NotFoundException.php');

use Ramsey\Uuid\Uuid;

$deletedLessonHistoryEndpoint = new HandbookAPI\Endpoint();

$listDeletedLessonHistory = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$checkSQL = <<<SQL
SELECT 1 FROM lessons
WHERE id = :id
LIMIT 1;
SQL;
	$selectSQL = <<<SQL
SELECT name, UNIX_TIMESTAMP(version) FROM lesson_history
WHERE id = :id
ORDER BY version DESC;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'deleted lesson')->getBytes();

	$db = new HandbookAPI\Database();
	$db->prepare($checkSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();
	if($db->fetch())
	{
		throw new HandbookAPI\NotFoundException('deleted lesson');
	}

	$db->prepare($selectSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();
	$versions = [];
	$name = '';
	$version = '';
	$db->bindColumn('name', $name);
	$db->bindColumn(2, $version);
	if(!$db->fetch())
	{
		throw new HandbookAPI\NotFoundException('deleted lesson');
	}
	$versions[] = ['name' => $name, 'version' => round($version * 1000)];
	while($db->fetch())
	{
		$versions[] = ['name' => $name, 'version' => round($version * 1000)];
	}
	return ['status' => 200, 'response' => $versions];
};
$deletedLessonHistoryEndpoint->setListMethod(new HandbookAPI\Role('administrator'), $listDeletedLessonHistory);

$getDeletedLessonHistory = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$checkSQL = <<<SQL
SELECT 1 FROM lessons
WHERE id = :id
LIMIT 1;
SQL;
	$selectSQL = <<<SQL
SELECT body
FROM lesson_history
WHERE id = :id
AND version = FROM_UNIXTIME(:version);
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'deleted lesson')->getBytes();
	$version = ctype_digit($data['id']) ? intval($data['id']) / 1000 : null;
	if($version === null)
	{
		throw new HandbookAPI\InvalidArgumentTypeException('number', ['Integer']);
	}
	$version = strval($version);

	$db = new HandbookAPI\Database();
	$db->prepare($checkSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();
	if($db->fetch())
	{
		throw new HandbookAPI\NotFoundException('deleted lesson');
	}

	$db->prepare($selectSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->bindParam(':version', $version, PDO::PARAM_STR);
	$db->execute();
	$body = '';
	$db->bindColumn('body', $body);
	$db->fetchRequire('deleted lesson');
	return ['status' => 200, 'response' => $body];
};
$deletedLessonHistoryEndpoint->setGetMethod(new HandbookAPI\Role('administrator'), $getDeletedLessonHistory);
