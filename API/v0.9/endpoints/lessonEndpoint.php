<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/accountEndpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonEndpoint/list.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonEndpoint/get.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonEndpoint/add.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonEndpoint/update.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonEndpoint/delete.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonCompetenceEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonFieldEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonGroupEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/lessonPDFEndpoint.php');

use Ramsey\Uuid\Uuid;

$lessonEndpoint = new OdyMaterialyAPI\Endpoint('lesson');
$lessonEndpoint->addSubEndpoint('competence', $lessonCompetenceEndpoint);
$lessonEndpoint->addSubEndpoint('field', $lessonFieldEndpoint);
$lessonEndpoint->addSubEndpoint('group', $lessonGroupEndpoint);
$lessonEndpoint->addSubEndpoint('pdf', $lessonPDFEndpoint);

function checkLessonGroup(Uuid $lessonId, bool $overrideGroup = false) : bool
{
	global $accountEndpoint;

	$groupSQL = <<<SQL
SELECT group_id FROM groups_for_lessons
WHERE lesson_id = ?;
SQL;

	$loginState = $accountEndpoint->call('GET', new OdyMaterialyAPI\Role('guest'), ['no-avatar' => 'true']);

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

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($groupSQL);
	$lessonId = $lessonId->getBytes();
	$db->bind_param('s', $lessonId);
	$db->execute();
	$groupId = '';
	$db->bind_result($groupId);
	while($db->fetch())
	{
		if(in_array(Uuid::fromBytes($groupId), $groups))
		{
			return true;
		}
	}
	return false;
}

$lessonEndpoint->setListMethod(new OdyMaterialyAPI\Role('guest'), $listLessons);
$lessonEndpoint->setGetMethod(new OdyMaterialyAPI\Role('guest'), $getLesson);
$lessonEndpoint->setAddMethod(new OdyMaterialyAPI\Role('editor'), $addLesson);
$lessonEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('editor'), $updateLesson);
$lessonEndpoint->setDeleteMethod(new OdyMaterialyAPI\Role('administrator'), $deleteLesson);
