<?php
const _API_EXEC = 1;

require_once('internal/skautisTry.php');
require_once('internal/database.secret.php');

function rewrite()
{
	if(!isset($_POST['id']))
	{
		throw new Exception('POST argument "id" must be provided.');
	}

	$id = $_POST['id'];

	if(isset($_POST['name']))
	{
		$name = $_POST['name'];
	}
	if(isset($_POST['competence']))
	{
		$competences = $_POST['competence'];
	}
	if(isset($_POST['body']))
	{
		$body = $_POST['body'];
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

	if ($db->connect_error)
	{
		throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}

	$selectSQL = <<<SQL
SELECT name, body FROM lessons WHERE id = ?;
SQL;

	$updateSQL = <<<SQL
UPDATE lessons
SET name = ?, version = version + 1, body = ?
WHERE id = ?;
SQL;

	$deleteCompetencesSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;
	$insertCompetencesSQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (?, ?);
SQL;

	if(!isset($name) or !isset($body))
	{
		$selectStatement = $db->prepare($selectSQL);
		if($selectStatement === false)
		{
			throw new Exception('Invalid SQL: "' . $selectSQL . '". Error: ' . $db->error);
		}
		$selectStatement->bind_param('i', $id);
		$selectStatement->execute();
		$selectStatement->store_result();
		$origName = '';
		$origBody = '';
		$selectStatement->bind_result($origName, $origBody);
		if(!$selectStatement->fetch())
		{
			throw new Exception('No lesson with id "' * strval($id) * '" found.');
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($body))
		{
			$body = $origBody;
		}
		$selectStatement->close();
	}

	$updateStatement = $db->prepare($updateSQL);
	if($updateStatement === false)
	{
		throw new Exception('Invalid SQL: "' . $updateSQL . '". Error: ' . $db->error);
	}
	$updateStatement->bind_param('ssi', $name, $body, $id);
	$updateStatement->execute();
	$updateStatement->close();

	if(isset($competences))
	{
		$deleteStatement = $db->prepare($deleteCompetencesSQL);
		if($deleteStatement === false)
		{
			throw new Exception('Invalid SQL: "' . $deleteCompetencesSQL . '". Error: ' . $db->error);
		}
		$deleteStatement->bind_param('i', $id);
		$deleteStatement->execute();
		$deleteStatement->close();

		if(!empty($competences))
		{
			$insertStatement = $db->prepare($insertCompetencesSQL);
			if($insertStatement === false)
			{
				throw new Exception('Invalid SQL: "' . $insertCompetencesSQL . '". Error: ' . $db->error);
			}
			foreach($competences as $competence)
			{
				$insertStatement->bind_param('ii', $id, $competence);
				$insertStatement->execute();
			}
			$insertStatement->close();
		}
	}
	$db->close();
	echo(json_encode(array('success' => true)));
}

function reauth()
{
	echo(json_encode(array('success' => false)));
}

OdyMaterialyAPI\skautisTry('rewrite', 'reauth', true);
