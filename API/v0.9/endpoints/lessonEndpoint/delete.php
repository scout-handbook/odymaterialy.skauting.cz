<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');

$deleteLesson = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = :id;
SQL;
	$deleteFieldSQL = <<<SQL
DELETE FROM lessons_in_fields
WHERE lesson_id = :lesson_id;
SQL;
	$deleteCompetencesSQL = <<<SQL
DELETE FROM competences_for_lessons
WHERE lesson_id = :lesson_id;
SQL;
	$deleteGroupsSQL = <<<SQL
DELETE FROM groups_for_lessons
WHERE lesson_id = :lesson_id;
SQL;
	$deleteSQL = <<<SQL
DELETE FROM lessons
WHERE id = :id;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'lesson')->getBytes();

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($copySQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteFieldSQL);
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteCompetencesSQL);
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteGroupsSQL);
	$db->bindParam(':lesson_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($deleteSQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new HandbookAPI\NotFoundException("lesson");
	}

	$db->endTransaction();
	return ['status' => 200];
};
