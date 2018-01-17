<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonGroupEndpoint = new OdyMaterialyAPI\Endpoint('group');

$listLessonGroups = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT group_id FROM groups_for_lessons
WHERE lesson_id = ?;
SQL;

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$id = $endpoint->parseUuid($data['parent-id'])->getBytes();
	$db->bind_param('s', $id);
	$db->execute();
	$groups = [];
	$group_id = '';
	$db->bind_result($group_id);
	while($db->fetch())
	{
		$groups[] = Uuid::fromBytes(strval($group_id));
	}
	return ['status' => 200, 'response' => $groups];
};
$lessonGroupEndpoint->setListMethod(new OdyMaterialyAPI\Role('editor'), $listLessonGroups);

$updateLessonGroups = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteSQL = <<<SQL
DELETE FROM groups_for_lessons
WHERE lesson_id = ?;
SQL;
	$insertSQL = <<<SQL
INSERT INTO groups_for_lessons (lesson_id, group_id)
VALUES (?, ?);
SQL;

	$id = $endpoint->parseUuid($data['parent-id'])->getBytes();
	$groups = [];
	if(isset($data['group']))
	{
		foreach($data['group'] as $group)
		{
			$groups[] = $endpoint->parseUuid($group)->getBytes();
		}
	}

	$db = new OdyMaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($insertSQL);
	foreach($groups as $group)
	{
		$db->bind_param('ss', $id, $group);
		$db->execute("lesson or group");
	}
	$db->finish_transaction();
	return ['status' => 200];
};
$lessonGroupEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('editor'), $updateLessonGroups);
