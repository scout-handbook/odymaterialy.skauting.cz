<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/AuthenticationException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function delete()
{
	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = $_POST['id'];

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if ($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$copySQL = <<<SQL
INSERT INTO deleted_lessons (name, body)
SELECT name, body
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

	$copyStatement = $db->prepare($copySQL);
	if(!$copyStatement)
	{
		throw new OdyMaterialyAPI\QueryException($copySQL, $db);
	}
	$copyStatement->bind_param('i', $id);
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
	$deleteFieldStatement->bind_param('i', $id);
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
	$deleteCompetencesStatement->bind_param('i', $id);
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
	$deleteStatement->bind_param('i', $id);
	if(!$deleteStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $deleteStatement);
	}
	$deleteStatement->close();
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
