<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Database.php');
require_once($CONFIG->basepath . '/v0.9/internal/Endpoint.php');
require_once($CONFIG->basepath . '/v0.9/internal/Group.php');
require_once($CONFIG->basepath . '/v0.9/internal/Helper.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/NotFoundException.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/RefusedException.php');

use Ramsey\Uuid\Uuid;

$groupEndpoint = new HandbookAPI\Endpoint();

$listGroups = function() : array
{
	$selectSQL = <<<SQL
SELECT id, name
FROM groups;
SQL;
	$countSQL = <<<SQL
SELECT COUNT(*) FROM users_in_groups
WHERE group_id = :group_id;
SQL;

	$db = new HandbookAPI\Database();
	$db->prepare($selectSQL);
	$db->execute();
	$id = '';
	$name = '';
	$db->bindColumn('id', $id);
	$db->bindColumn('name', $name);
	$groups = [];
	while($db->fetch())
	{
		$db2 = new HandbookAPI\Database();
		$db2->prepare($countSQL);
		$db2->bindParam(':group_id', $id, PDO::PARAM_STR);
		$db2->execute();
		$count = '';
		$db2->bindColumn(1, $count);
		$db2->fetchRequire('group');
		$groups[] = new HandbookAPI\Group(strval($id), strval($name), intval($count));
	}
	return ['status' => 200, 'response' => $groups];
};
$groupEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listGroups);

$addGroup = function(Skautis\Skautis $skautis, array $data) : array
{
	$SQL = <<<SQL
INSERT INTO groups (id, name)
VALUES (:id, :name);
SQL;

	if(!isset($data['name']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'name');
	}
	$name = $data['name'];
	$uuid = Uuid::uuid4()->getBytes();

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $uuid, PDO::PARAM_STR);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->execute();
	return ['status' => 201];
};
$groupEndpoint->setAddMethod(new HandbookAPI\Role('administrator'), $addGroup);

$updateGroup = function(Skautis\Skautis $skautis, array $data) : array
{
	$updateSQL = <<<SQL
UPDATE groups
SET name = :name
WHERE id = :id
LIMIT 1;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'group')->getBytes();
	if(!isset($data['name']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'name');
	}
	$name = $data['name'];
	
	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($updateSQL);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new HandbookAPI\NotFoundException("group");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$groupEndpoint->setUpdateMethod(new HandbookAPI\Role('administrator'), $updateGroup);

$deleteGroup = function(Skautis\Skautis $skautis, array $data) : array
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM groups_for_lessons
WHERE group_id = :group_id;
SQL;
	$deleteUsersSQL = <<<SQL
DELETE FROM users_in_groups
WHERE group_id = :group_id;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM groups
WHERE id = :id
LIMIT 1;
SQL;
	
	$id = HandbookAPI\Helper::parseUuid($data['id'], 'group');
	if($id == Uuid::fromString('00000000-0000-0000-0000-000000000000'))
	{
		throw new HandbookAPI\RefusedException();
	}
	$id = $id->getBytes();

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteLessonsSQL);
	$db->bindParam(':group_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteUsersSQL);
	$db->bindParam(':group_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new HandbookAPI\NotFoundException("group");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$groupEndpoint->setDeleteMethod(new HandbookAPI\Role('administrator'), $deleteGroup);
