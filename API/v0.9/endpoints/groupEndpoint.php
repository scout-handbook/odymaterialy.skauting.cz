<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Group.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/RefusedException.php');

use Ramsey\Uuid\Uuid;

$groupEndpoint = new OdyMaterialyAPI\Endpoint('group');

$listGroups = function($skautis, $data, $endpoint)
{
	$selectSQL = <<<SQL
SELECT id, name
FROM groups;
SQL;
	$countSQL = <<<SQL
SELECT COUNT(*) FROM users_in_groups
WHERE group_id = ?;
SQL;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($selectSQL);
	$db->execute();
	$id = '';
	$name = '';
	$db->bind_result($id, $name);
	$groups = [];
	while($db->fetch())
	{
		$db2 =  new OdymaterialyAPI\Database();
		$db2->prepare($countSQL);
		$db2->bind_param('s', $id);
		$db2->execute();
		$count = '';
		$db2->bind_result($count);
		$db2->fetch_require('group');
		$groups[] = new OdyMaterialyAPI\Group($id, $name, $count);
	}
	return ['status' => 200, 'response' => $groups];
};
$groupEndpoint->setListMethod(new OdyMaterialyAPI\Role('editor'), $listGroups);

$addGroup = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO groups (id, name)
VALUES (?, ?);
SQL;

	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $endpoint->xss_sanitize($data['name']);
	$uuid = Uuid::uuid4()->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('ss', $uuid, $name);
	$db->execute();
	return ['status' => 201];
};
$groupEndpoint->setAddMethod(new OdymaterialyAPI\Role('administrator'), $addGroup);

$updateGroup = function($skautis, $data, $endpoint)
{
	$updateSQL = <<<SQL
UPDATE groups
SET name = ?
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $endpoint->xss_sanitize($data['name']);
	
	$db = new OdymaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($updateSQL);
	$db->bind_param('ss', $name, $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('group');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("group");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$groupEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('administrator'), $updateGroup);

$deleteGroup = function($skautis, $data, $endpoint)
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM groups_for_lessons
WHERE group_id = ?;
SQL;
	$deleteUsersSQL = <<<SQL
DELETE FROM users_in_groups
WHERE group_id = ?;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM groups
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;
	
	$id = $endpoint->parseUuid($data['id']);
	if($id == Uuid::fromString('00000000-0000-0000-0000-000000000000'))
	{
		throw new OdymaterialyAPI\RefusedException();
	}
	$id = $id->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteLessonsSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteUsersSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('group');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("group");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$groupEndpoint->setDeleteMethod(new OdymaterialyAPI\Role('administrator'), $deleteGroup);
