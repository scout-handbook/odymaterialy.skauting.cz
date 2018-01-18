<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Competence.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');

use Ramsey\Uuid\Uuid;

$competenceEndpoint = new OdyMaterialyAPI\Endpoint();

$listCompetences = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT id, number, name, description
FROM competences
ORDER BY number;
SQL;

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$id = '';
	$number = '';
	$name = '';
	$description = '';
	$db->bindColumn('id', $id);
	$db->bindColumn('number', $number);
	$db->bindColumn('name', $name);
	$db->bindColumn('description', $description);
	$competences = [];
	while($db->fetch())
	{
		$competences[] = new OdyMaterialyAPI\Competence(strval($id), intval($number), strval($name), strval($description));
	}
	return ['status' => 200, 'response' => $competences];
};
$competenceEndpoint->setListMethod(new OdyMaterialyAPI\Role('guest'), $listCompetences);

$addCompetence = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
INSERT INTO competences (id, number, name, description)
VALUES (:id, :number, :name, :description);
SQL;

	if(!isset($data['number']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'number');
	}
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$number = ctype_digit($data['number']) ? intval($data['number']) : null;
	if($number === null)
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('number', ['Integer']);
	}
	$name = $data['name'];
	$description = '';
	if(isset($data['description']))
	{
		$description = $data['description'];
	}
	$uuid = Uuid::uuid4()->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $uuid, PDO::PARAM_STR);
	$db->bindParam(':number', $number, PDO::PARAM_INT);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':description', $description, PDO::PARAM_STR);
	$db->execute();
	return ['status' => 201];
};
$competenceEndpoint->setAddMethod(new OdyMaterialyAPI\Role('administrator'), $addCompetence);

$updateCompetence = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$selectSQL = <<<SQL
SELECT number, name, description
FROM competences
WHERE id = :id;
SQL;
	$updateSQL = <<<SQL
UPDATE competences
SET number = :number, name = :name, description = :description
WHERE id = :id
LIMIT 1;
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'competence')->getBytes();
	if(isset($data['number']))
	{
		$number = ctype_digit($data['number']) ? intval($data['number']) : null;
		if($number === null)
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('number', ['Integer']);
		}
	}
	if(isset($data['name']))
	{
		$name = $data['name'];
	}
	if(isset($data['description']))
	{
		$description = $data['description'];
	}

	$db = new OdyMaterialyAPI\Database();

	if(!isset($number) or !isset($name) or !isset($description))
	{
		$db->prepare($selectSQL);
		$db->bindParam(':id', $id, PDO::PARAM_STR);
		$db->execute();
		$origNumber = '';
		$origName = '';
		$origDescription = '';
		$db->bindColumn('number', $origNumber);
		$db->bindColumn('name', $origName);
		$db->bindColumn('description', $origDescription);
		$db->fetchRequire('competence');
		if(!isset($number))
		{
			$number = $origNumber;
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($description))
		{
			$description = $origDescription;
		}
	}

	$db->beginTransaction();

	$db->prepare($updateSQL);
	$db->bindParam(':number', $number, PDO::PARAM_INT);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':description', $description, PDO::PARAM_STR);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("competence");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$competenceEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('administrator'), $updateCompetence);

$deleteCompetence = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE competence_id = :competence_id;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM competences
WHERE id = :id
LIMIT 1;
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'competence')->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteLessonsSQL);
	$db->bindParam(':competence_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("competence");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$competenceEndpoint->setDeleteMethod(new OdyMaterialyAPI\Role('administrator'), $deleteCompetence);
