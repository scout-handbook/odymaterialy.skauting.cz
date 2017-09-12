<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

use Ramsey\Uuid\Uuid;

$lessonFieldEndpoint = new OdyMaterialyAPI\Endpoint('field');

$updateLessonField = function($skautis, $data)
{
	$deleteSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = ?
LIMIT 1;
SQL;
	$insertSQL = <<<SQL
INSERT INTO lessons_in_fields (field_id, lesson_id)
VALUES (?, ?);
SQL;

	$lessonId = $data['parent-id']->getBytes();
	if(isset($data['field']) and $data['field'] !== '')
	{
		$fieldId = Uuid::fromString($data['field'])->getBytes();
	}

	$db = new OdymaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $lessonId);
	$db->execute();

	if(isset($fieldId))
	{
		$db->prepare($insertSQL);
		$db->bind_param('ss', $fieldId, $lessonId);
		$db->execute();
	}
	$db->finish_transaction();
	return ['status' => 200];
};
$lessonFieldEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('editor'), $updateLessonField);
