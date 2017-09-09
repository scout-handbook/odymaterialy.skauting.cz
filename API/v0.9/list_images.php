<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function listImages()
{
	$SQL = <<<SQL
SELECT id
FROM images
ORDER BY time DESC;
SQL;

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
	if(!$statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
	}

	$statement->store_result();
	$id = '';
	$statement->bind_result($id);
	$images = array();
	while($statement->fetch())
	{
		$images[] = Uuid::fromBytes($id)->__toString();
	}
	$statement->close();
	$db->close();
	echo(json_encode($images, JSON_UNESCAPED_UNICODE));
}

try
{
	OdyMaterialyAPI\editorTry('listImages', true);
}
catch(OdymaterialyAPI\APIException $e)
{
	echo($e);
}
