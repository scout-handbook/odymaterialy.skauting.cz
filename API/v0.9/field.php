<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');

use Ramsey\Uuid\Uuid;

$endpoint = new OdyMaterialyAPI\Endpoint('field');

$addField = function($skautis, $data)
{
	$SQL = <<<SQL
INSERT INTO fields (id, name)
VALUES (?, ?);
SQL;

	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'name');
	}
	$name = $data['name'];
	$uuid = Uuid::uuid4()->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('ss', $uuid, $name);
	$db->execute();
	return ['status' => 201];
};
$endpoint->setAddMethod(new OdymaterialyAPI\Role('administrator'), $addField);

$updateField = function($skautis, $data)
{
	$SQL = <<<SQL
UPDATE fields
SET name = ?
WHERE id = ?
LIMIT 1;
SQL;

	$id = $data['id']->getBytes();
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'name');
	}
	$name = $data['name'];

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('ss', $name, $id);
	$db->execute();
	return ['status' => 200];
};
$endpoint->setUpdateMethod(new OdymaterialyAPI\Role('administrator'), $updateField);

$deleteField = function($skautis, $data)
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE field_id = ?;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM fields
WHERE id = ?
LIMIT 1;
SQL;

	$id = $data['id']->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteLessonsSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->finish_transaction();
	return ['status' => 200];
};
$endpoint->setDeleteMethod(new OdymaterialyAPI\Role('administra_POSTtor'), $deleteField);

$endpoint->handle();
