<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/User.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function listUsers($skautis)
{
	// TODO: LIMIT
	$SQL = <<<SQL
SELECT id, role, name
FROM users
WHERE name LIKE CONCAT('%',?,'%')
ORDER BY name;
SQL;

	$searchName = "";
	if(isset($_GET['name']))
	{
		$searchName = $_GET['name'];
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);
	if($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->UserDetail()->ID_Person));

	$statement = $db->prepare($SQL);
	if(!$statement)
	{
		throw new OdyMaterialyAPI\QueryException($SQL, $db);
	}
	$statement->bind_param('s', $searchName);
	if(!$statement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($SQL, $statement);
	}
	$statement->store_result();
	$users = array();
	$user_id = '';
	$user_role = '';
	$user_name = '';
	$statement->bind_result($user_id, $user_role, $user_name);
	while($statement->fetch())
	{
		$user = new OdymaterialyAPI\User($user_id, $user_role, $user_name);
		if(OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('superuser')) === 0)
		{
			$users[] = $user;
		}
		elseif((OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('administrator')) === 0) and (OdyMaterialyAPI\Role_cmp($user->role, new OdyMaterialyAPI\Role('administrator')) < 0))
		{
			$users[] = $user;
		}
		elseif((OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('editor')) === 0) and (OdyMaterialyAPI\Role_cmp($user->role, new OdyMaterialyAPI\Role('user')) <= 0))
		{
			$users[] = $user;
		}
	}
	$statement->close();
	$db->close();
	echo(json_encode($users, JSON_UNESCAPED_UNICODE));
}

try
{
	OdymaterialyAPI\editorTry('listUsers', true);
}
catch(OdymaterialyAPI\APIException $e)
{
	echo('[]'); // TODO: Error handling
}
