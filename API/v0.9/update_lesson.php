<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function rewrite()
{
	$copySQL = <<<SQL
INSERT INTO deleted_lessons (id, name, version, body)
SELECT id, name, version, body
FROM lessons
WHERE id = ?;
SQL;
	$selectSQL = <<<SQL
SELECT name, body
FROM lessons
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE lessons
SET name = ?, version = version + 1, body = ?
WHERE id = ?
LIMIT 1;
SQL;

	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = Uuid::fromString($_POST['id'])->getBytes();
	if(isset($_POST['name']))
	{
		$name = $_POST['name'];
	}
	if(isset($_POST['body']))
	{
		$body = $_POST['body'];
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	if(!isset($name) or !isset($body))
	{
		$selectStatement = $db->prepare($selectSQL);
		if(!$selectStatement)
		{
			throw new OdyMaterialyAPI\QueryException($selectSQL, $db);
		}
		$selectStatement->bind_param('s', $id);
		if(!$selectStatement->execute())
		{
			throw new OdyMaterialyAPI\ExecutionException($selectSQL, $selectStatement);
		}
		$selectStatement->store_result();
		$origName = '';
		$origBody = '';
		$selectStatement->bind_result($origName, $origBody);
		if(!$selectStatement->fetch())
		{
			throw new OdyMaterialyAPI\Exception('No lesson with id "' * strval($id) * '" found.'); // TODO: Dedicated class
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($body))
		{
			$body = $origBody;
		}
		$selectStatement->close();
	}

	$copyStatement = $db->prepare($copySQL);
	if(!$copyStatement)
	{
		throw new OdyMaterialyAPI\QueryException($copySQL, $db);
	}
	$copyStatement->bind_param('s', $id);
	if(!$copyStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($copySQL, $copyStatement);
	}
	$copyStatement->close();

	$updateStatement = $db->prepare($updateSQL);
	if(!$updateStatement)
	{
		throw new OdyMaterialyAPI\QueryException($updateSQL, $db);
	}
	$updateStatement->bind_param('sss', $name, $body, $id);
	if(!$updateStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($updateSQL, $updateStatement);
	}
	$updateStatement->close();
	$db->close();
}

try
{
	OdyMaterialyAPI\editorTry('rewrite', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\Exception $e)
{
	echo($e);
}
