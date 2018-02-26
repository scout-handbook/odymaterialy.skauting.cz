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
SELECT lesson_history.id, lesson_history.name
FROM lesson_history
LEFT JOIN lessons ON lesson_history.id = lessons.id
WHERE lessons.id IS NULL;
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
