<?php
const _API_EXEC = 1;

require_once(__DIR__ . '/config.php');

$db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);

if($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

$field_sql = <<<SQL
SELECT * FROM fields;
SQL;

$lesson_sql = <<<SQL
SELECT lessons.id, lessons.name FROM lessons
JOIN lessons_in_fields on lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;

$competence_sql = <<<SQL
SELECT competence FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;

$field_statement = $db->prepare($field_sql);
if($field_statement === false)
{
	throw new Exception('Invalid SQL: "' . $field_sql . '". Error: ' . $db->error);
}
$field_statement->execute();

$field_statement->store_result();
$field_statement->bind_result($field_id, $field_name);
while($field_statement->fetch())
{
	echo('ID: ' . $field_id . "\nName: " . $field_name . "\n");

	$lesson_statement = $db->prepare($lesson_sql);
	if($lesson_statement === false)
	{
		throw new Exception('Invalid SQL: "' . $lesson_sql . '". Error: ' . $db->error);
	}
	$lesson_statement->bind_param('i', $field_id);
	$lesson_statement->execute();

	$lesson_statement->store_result();
	$lesson_statement->bind_result($lesson_id, $lesson_name);
	while($lesson_statement->fetch())
	{
		echo("\tID: " . $lesson_id . "\n\tName: " . $lesson_name . "\n");

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
			echo("\t\tCompetence: " . $competence . "\n");
		}
	}
	$lesson_statement->close();
}
$field_statement->close();

$db->close();
?>
