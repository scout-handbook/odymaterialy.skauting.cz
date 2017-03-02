<?php
const _API_EXEC = 1; // Required by includes

require_once(__DIR__ . '/config.php');
require_once(__DIR__ . '/Field.php');
require_once(__DIR__ . '/Lesson.php');

// Prepared statements where ? will be replaced later

$field_sql = <<<SQL
SELECT * FROM fields;
SQL;

$lesson_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version FROM lessons
JOIN lessons_in_fields on lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;

$competence_sql = <<<SQL
SELECT competence FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;

// Open database connection

$db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);

if($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

// Select all the fields in the database

$field_statement = $db->prepare($field_sql);
if($field_statement === false)
{
	throw new Exception('Invalid SQL: "' . $field_sql . '". Error: ' . $db->error);
}
$field_statement->execute();

$field_statement->store_result();
$field_statement->bind_result($field_id, $field_name);
$fields = array();
while($field_statement->fetch())
{
	$fields[] = new OdyMaterialy\Field($field_name); // Create a new field

	// Populate the newly-created Field with its lessons

	$lesson_statement = $db->prepare($lesson_sql);
	if($lesson_statement === false)
	{
		throw new Exception('Invalid SQL: "' . $lesson_sql . '". Error: ' . $db->error);
	}
	$lesson_statement->bind_param('i', $field_id);
	$lesson_statement->execute();

	$lesson_statement->store_result();
	$lesson_statement->bind_result($lesson_id, $lesson_name, $lesson_version);
	while($lesson_statement->fetch())
	{
		end($fields)->lessons[] = new OdyMaterialy\Lesson($lesson_name, $lesson_version); // Create a new Lesson in the newly-created Field

		// Find out the competences this Lesson belongs to

		$competence_statement = $db->prepare($competence_sql);
		if($competence_statement === false)
		{
			throw new Exception('Invalid SQL: "' . $competence_sql . '". Error: ' . $db->error);
		}
		$competence_statement->bind_param('i', $lesson_id);
		$competence_statement->execute();

		$competence_statement->bind_result($competence);
		while($competence_statement->fetch())
		{
			end(end($fields)->lessons)->competences[] = $competence;
		}
		$competence_statement->close();
		sort(end(end($fields)->lessons)->competences, SORT_NUMERIC); // Sort the competence list for the newly-created Lesson low-to-high
	}
	$lesson_statement->close();
	usort(end($fields)->lessons, "OdyMaterialy\Lesson_cmp"); // Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
}
$field_statement->close();
$db->close();
usort($fields, "OdyMaterialy\Field_cmp"); // Sort all the Fields by lowest competence in the Field low-to-high

echo(json_encode($fields, JSON_UNESCAPED_UNICODE));
?>
