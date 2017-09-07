<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

use Ramsey\Uuid\Uuid;

function moveLesson()
{
	$deleteSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = ?
LIMIT 1;
SQL;
	$insertSQL = <<<SQL
INSERT INTO lessons_in_fields (field_id, lesson_id)
VALUES (?, ?);
SQL;

	if(!isset($_POST['lesson-id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'lesson-id');
	}
	$lessonId = Uuid::fromString($_POST['lesson-id'])->getBytes();
	if(isset($_POST['field-id']))
	{
		$fieldId = Uuid::fromString($_POST['field-id'])->getBytes();
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}
	$db->autocommit(false);

	$deleteStatement = $db->prepare($deleteSQL);
	if(!$deleteStatement)
	{
		throw new OdyMaterialyAPI\QueryException($deleteSQL, $db);
	}
	$deleteStatement->bind_param('s', $lessonId);
	if(!$deleteStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $deleteStatement);
	}
	$deleteStatement->close();

	if(isset($fieldId))
	{
		$insertStatement = $db->prepare($insertSQL);
		if(!$insertStatement)
		{
			throw new OdyMaterialyAPI\QueryException($insertSQL, $db);
		}
		$insertStatement->bind_param('ss', $fieldId, $lessonId);
		if(!$insertStatement->execute())
		{
			throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $insertStatement);
		}
		$insertStatement->close();
	}
	$db->commit();
	$db->close();
}

try
{
	OdyMaterialyAPI\editorTry('moveLesson', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
