<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');

$updateLesson = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$selectSQL = <<<SQL
SELECT name, body
FROM lessons
WHERE id = :id;
SQL;
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = :id;
SQL;
	$updateSQL = <<<SQL
UPDATE lessons
SET name = :name, version = version + 1, body = :body
WHERE id = :id
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'lesson')->getBytes();
	if(isset($data['name']))
	{
		$name = $data['name'];
	}
	if(isset($data['body']))
	{
		$body = $data['body'];
	}

	$db = new OdyMaterialyAPI\Database();

	if(!isset($name) or !isset($body))
	{
		$db->prepare($selectSQL);
		$db->bindParam(':id', $id);
		$db->execute();
		$origName = '';
		$origBody = '';
		$db->bind_result($origName, $origBody);
		if(!$db->fetch())
		{
			throw new OdyMaterialyAPI\NotFoundException('lesson');
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
	$db->bindParam(':id', $id);
	$db->execute();

	$db->prepare($updateSQL);
	$db->bindParam(':name', $name);
	$db->bindParam(':body', $body);
	$db->bindParam(':id', $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetchRequire('lesson');
	if($count != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("lesson");
	}

	$db->endTransaction();
	return ['status' => 200];
};
