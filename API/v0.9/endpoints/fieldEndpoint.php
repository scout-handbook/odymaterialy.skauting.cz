<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');

use Ramsey\Uuid\Uuid;

$fieldEndpoint = new OdyMaterialyAPI\Endpoint('field');

$addField = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO fields (id, name)
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
$fieldEndpoint->setAddMethod(new OdymaterialyAPI\Role('administrator'), $addField);

$updateField = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
UPDATE fields
SET name = ?
WHERE id = ?
LIMIT 1;
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $endpoint->xss_sanitize($data['name']);

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('ss', $name, $id);
	$db->execute();
	return ['status' => 200];
};
$fieldEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('administrator'), $updateField);

$deleteField = function($skautis, $data, $endpoint)
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

	$id = $endpoint->parseUuid($data['id'])->getBytes();

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
$fieldEndpoint->setDeleteMethod(new OdymaterialyAPI\Role('administrator'), $deleteField);
