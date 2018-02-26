<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/DeletedLesson.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$deletedLessonEndpoint = new HandbookAPI\Endpoint();

$listDeletedLessons = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT a.id, a.name
FROM lesson_history a
LEFT JOIN lessons ON a.id = lessons.id # Only deleted lessons
LEFT JOIN lesson_history b ON a.id = b.id AND a.version < b.version # Only most recent version
WHERE lessons.id IS NULL AND b.id IS NULL;
SQL;

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$lessons = [];
	$id = '';
	$name = '';
	$db->bindColumn('id', $id);
	$db->bindColumn('name', $name);

	while($db->fetch())
	{
		$lessons[] = new HandbookAPI\DeletedLesson($id, $name);
	}

	return ['status' => 200, 'response' => $lessons];
};
$deletedLessonEndpoint->setListMethod(new HandbookAPI\Role('administrator'), $listDeletedLessons);
