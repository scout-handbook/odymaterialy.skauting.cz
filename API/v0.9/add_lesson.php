<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

function addCompetences($db, $lessonId, $competences)
{
	$insertSQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (?, ?);
SQL;

	$insertStatement = $db->prepare($insertSQL);
	if($insertStatement === false)
	{
		throw new Exception('Invalid SQL: "' . $insertSQL . '". Error: ' . $db->error);
	}
	foreach($competences as $competence)
	{
		$insertStatement->bind_param('ii', $lessonId, $competence);
		$insertStatement->execute();
	}
	$insertStatement->close();
}

function add()
{
	if(!isset($_POST['name']))
	{
		throw new Exception('POST argument "name" must be provided.');
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
		throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}

	$insertSQL = <<<SQL
INSERT INTO lessons (name, body)
VALUES (?, ?);
SQL;

	$insertStatement = $db->prepare($insertSQL);
	if($insertStatement === false)
	{
		throw new Exception('Invalid SQL: "' . $insertSQL . '". Error: ' . $db->error);
	}
	$insertStatement->bind_param('ss', $name, $body);
	$insertStatement->execute();
	$insertStatement->close();

	$id = $db->insert_id;

	if(isset($competences) and !empty($competences))
	{
		addCompetences($db, $id, $competences);
	}
	$db->close();
	echo(json_encode(array('success' => true)));
}

function reauth()
{
	echo(json_encode(array('success' => false)));
}

OdyMaterialyAPI\editorTry('add', 'reauth', true);
