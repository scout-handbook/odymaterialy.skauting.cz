<?php
@_API_EXEC === 1 or die('Restricted access.');

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
	if(isset($data['id']))
	{
		$fieldId = $data['id']->getBytes();
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
