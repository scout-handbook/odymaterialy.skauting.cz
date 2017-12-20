<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/AnonymousField.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Field.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Lesson.php');

use Ramsey\Uuid\Uuid;

function populateField(OdyMaterialyAPI\Database $db, $field, bool $overrideGroup = false) : void
{
	$competenceSQL = <<<SQL
SELECT competences.id, competences.number
FROM competences
JOIN competences_for_lessons ON competences.id = competences_for_lessons.competence_id
WHERE competences_for_lessons.lesson_id = ?
ORDER BY competences.number;
SQL;

	$db->execute();
	$lessonId = '';
	$lessonName = '';
	$lessonVersion = '';
	$db->bind_result($lessonId, $lessonName, $lessonVersion);

	while($db->fetch())
	{
		if(checkLessonGroup(Uuid::fromBytes($lessonId), $overrideGroup))
		{
			// Create a new Lesson in the newly-created Field
			$field->lessons[] = new OdyMaterialyAPI\Lesson($lessonId, $lessonName, $lessonVersion);

			// Find out the competences this Lesson belongs to
			$db2 = new OdyMaterialyAPI\Database();
			$db2->prepare($competenceSQL);
			$db2->bind_param('s', $lessonId);
			$db2->execute();
			$competenceId = '';
			$competenceNumber = '';
			$db2->bind_result($competenceId, $competenceNumber);
			end($field->lessons)->lowestCompetence = 0;
			if($db2->fetch())
			{
				end($field->lessons)->lowestCompetence = intval($competenceNumber);
				end($field->lessons)->competences[] = $competenceId;
			}
			else
			{
				end($field->lessons)->lowestCompetence = 0;
			}
			while($db2->fetch())
			{
				end($field->lessons)->competences[] = $competenceId;
			}
		}
	}
}

$listLessons = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$fieldSQL = <<<SQL
SELECT id, name
FROM fields;
SQL;
	$anonymousSQL = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
LEFT JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id IS NULL;
SQL;
	$lessonSQL = <<<SQL
SELECT lessons.id, lessons.name, lessons.version
FROM lessons
JOIN lessons_in_fields ON lessons.id = lessons_in_fields.lesson_id
WHERE lessons_in_fields.field_id = ?;
SQL;

	$overrideGroup = (isset($data['override-group']) and $data['override-group'] == 'true');

	$fields = [new OdyMaterialyAPI\AnonymousField()];

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($anonymousSQL);
	populateField($db, end($fields), $overrideGroup);

	// Select all the fields in the database
	$db->prepare($fieldSQL);
	$db->execute();
	$field_id = '';
	$field_name = '';
	$db->bind_result($field_id, $field_name);

	while($db->fetch())
	{
		$fields[] = new OdyMaterialyAPI\Field($field_id, $field_name); // Create a new field

		$db2 = new OdyMaterialyAPI\Database();
		$db2->prepare($lessonSQL);
		$db2->bind_param('s', $field_id);
		populateField($db2, end($fields), $overrideGroup);

		// Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
		usort(end($fields)->lessons, "OdyMaterialyAPI\Lesson_cmp");
	}
	usort($fields, 'OdyMaterialyAPI\Field_cmp'); // Sort all the Fields by lowest competence in the Field low-to-high
	return ['status' => 200, 'response' => $fields];
};
