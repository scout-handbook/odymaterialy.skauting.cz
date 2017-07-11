<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

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
		throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}
	$statement = $db->prepare($updateUserSQL);
	if($statement === false)
	{
		throw new Exception('Invalid SQL: "' . $updateUserSQL . '". Error: ' . $db->error);
	}
	$statement->bind_param('is', $idPerson, $namePerson);
	$statement->execute();
}

function fail()
{
	throw new Exception('Permission denied.');
}

OdymaterialyAPI\skautisTry('updateUser', 'fail', false);
