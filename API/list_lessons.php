<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once('internal/database.secret.php');
require_once('internal/Field.php');
require_once('internal/Lesson.php');
require_once('internal/SimpleCompetence.php');

// Prepared statements where ? will be replaced later

$field_sql = <<<SQL
SELECT id, name FROM fields;
SQL;

$lesson_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version FROM lessons
JOIN lessons_in_fields on lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;

$competence_sql = <<<SQL
SELECT competences.id, competences.number FROM competences
JOIN competences_for_lessons on competences.id = competences_for_lessons.competence_id
WHERE competences_for_lessons.lesson_id = ?
ORDER BY competences.number;
SQL;

// Open database connection

$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

if ($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

// Select all the fields in the database

$field_statement = $db->prepare($field_sql);
if ($field_statement === false)
{
	throw new Exception('Invalid SQL: "' . $field_sql . '". Error: ' . $db->error);
}
$field_statement->execute();

$field_statement->store_result();
$field_id = '';
$field_name = '';
$field_statement->bind_result($field_id, $field_name);
$fields = array();
while ($field_statement->fetch())
{
	$fields[] = new OdyMaterialyAPI\Field($field_name); // Create a new field

	// Populate the newly-created Field with its lessons

	$lesson_statement = $db->prepare($lesson_sql);
	if ($lesson_statement === false)
	{
		throw new Exception('Invalid SQL: "' . $lesson_sql . '". Error: ' . $db->error);
	}
	$lesson_statement->bind_param('i', $field_id);
	$lesson_statement->execute();

	$lesson_statement->store_result();
	$lesson_id = '';
	$lesson_name = '';
	$lesson_version = '';
	$lesson_statement->bind_result($lesson_id, $lesson_name, $lesson_version);
	while ($lesson_statement->fetch())
	{
		// Create a new Lesson in the newly-created Field
		end($fields)->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

		// Find out the competences this Lesson belongs to

		$competence_statement = $db->prepare($competence_sql);
		if ($competence_statement === false)
		{
			throw new Exception('Invalid SQL: "' . $competence_sql . '". Error: ' . $db->error);
		}
		$competence_statement->bind_param('i', $lesson_id);
		$competence_statement->execute();

		$competence_id = '';
		$competence_number = '';
		$competence_statement->bind_result($competence_id, $competence_number);
		while ($competence_statement->fetch())
		{
			end(end($fields)->lessons)->competences[] =
				new OdyMaterialyAPI\SimpleCompetence($competence_id, $competence_number);
		}
		$competence_statement->close();
	}
	$lesson_statement->close();
	// Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
	usort(end($fields)->lessons, "OdyMaterialyAPI\Lesson_cmp");
}
$field_statement->close();
$db->close();
usort($fields, "OdyMaterialyAPI\Field_cmp"); // Sort all the Fields by lowest competence in the Field low-to-high

echo(json_encode($fields, JSON_UNESCAPED_UNICODE));
