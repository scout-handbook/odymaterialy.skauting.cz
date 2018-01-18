<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonFieldEndpoint = new OdyMaterialyAPI\Endpoint();

$updateLessonField = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = :lesson_id
LIMIT 1;
SQL;
	$insertSQL = <<<SQL
INSERT INTO lessons_in_fields (field_id, lesson_id)
VALUES (:field_id, :lesson_id);
SQL;

	$lessonId = OdyMaterialyAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	if(isset($data['field']) and $data['field'] !== '')
	{
		$fieldId = OdyMaterialyAPI\Helper::parseUuid($data['field'], 'field')->getBytes();
	}

	$db = new OdyMaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteSQL);
	$db->bindParam(':lesson_id', $lessonId);
	$db->execute();

	if(isset($fieldId))
	{
		$db->prepare($insertSQL);
		$db->bindParam(':field_id', $fieldId);
		$db->bindParam(':lesson_id', $lessonId);
		$db->execute("lesson or field");
	}
	$db->finish_transaction();
	return ['status' => 200];
};
$lessonFieldEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('editor'), $updateLessonField);
