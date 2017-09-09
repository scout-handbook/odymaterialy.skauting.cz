<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function delete()
{
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = ?;
SQL;
	$deleteFieldSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = ?;
SQL;
	$deleteCompetencesSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;

	$deleteSQL = <<<SQL
DELETE FROM lessons
WHERE id = ?;
SQL;

	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = Uuid::fromString($_POST['id'])->getBytes();

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}
	$db->autocommit(false);

	$copyStatement = $db->prepare($copySQL);
	if(!$copyStatement)
	{
		throw new OdyMaterialyAPI\QueryException($copySQL, $db);
	}
	$copyStatement->bind_param('s', $id);
	if(!$copyStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($copySQL, $copyStatement);
	}
	$copyStatement->close();

	$deleteFieldStatement = $db->prepare($deleteFieldSQL);
	if(!$deleteFieldStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteFieldSQL, $db);
	}
	$deleteFieldStatement->bind_param('s', $id);
	if(!$deleteFieldStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteFieldSQL, $deleteFieldStatement);
	}
	$deleteFieldStatement->close();

	$deleteCompetencesStatement = $db->prepare($deleteCompetencesSQL);
	if(!$deleteCompetencesStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteCompetencesSQL, $db);
	}
	$deleteCompetencesStatement->bind_param('s', $id);
	if(!$deleteCompetencesStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteCompetencesSQL, $deleteCompetencesStatement);
	}
	$deleteCompetencesStatement->close();

	$deleteStatement = $db->prepare($deleteSQL);
	if(!$deleteStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteSQL, $db);
	}
	$deleteStatement->bind_param('s', $id);
	if(!$deleteStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $deleteStatement);
	}
	$deleteStatement->close();
	$db->commit();
	$db->close();
}

try
{
	OdyMaterialyAPI\administratorTry('delete', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
