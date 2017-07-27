<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function updateUser($skautis)
{
	$updateUserSQL = <<<SQL
INSERT INTO users (id, name) values (?, ?)
ON DUPLICATE KEY UPDATE name=VALUES(name)
SQL;

	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$namePerson = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if ($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}
	$statement = $db->prepare($updateUserSQL);
	if(!$statement)
	{
		throw new OdyMaterialyAPI\QueryException($updateUserSQL, $db);
	}
	$statement->bind_param('is', $idPerson, $namePerson);
	if(!$statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($updateUserSQL, $statement);
	}
}

try
{
	OdymaterialyAPI\skautisTry('updateUser', false);
}
catch(OdymaterialyAPI\APIException $e) {}
