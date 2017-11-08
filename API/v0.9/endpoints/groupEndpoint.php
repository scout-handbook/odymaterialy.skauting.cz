<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Group.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

$groupEndpoint = new OdyMaterialyAPI\Endpoint('group');

$listGroups = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
SELECT id, name
FROM groups;
SQL;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$id = '';
	$name = '';
	$db->bind_result($id, $name);
	$groups = [];
	while($db->fetch())
	{
		$groups[] = new OdyMaterialyAPI\Group($id, $name);
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
