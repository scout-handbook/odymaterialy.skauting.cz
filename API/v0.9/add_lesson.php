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

function addCompetences($db, $lessonId, $competences)
{
	$SQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (?, ?);
SQL;

	$statement = $db->prepare($SQL);
	if(!$statement)
	{
		throw new OdyMaterialyAPI\QueryException($SQL, $db);
	}
	foreach($competences as $competence)
	{
		$statement->bind_param('ii', $lessonId, $competence);
		if(!$statement->execute())
		{
			throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
		}
	}
	$statement->close();
}

function add()
{
	if(!isset($_POST['name']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'name');
	}

	$name = $_POST['name'];

	if(isset($_POST['competence']))
	{
		$competences = $_POST['competence'];
	}
	$body = "";
	if(isset($_POST['body']))
	{
		$body = $_POST['body'];
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

	if ($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$SQL = <<<SQL
INSERT INTO lessons (name, body)
VALUES (?, ?);
SQL;

	$statement = $db->prepare($SQL);
	if(!$statement)
	{
		throw new OdyMaterialyAPI\QueryException($SQL, $db);
	}
	$statement->bind_param('ss', $name, $body);
	if(!$statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
	}
	$statement->close();

	$id = $db->insert_id;

	if(isset($competences) and !empty($competences))
	{
		addCompetences($db, $id, $competences);
	}
	$db->close();
}

function reauth()
{
	throw new OdyMaterialyAPI\AuthenticationException();
}

try
{
	OdyMaterialyAPI\editorTry('add', 'reauth', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
