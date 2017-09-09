<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Competence.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

function listCompetences()
{
	$SQL = <<<SQL
SELECT id, number, name, description
FROM competences
ORDER BY number;
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
	$number = '';
	$name = '';
	$description = '';
	$statement->bind_result($id, $number, $name, $description);
	$competences = array();
	while($statement->fetch())
	{
		$competences[] = new OdyMaterialyAPI\Competence($id, $number, $name, $description); // Create a new field
	}
	$statement->close();
	$db->close();
	return json_encode($competences, JSON_UNESCAPED_UNICODE);
}

try
{
	echo(listCompetences());
}
catch(OdyMaterialyAPI\Exception $e)
{
	echo('[]'); // TODO: Error handling
}
