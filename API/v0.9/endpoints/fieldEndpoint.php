<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');

use Ramsey\Uuid\Uuid;

$fieldEndpoint = new OdyMaterialyAPI\Endpoint();

$addField = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
INSERT INTO fields (id, name)
VALUES (:id, :name);
SQL;

	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $data['name'];
	$uuid = Uuid::uuid4()->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $uuid, PDO::PARAM_STR);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->execute();
	return ['status' => 201];
};
$fieldEndpoint->setAddMethod(new OdyMaterialyAPI\Role('administrator'), $addField);

$updateField = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
UPDATE fields
SET name = :name
WHERE id = :id
LIMIT 1;
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'field')->getBytes();
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $data['name'];

	$db = new OdyMaterialyAPI\Database();
	$db->beginTransaction();

	$db->prepare($SQL);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("field");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$fieldEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('administrator'), $updateField);

$deleteField = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE field_id = :field_id;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM fields
WHERE id = :id
LIMIT 1;
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'field')->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteLessonsSQL);
	$db->bindParam(':field_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("field");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$fieldEndpoint->setDeleteMethod(new OdyMaterialyAPI\Role('administrator'), $deleteField);
