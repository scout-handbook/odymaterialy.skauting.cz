<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Helper.php');

require_once($BASEPATH . '/v0.9/internal/exceptions/NotFoundException.php');

$updateLesson = function(Skautis\Skautis $skautis, array $data) : array
{
	$selectSQL = <<<SQL
SELECT name, body
FROM lessons
WHERE id = :id;
SQL;
	$copySQL = <<<SQL
INSERT INTO lesson_history (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = :id;
SQL;
	$updateSQL = <<<SQL
UPDATE lessons
SET name = :name, version = CURRENT_TIMESTAMP(3), body = :body
WHERE id = :id
LIMIT 1;
SQL;

	$id = HandbookAPI\Helper::parseUuid($data['id'], 'lesson')->getBytes();
	if(isset($data['name']))
	{
		$name = $data['name'];
	}
	if(isset($data['body']))
	{
		$body = $data['body'];
	}

	$db = new HandbookAPI\Database();

	if(!isset($name) or !isset($body))
	{
		$db->prepare($selectSQL);
		$db->bindParam(':id', $id, PDO::PARAM_STR);
		$db->execute();
		$origName = '';
		$origBody = '';
		$db->bindColumn('name', $origName);
		$db->bindColumn('body', $origBody);
		if(!$db->fetch())
		{
			throw new HandbookAPI\NotFoundException('lesson');
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($body))
		{
			$body = $origBody;
		}
	}

	$db->beginTransaction();

	$db->prepare($copySQL);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($updateSQL);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->bindParam(':body', $body, PDO::PARAM_STR);
	$db->bindParam(':id', $id, PDO::PARAM_STR);
	$db->execute();

	if($db->rowCount() != 1)
	{
		throw new HandbookAPI\NotFoundException("lesson");
	}

	$db->endTransaction();
	return ['status' => 200];
};
