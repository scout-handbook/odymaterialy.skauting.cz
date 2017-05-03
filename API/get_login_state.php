<?php
const _API_EXEC = 1;

header("content-type:application/json");
require_once('internal/database.secret.php');
require_once('internal/skautisTry.php');

function get_role($idPerson)
{
	$get_role_sql = <<<SQL
SELECT role FROM users WHERE id = ?;
SQL;

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if ($db->connect_error)
	{
		throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}
	$statement = $db->prepare($get_role_sql);
	if($statement === false)
	{
		throw new Exception('Invalid SQL: "' . $get_role_sql . '". Error: ' . $db->error);
	}
	$statement->bind_param('i', $idPerson);
	$statement->execute();
	$statement->store_result();
	$role = "";
	$statement->bind_result($role);
	if(!$statement->fetch())
	{
		register_user($db, $idPerson);
		return 0;
	}
	return $role;
}

function register_user($db, $idPerson)
{
	$register_user_sql = <<<SQL
INSERT INTO users (id) VALUES (?)
SQL;
	$statement = $db->prepare($register_user_sql);
	if($statement === false)
	{
		throw new Exception('Invalid SQL: "' . $get_role_sql . '". Error: ' . $db->error);
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
	$response['role'] = get_role($idPerson);
	return $response;
}

function showLoginForm()
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(OdymaterialyAPI\skautisTry('showUserAccount', 'showLoginForm')));
