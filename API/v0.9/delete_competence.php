<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function delete()
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

	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = $_POST['id'];

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}
	$db->autocommit(false);

	$deleteLessonsStatement = $db->prepare($deleteLessonsSQL);
	if(!$deleteLessonsStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteLessonsSQL, $db);
	}
	$deleteLessonsStatement->bind_param('i', $id);
	if(!$deleteLessonsStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteLessonsSQL, $deleteLessonsStatement);
	}
	$deleteLessonsStatement->close();

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
