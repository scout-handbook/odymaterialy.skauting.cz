<?php
const _API_EXEC = 1;

header('content-type:text/markdown; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function getLesson()
{
	$SQL = <<<SQL
SELECT body
FROM lessons
WHERE id = ?;
SQL;

	if(!isset($_GET['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::GET, 'id');
	}
	$id = Uuid::fromString($_GET['id'])->getBytes();

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$statement = $db->prepare($SQL);
	if(!$statement)
	{
		throw new OdyMaterialyAPI\QueryException($SQL, $db);
	}
	$statement->bind_param('s', $id);
	if(!$statement->execute())
	{
			throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
	}

	$statement->store_result();
	$body = '';
	$statement->bind_result($body);
	if(!$statement->fetch())
	{
		throw new OdyMaterialyAPI\APIException('No lesson with the id "' . $id . '" found.');
	}
	$statement->close();
	$db->close();
	return $body;
}

try
{
	echo(getLesson());
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo("Požadovanou lekci se nepodařilo načíst. Chybová hláška:\n" . $e);
}
