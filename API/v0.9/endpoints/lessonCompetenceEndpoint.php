<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$lessonCompetenceEndpoint = new OdyMaterialyAPI\Endpoint('competence');

$updateLessonCompetence = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$deleteSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = ?;
SQL;
	$insertSQL = <<<SQL
INSERT INTO competences_for_lessons (lesson_id, competence_id)
VALUES (?, ?);
SQL;

	$id = $endpoint->parseUuid($data['parent-id'])->getBytes();
	$competences = [];
	if(isset($data['competence']))
	{
		foreach($data['competence'] as $competence)
		{
			$competences[] = $endpoint->parseUuid($competence)->getBytes();
		}
	}

	$db = new OdyMaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($deleteSQL);
	$db->bind_param('s', $id);
	$db->execute();

	if(isset($competences))
	{
		$db->prepare($insertSQL);
		foreach($competences as $competence)
		{
			$db->bind_param('ss', $id, $competence);
			$db->execute("lesson or competence");
		}
	}
	$db->finish_transaction();
	return ['status' => 200];
};
$lessonCompetenceEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('editor'), $updateLessonCompetence);
