<?php
const _API_EXEC = 1;

header("content-type:application/json");
require_once('internal/database.secret.php');
require_once('internal/skautisTry.php');

function getRole($idPerson)
{
	$getRoleSQL = <<<SQL
SELECT role FROM users WHERE id = ?;
SQL;

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if ($db->connect_error)
	{
		throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}
	$statement = $db->prepare($getRoleSQL);
	if($statement === false)
	{
		throw new Exception('Invalid SQL: "' . $getRoleSQL . '". Error: ' . $db->error);
	}
	$statement->bind_param('i', $idPerson);
	$statement->execute();
	$statement->store_result();
	$role = '';
	$statement->bind_result($role);
	if(!$statement->fetch())
	{
		registerUser($db, $idPerson);
		return 0;
	}
	return $role;
}

function registerUser($db, $idPerson)
{
	$registerUserSQL = <<<SQL
INSERT INTO users (id) VALUES (?)
SQL;
	$statement = $db->prepare($registerUserSQL);
	if($statement === false)
	{
		throw new Exception('Invalid SQL: "' . $registerUserSQL . '". Error: ' . $db->error);
	}
	$statement->bind_param('i', $idPerson);
	$statement->execute();
}

function showUserAccount($skautis)
{
	$response = array();
	$response['login_state'] = true;
	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
	$response['role'] = getRole($idPerson);
	$response['user_avatar'] = base64_encode($skautis->OrganizationUnit->PersonPhoto(array(
		'ID' => $idPerson,
		'Size' => 'small'))->PhotoSmallContent);
	return $response;
}

function showLoginForm()
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(OdymaterialyAPI\skautisTry('showUserAccount', 'showLoginForm')));
