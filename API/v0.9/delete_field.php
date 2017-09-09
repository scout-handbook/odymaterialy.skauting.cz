<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function delete()
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

	$deleteLessonsStatement = $db->prepare($deleteLessonsSQL);
	if(!$deleteLessonsStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteLessonsSQL, $db);
	}
	$deleteLessonsStatement->bind_param('s', $id);
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
catch(OdyMaterialyAPI\Exception $e)
{
	echo($e);
}
