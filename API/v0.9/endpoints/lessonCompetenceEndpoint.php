<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonCompetenceEndpoint = new OdyMaterialyAPI\Endpoint();

$updateLessonCompetence = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = :lesson_id;
SQL;
	$insertSQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (:lesson_id, :competence_id);
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['parent-id'], 'lesson')->getBytes();
	$competences = [];
	if(isset($data['competence']))
	{
		foreach($data['competence'] as $competence)
		{
			$competences[] = OdyMaterialyAPI\Helper::parseUuid($competence, 'competence')->getBytes();
		}
	}

	$db = new OdyMaterialyAPI\Database();
	$db->beginTransaction();

	$db->prepare($deleteSQL);
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();

	if(isset($competences))
	{
		$db->prepare($insertSQL);
		foreach($competences as $competence)
		{
			$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
			$db->bindParam(':competence_id', $competence, PDO::PARAM_STR);
			$db->execute("lesson or competence");
		}
	}
	$db->endTransaction();
	return ['status' => 200];
};
$lessonCompetenceEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('editor'), $updateLessonCompetence);
