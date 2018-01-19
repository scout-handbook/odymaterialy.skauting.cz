<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Competence.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

require_once($BASEPATH . '/v0.9/internal/exceptions/InvalidArgumentTypeException.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/NotFoundException.php');

use Ramsey\Uuid\Uuid;

$competenceEndpoint = new HandbookAPI\Endpoint();

$listCompetences = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT id, number, name, description
FROM competences
ORDER BY number;
SQL;

	$db = new HandbookAPI\Database();
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
		$competences[] = new HandbookAPI\Competence(strval($id), intval($number), strval($name), strval($description));
	}
	return ['status' => 200, 'response' => $competences];
};
$competenceEndpoint->setListMethod(new HandbookAPI\Role('guest'), $listCompetences);

$addCompetence = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
INSERT INTO competences (id, number, name, description)
VALUES (:id, :number, :name, :description);
SQL;

	if(!isset($data['number']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'number');
	}
	if(!isset($data['name']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'name');
	}
	$number = ctype_digit($data['number']) ? intval($data['number']) : null;
	if($number === null)
	{
		throw new HandbookAPI\InvalidArgumentTypeException('number', ['Integer']);
	}
	$name = $data['name'];
	$description = '';
	if(isset($data['description']))
	{
		$description = $data['description'];
	}
	$uuid = Uuid::uuid4()->getBytes();

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $uuid, PDO::PARAM_STR);
	$db->bindParam(':number', $number, PDO::PARAM_INT);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':description', $description, PDO::PARAM_STR);
	$db->execute();
	return ['status' => 201];
};
$competenceEndpoint->setAddMethod(new HandbookAPI\Role('administrator'), $addCompetence);

$updateCompetence = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
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

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'competence')->getBytes();
	if(isset($data['number']))
	{
		$number = ctype_digit($data['number']) ? intval($data['number']) : null;
		if($number === null)
		{
			throw new HandbookAPI\InvalidArgumentTypeException('number', ['Integer']);
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

	$db = new HandbookAPI\Database();

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
		throw new HandbookAPI\NotFoundException("competence");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$competenceEndpoint->setUpdateMethod(new HandbookAPI\Role('administrator'), $updateCompetence);

$deleteCompetence = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
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

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'competence')->getBytes();

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteLessonsSQL);
	$db->bindParam(':competence_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new HandbookAPI\NotFoundException("competence");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$competenceEndpoint->setDeleteMethod(new HandbookAPI\Role('administrator'), $deleteCompetence);
