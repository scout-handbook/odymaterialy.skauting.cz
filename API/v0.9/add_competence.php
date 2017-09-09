<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

use Ramsey\Uuid\Uuid;

function addCompetence()
{
	$SQL = <<<SQL
INSERT INTO competences (id, number, name, description)
VALUES (?, ?, ?, ?);
SQL;

	if(!isset($_POST['number']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'number');
	}
	$number = $_POST['number'];
	if(!isset($_POST['name']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'name');
	}
	$name = $_POST['name'];
	$description = '';
	if(isset($_POST['description']))
	{
		$description = $_POST['description'];
	}

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
	$uuid = Uuid::uuid4()->getBytes();
	$statement->bind_param('siss', $uuid, $number, $name, $description);
	if(!$statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
	}
	$statement->close();
	$db->close();
}

try
{
	OdyMaterialyAPI\administratorTry('addCompetence', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
