<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');

$updateLesson = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$selectSQL = <<<SQL
SELECT name, body
FROM lessons
WHERE id = ?;
SQL;
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE lessons
SET name = ?, version = version + 1, body = ?
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = $endpoint->parseUuid($data['id'])->getBytes();
	if(isset($data['name']))
	{
		$name = $endpoint->xssSanitize($data['name']);
	}
	if(isset($data['body']))
	{
		$body = $data['body'];
	}

	$db = new OdyMaterialyAPI\Database();

	if(!isset($name) or !isset($body))
	{
		$db->prepare($selectSQL);
		$db->bind_param('s', $id);
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

	$db->start_transaction();

	$db->prepare($copySQL);
	$db->bind_param('s', $id);
	$db->execute();

	$db->prepare($updateSQL);
	$db->bind_param('sss', $name, $body, $id);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('lesson');
	if($count != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("lesson");
	}

	$db->finish_transaction();
	return ['status' => 200];
};
