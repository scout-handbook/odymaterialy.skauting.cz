<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonFieldEndpoint = new HandbookAPI\Endpoint();

$updateLessonField = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
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

	$lessonId = HandbookAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	if(isset($data['field']) and $data['field'] !== '')
	{
		$fieldId = HandbookAPI\Helper::parseUuid($data['field'], 'field')->getBytes();
	}

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteSQL);
	$db->bindParam(':lesson_id', $lessonId, PDO::PARAM_STR);
	$db->execute();

	if(isset($fieldId))
	{
		$db->prepare($insertSQL);
		$db->bindParam(':field_id', $fieldId, PDO::PARAM_STR);
		$db->bindParam(':lesson_id', $lessonId, PDO::PARAM_STR);
		$db->execute("lesson or field");
	}
	$db->endTransaction();
	return ['status' => 200];
};
$lessonFieldEndpoint->setUpdateMethod(new HandbookAPI\Role('editor'), $updateLessonField);
