<?php
const _API_EXEC = 1;

header('content-type:text/markdown; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/AnonymousField.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Field.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Lesson.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');

use Ramsey\Uuid\Uuid;

$endpoint = new OdyMaterialyAPI\Endpoint('lesson');

$listLessons = function($skautis, $data)
{
	$field_sql = <<<SQL
SELECT id, name
FROM fields;
SQL;
	$anonymous_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
LEFT JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id IS NULL;
SQL;
	$lesson_sql = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;
	$competence_sql = <<<SQL
SELECT competences.id, competences.number
FROM competences
JOIN competences_for_lessons ON competences.id = competences_for_lessons.competence_id
WHERE competences_for_lessons.lesson_id = ?
ORDER BY competences.number;
SQL;

	// Select anonymous lessons
	$db = new OdymaterialyAPI\Database();
	$db->prepare($anonymous_sql);
	$db->execute();
	$lesson_id = '';
	$lesson_name = '';
	$lesson_version = '';
	$db->bind_result($lesson_id, $lesson_name, $lesson_version);
	$fields = [new OdymaterialyAPI\AnonymousField()];

	$db->fetch();
	do
	{
		// Create a new Lesson in the newly-created Field
		end($fields)->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

		// Find out the competences this Lesson belongs to
		$db2 = new OdymaterialyAPI\Database();
		$db2->prepare($competence_sql);
		$db2->bind_param('s', $lesson_id);
		$db2->execute();
		$competence_id = '';
		$competence_number = '';
		$db2->bind_result($competence_id, $competence_number);
		end(end($fields)->lessons)->lowestCompetence = 0;
		if($db2->fetch())
		{
			end(end($fields)->lessons)->lowestCompetence = $competence_number;
			end(end($fields)->lessons)->competences[] = $competence_id;
		}
		else
		{
			end(end($fields)->lessons)->lowestCompetence = 0;
		}
		while($db2->fetch())
		{
			end(end($fields)->lessons)->competences[] = $competence_id;
		}
	}
	while($db->fetch());

	// Select all the fields in the database
	$db->prepare($field_sql);
	$db->execute();
	$field_id = '';
	$field_name = '';
	$db->bind_result($field_id, $field_name);

	while($db->fetch())
	{
		$fields[] = new OdyMaterialyAPI\Field($field_id, $field_name); // Create a new field

		// Populate the newly-created Field with its lessons
		$db2 = new OdymaterialyAPI\Database();
		$db2->prepare($lesson_sql);
		$db2->bind_param('s', $field_id);
		$db2->execute();
		$lesson_id = '';
		$lesson_name = '';
		$lesson_version = '';
		$db2->bind_result($lesson_id, $lesson_name, $lesson_version);
		while($db2->fetch())
		{
			// Create a new Lesson in the newly-created Field
			end($fields)->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

			// Find out the competences this Lesson belongs to
			$db3 = new OdymaterialyAPI\Database();
			$db3->prepare($competence_sql);
			$db3->bind_param('s', $lesson_id);
			$db3->execute();
			$competence_id = '';
			$competence_number = '';
			$db3->bind_result($competence_id, $competence_number);
			end(end($fields)->lessons)->lowestCompetence = 0;
			if($db3->fetch())
			{
				end(end($fields)->lessons)->lowestCompetence = $competence_number;
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
			else
			{
				end(end($fields)->lessons)->lowestCompetence = 0;
			}
			while($db3->fetch())
			{
				end(end($fields)->lessons)->competences[] = $competence_id;
			}
		}

		// Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
		usort(end($fields)->lessons, "OdyMaterialyAPI\Lesson_cmp");
	}
	usort($fields, 'OdyMaterialyAPI\Field_cmp'); // Sort all the Fields by lowest competence in the Field low-to-high
	return ['status' => 200, 'result' => $fields];
};
$endpoint->setListMethod(new OdyMaterialyAPI\Role('guest'), $listLessons);

$getLesson = function($skautis, $data)
{
	$SQL = <<<SQL
SELECT body
FROM lessons
WHERE id = ?;
SQL;

	$id = Uuid::fromString($data['id'])->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('s', $id);
	$db->execute();
	$body = '';
	$db->bind_result($body);
	$db->fetch_require('lesson');
	return ['status'=> 200, 'result' => $body];
};
$endpoint->setGetMethod(new OdyMaterialyAPI\Role('guest'), $getLesson);

$endpoint->handle();
