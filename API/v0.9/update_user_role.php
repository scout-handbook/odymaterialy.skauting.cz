<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/RoleException.php');

function checkRole($my_role, $role)
{
	if((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('editor')) === 0) and (OdymaterialyAPI\Role_cmp($role, new OdymaterialyAPI\Role('user')) > 0))
	{
		throw new OdymaterialyAPI\RoleException();
	}
	elseif((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('administrator')) === 0) and (OdymaterialyAPI\Role_cmp($role, new OdymaterialyAPI\Role('administrator')) >= 0))
	{
		throw new OdymaterialyAPI\RoleException();
	}
}

function updateUser($skautis)
{
	$selectSQL = <<<SQL
SELECT role
FROM users
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE users
SET role = ?
WHERE id = ?;
SQL;

	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}
	$id = $_POST['id'];
	if(!isset($_POST['role']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'role');
	}
	$new_role = new Role($_POST['role']);

	$my_role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->UserDetail()->ID_Person));
	checkRole($my_role, $new_role);

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$selectStatement = $db->prepare($selectSQL);
	if(!$selectStatement)
	{
		throw new OdyMaterialyAPI\QueryException($selectSQL, $db);
	}
	$selectStatement->bind_param('i', $id);
	if(!$selectStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($selectSQL, $selectStatement);
	}
	$selectStatement->store_result();
	$old_role = '';
	$selectStatement->bind_result($old_role);
	if(!$selectStatement->fetch())
	{
		throw new OdymaterialyAPI\APIException('No user with such id exists.');
	}
	checkRole($my_role, $old_role);
	$selectStatement->close();

	$updateStatement = $db->prepare($updateSQL);
	if(!$updateStatement)
	{
		throw new OdyMaterialyAPI\QueryException($updateSQL, $db);
	}
	$selectStatement->bind_param('si', $new_role, $id);
	if(!$updateStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($updateSQL, $updateStatement);
	}
	$updateStatement->close();
	$db->close();
}

try
{
	OdymaterialyAPI\editorTry('updateUser', true);
	echo(json_encode(array('success' => true)));
}
catch(OdymaterialyAPI\APIException $e)
{
	echo($e);
}
