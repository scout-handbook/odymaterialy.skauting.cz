<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonGroupEndpoint = new HandbookAPI\Endpoint();

$listLessonGroups = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT group_id FROM groups_for_lessons
WHERE lesson_id = :lesson_id;
SQL;

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();
	$groups = [];
	$group_id = '';
	$db->bindColumn('group_id', $group_id);
	while($db->fetch())
	{
		$groups[] = Uuid::fromBytes(strval($group_id));
	}
	return ['status' => 200, 'response' => $groups];
};
$lessonGroupEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listLessonGroups);

$updateLessonGroups = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$deleteSQL = <<<SQL
DELETE FROM groups_for_lessons
WHERE lesson_id = :lesson_id;
SQL;
	$insertSQL = <<<SQL
INSERT INTO groups_for_lessons (lesson_id, group_id)
VALUES (:lesson_id, :group_id);
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	$groups = [];
	if(isset($data['group']))
	{
		foreach($data['group'] as $group)
		{
			$groups[] = HandbookAPI\Helper::parseUuid($group, 'group')->getBytes();
		}
	}

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteSQL);
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($insertSQL);
	foreach($groups as $group)
	{
		$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
		$db->bindParam(':group_id', $group, PDO::PARAM_STR);
		$db->execute("lesson or group");
	}
	$db->endTransaction();
	return ['status' => 200];
};
$lessonGroupEndpoint->setUpdateMethod(new HandbookAPI\Role('editor'), $updateLessonGroups);
