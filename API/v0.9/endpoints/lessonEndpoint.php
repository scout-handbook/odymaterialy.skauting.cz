<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/AnonymousField.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Field.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Lesson.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/RoleException.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/accountEndpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonCompetenceEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonFieldEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonPDFEndpoint.php');

use Ramsey\Uuid\Uuid;

$lessonEndpoint = new OdyMaterialyAPI\Endpoint('lesson');
$lessonEndpoint->addSubEndpoint('competence', $lessonCompetenceEndpoint);
$lessonEndpoint->addSubEndpoint('field', $lessonFieldEndpoint);
$lessonEndpoint->addSubEndpoint('pdf', $lessonPDFEndpoint);

function checkLessonGroup($lesson_id, $overrideGroup = false)
{
	global $accountEndpoint;

	$group_sql = <<<SQL
SELECT group_id FROM groups_for_lessons
WHERE lesson_id = ?;
SQL;

	$loginState = $accountEndpoint->call('GET', ['no-avatar' => 'true']);

	if($loginState['status'] == '200')
	{
		if($overrideGroup and in_array($loginState['response']['role'], ['editor', 'administrator', 'superuser']))
		{
			return true;
		}
		$groups = $loginState['response']['groups'];
		$groups[] = '00000000-0000-0000-0000-000000000000';
	}
	else
	{
		$groups = ['00000000-0000-0000-0000-000000000000'];
	}
	array_walk($groups, '\Ramsey\Uuid\Uuid::fromString');

	$db = new OdymaterialyAPI\Database();
	$db->prepare($group_sql);
	$lesson_id = $lesson_id->getBytes();
	$db->bind_param('s', $lesson_id);
	$db->execute();
	$group_id = '';
	$db->bind_result($group_id);
	while($db->fetch())
	{
		if(in_array(Uuid::fromBytes($group_id), $groups))
		{
			return true;
		}
	}
	return false;
}

function populateField($db, $field, $overrideGroup = false)
{
	$competence_sql = <<<SQL
SELECT competences.id, competences.number
FROM competences
JOIN competences_for_lessons ON competences.id = competences_for_lessons.competence_id
WHERE competences_for_lessons.lesson_id = ?
ORDER BY competences.number;
SQL;

	$db->execute();
	$lesson_id = '';
	$lesson_name = '';
	$lesson_version = '';
	$db->bind_result($lesson_id, $lesson_name, $lesson_version);

	while($db->fetch())
	{
		if(checkLessonGroup(Uuid::fromBytes($lesson_id), $overrideGroup))
		{
			// Create a new Lesson in the newly-created Field
			$field->lessons[] = new OdyMaterialyAPI\Lesson($lesson_id, $lesson_name, $lesson_version);

			// Find out the competences this Lesson belongs to
			$db2 = new OdymaterialyAPI\Database();
			$db2->prepare($competence_sql);
			$db2->bind_param('s', $lesson_id);
			$db2->execute();
			$competence_id = '';
			$competence_number = '';
			$db2->bind_result($competence_id, $competence_number);
			end($field->lessons)->lowestCompetence = 0;
			if($db2->fetch())
			{
				end($field->lessons)->lowestCompetence = $competence_number;
				end($field->lessons)->competences[] = $competence_id;
			}
			else
			{
				end($field->lessons)->lowestCompetence = 0;
			}
			while($db2->fetch())
			{
				end($field->lessons)->competences[] = $competence_id;
			}
		}
	}
}

$listLessons = function($skautis, $data, $endpoint)
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

	$overrideGroup = (isset($data['override-group']) and $data['override-group'] == 'true');

	$fields = [new OdymaterialyAPI\AnonymousField()];

	$db = new OdymaterialyAPI\Database();
	$db->prepare($anonymous_sql);
	populateField($db, end($fields), $overrideGroup);

	// Select all the fields in the database
	$db->prepare($field_sql);
	$db->execute();
	$field_id = '';
	$field_name = '';
	$db->bind_result($field_id, $field_name);

	while($db->fetch())
	{
		$fields[] = new OdyMaterialyAPI\Field($field_id, $field_name); // Create a new field

		$db2 = new OdymaterialyAPI\Database();
		$db2->prepare($lesson_sql);
		$db2->bind_param('s', $field_id);
		populateField($db2, end($fields), $overrideGroup);

		// Sort the lessons in the newly-created Field - sorts by lowest competence low-to-high
		usort(end($fields)->lessons, "OdyMaterialyAPI\Lesson_cmp");
	}
	usort($fields, 'OdyMaterialyAPI\Field_cmp'); // Sort all the Fields by lowest competence in the Field low-to-high
	return ['status' => 200, 'response' => $fields];
};
$lessonEndpoint->setListMethod(new OdyMaterialyAPI\Role('guest'), $listLessons);

$getLesson = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
SELECT body
FROM lessons
WHERE id = ?;
SQL;

	$id = $endpoint->parseUuid($data['id']);

	if(!checkLessonGroup($id, true))
	{
		throw new OdymaterialyAPI\RoleException();
	}

	$id = $id->getBytes();

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('s', $id);
	$db->execute();
	$body = '';
	$db->bind_result($body);
	$db->fetch_require('lesson');
	return ['status' => 200, 'response' => $body];
};
$lessonEndpoint->setGetMethod(new OdyMaterialyAPI\Role('guest'), $getLesson);

$addLesson = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO lessons (id, name, body)
VALUES (?, ?, ?);
SQL;

	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $endpoint->xss_sanitize($data['name']);
	$body = '';
	if(isset($data['body']))
	{
		$body = $data['body'];
	}
	$id = Uuid::uuid4()->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('sss', $id, $name, $body);
	$db->execute();
	return ['status' => 201];
};
$lessonEndpoint->setAddMethod(new OdymaterialyAPI\Role('editor'), $addLesson);

$updateLesson = function($skautis, $data, $endpoint)
{
	$selectSQL = <<<SQL
SELECT name, body
FROM lessons
WHERE id = ?;
SQL;
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE lessons
SET name = ?, version = version + 1, body = ?
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();
	if(isset($data['name']))
	{
		$name = $endpoint->xss_sanitize($data['name']);
	}
	if(isset($data['body']))
	{
		$body = $data['body'];
	}

	$db = new OdymaterialyAPI\Database();

	if(!isset($name) or !isset($body))
	{
		$db->prepare($selectSQL);
		$db->bind_param('s', $id);
		$db->execute();
		$origName = '';
		$origBody = '';
		$db->bind_result($origName, $origBody);
		if(!$db->fetch())
		{
			throw new OdymaterialyAPI\NotFoundException('lesson');
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($body))
		{
			$body = $origBody;
		}
	}

	$db->start_transaction();

	$db->prepare($copySQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($updateSQL);
	$db->bind_param('sss', $name, $body, $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('lesson');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("lesson");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$lessonEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('editor'), $updateLesson);

$deleteLesson = function($skautis, $data, $endpoint)
{
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = ?;
SQL;
	$deleteFieldSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = ?;
SQL;
	$deleteCompetencesSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM lessons
WHERE id = ?;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($copySQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteFieldSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteCompetencesSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('lesson');
	if($count != 1)
	{
		throw new OdymaterialyAPI\NotFoundException("lesson");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
$lessonEndpoint->setDeleteMethod(new OdymaterialyAPI\Role('administrator'), $deleteLesson);
