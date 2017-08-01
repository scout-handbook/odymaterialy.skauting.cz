<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/AnonymousField.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Field.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Lesson.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function listLessons()
{
	$field_sql = <<<SQL
SELECT id, name
FROM fields;
SQL;
	$lesson_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;
	$anonymous_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
LEFT JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id IS NULL;
SQL;
	$competence_sql = <<<SQL
SELECT competences.id, competences.number
FROM competences
JOIN competences_for_lessons ON competences.id = competences_for_lessons.competence_id
WHERE competences_for_lessons.lesson_id = ?
ORDER BY competences.number;
SQL;

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	// Select anonymous lessons
	$anonymous_statement = $db->prepare($anonymous_sql);
	if(!$anonymous_statement)
	{
		throw new OdyMaterialyAPI\QueryException($anonymous_sql, $db);
	}
	if(!$anonymous_statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($anonymous_sql, $anonymous_statement);
	}

	$anonymous_statement->store_result();
	$fields = array();
	$lesson_id = '';
	$lesson_name = '';
	$lesson_version = '';
	$anonymous_statement->bind_result($lesson_id, $lesson_name, $lesson_version);
	$fields[] = new OdymaterialyAPI\AnonymousField();
	if($anonymous_statement->fetch())
	{
		do
		{
			// Create a new Lesson in the newly-created Field
			end($fields)->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

			// Find out the competences this Lesson belongs to
			$competence_statement = $db->prepare($competence_sql);
			if(!$competence_statement)
			{
				throw new OdyMaterialyAPI\QueryException($competence_sql, $db);
			}
			$competence_statement->bind_param('s', $lesson_id);
			if(!$competence_statement->execute())
			{
				throw new OdyMaterialyAPI\ExecutionException($competence_sql, $competence_statement);
			}

			$competence_id = '';
			$competence_statement->bind_result($competence_id, $competence_number);
			if($competence_statement->fetch())
			{
				end(end($fields)->lessons)->lowestCompetence = $competence_number;
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
			else
			{
				end(end($fields)->lessons)->lowestCompetence = 0;
			}
			while($competence_statement->fetch())
			{
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
			$competence_statement->close();
		}
		while($anonymous_statement->fetch());
	}

	// Select all the fields in the database
	$field_statement = $db->prepare($field_sql);
	if(!$field_statement)
	{
		throw new OdyMaterialyAPI\QueryException($field_sql, $db);
	}
	if(!$field_statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($field_sql, $field_statement);
	}

	$field_statement->store_result();
	$field_id = '';
	$field_name = '';
	$field_statement->bind_result($field_id, $field_name);
	while($field_statement->fetch())
	{
		$fields[] = new OdyMaterialyAPI\Field($field_id, $field_name); // Create a new field

		// Populate the newly-created Field with its lessons
		$lesson_statement = $db->prepare($lesson_sql);
		if(!$lesson_statement)
		{
			throw new OdyMaterialyAPI\QueryException($lesson_sql, $db);
		}
		$lesson_statement->bind_param('i', $field_id);
		if(!$lesson_statement->execute())
		{
			throw new OdyMaterialyAPI\ExecutionException($lesson_sql, $lesson_statement);
		}

		$lesson_statement->store_result();
		$lesson_statement->bind_result($lesson_id, $lesson_name, $lesson_version);
		while($lesson_statement->fetch())
		{
			// Create a new Lesson in the newly-created Field
			end($fields)->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

			// Find out the competences this Lesson belongs to

			$competence_statement = $db->prepare($competence_sql);
			if(!$competence_statement)
			{
				throw new OdyMaterialyAPI\QueryException($competence_sql, $db);
			}
			$competence_statement->bind_param('s', $lesson_id);
			if(!$competence_statement->execute())
			{
				throw new OdyMaterialyAPI\ExecutionException($competence_sql, $competence_statement);
			}

			$competence_id = '';
			$competence_statement->bind_result($competence_id, $competence_number);
			if($competence_statement->fetch())
			{
				end(end($fields)->lessons)->lowestCompetence = $competence_number;
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
			else
			{
				end(end($fields)->lessons)->lowestCompetence = 0;
			}
			while($competence_statement->fetch())
			{
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
			$competence_statement->close();
		}
		$lesson_statement->close();

		// Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
		usort(end($fields)->lessons, "OdyMaterialyAPI\Lesson_cmp");
	}
	$field_statement->close();
	$db->close();
	usort($fields, 'OdyMaterialyAPI\Field_cmp'); // Sort all the Fields by lowest competence in the Field low-to-high
	return json_encode($fields, JSON_UNESCAPED_UNICODE);
}

try
{
	echo(listLessons());
}
catch(OdymaterialyAPI\APIException $e)
{
	echo('[]'); // TODO: Error handling
}
