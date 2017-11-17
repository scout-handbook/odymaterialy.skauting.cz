<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Competence.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');

use Ramsey\Uuid\Uuid;

$competenceEndpoint = new OdyMaterialyAPI\Endpoint('competence');

$listCompetences = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
SELECT id, number, name, description
FROM competences
ORDER BY number;
SQL;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$id = '';
	$number = '';
	$name = '';
	$description = '';
	$db->bind_result($id, $number, $name, $description);
	$competences = [];
	while($db->fetch())
	{
		$competences[] = new OdyMaterialyAPI\Competence($id, $number, $name, $description);
	}
	return ['status' => 200, 'response' => $competences];
};
$competenceEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $listCompetences);

$addCompetence = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO competences (id, number, name, description)
VALUES (?, ?, ?, ?);
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
	$name = $endpoint->xss_sanitize($data['name']);
	$description = '';
	if(isset($data['description']))
	{
		$description = $endpoint->xss_sanitize($data['description']);
	}
	$uuid = Uuid::uuid4()->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('siss', $uuid, $number, $name, $description);
	$db->execute();
	return ['status' => 201];
};
$competenceEndpoint->setAddMethod(new OdymaterialyAPI\Role('administrator'), $addCompetence);

$updateCompetence = function($skautis, $data, $endpoint)
{
	$selectSQL = <<<SQL
SELECT number, name, description
FROM competences
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE competences
SET number = ?, name = ?, description = ?
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();
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
		$name = $endpoint->xss_sanitize($data['name']);
	}
	if(isset($data['description']))
	{
		$description = $endpoint->xss_sanitize($data['description']);
	}

	$db = new OdymaterialyAPI\Database();

	if(!isset($number) or !isset($name) or !isset($description))
	{
		$db->prepare($selectSQL);
		$db->bind_param('s', $id);
		$db->execute();
		$db->store_result();
		$origNumber = '';
		$origName = '';
		$origDescription = '';
		$db->bind_result($origNumber, $origName, $origDescription);
		$db->fetch_require('competence');
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

	$db->start_transaction();

	$db->prepare($updateSQL);
	$db->bind_param('isss', $number, $name, $description, $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('competence');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("competence");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$competenceEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('administrator'), $updateCompetence);

$deleteCompetence = function($skautis, $data, $endpoint)
{
	$deleteLessonsSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE competence_id = ?;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM competences
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
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

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('competence');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("competence");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$competenceEndpoint->setDeleteMethod(new OdymaterialyAPI\Role('administrator'), $deleteCompetence);
