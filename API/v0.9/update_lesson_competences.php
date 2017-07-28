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

function changeCompetences()
{
	$deleteSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;
	$insertSQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (?, ?);
SQL;

	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = $_POST['id'];
	if(isset($_POST['competence']))
	{
		$competences = $_POST['competence'];
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
	$deleteStatement->bind_param('i', $id);
	if(!$deleteStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $deleteStatement);
	}
	$deleteStatement->close();

	if(isset($competences))
	{
		$insertStatement = $db->prepare($insertSQL);
		if(!$insertStatement)
		{
			throw new OdyMaterialyAPI\QueryException($insertSQL, $db);
		}
		$insertStatement->bind_param('ii', $id, $competence);
		foreach($competences as $competence)
		{
			if(!$insertStatement->execute())
			{
				throw new OdyMaterialyAPI\ExecutionException($deleteSQL, $insertStatement);
			}
		}
		$insertStatement->close();
	}
	$db->commit();
	$db->close();
}

try
{
	OdyMaterialyAPI\editorTry('changeCompetences', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
