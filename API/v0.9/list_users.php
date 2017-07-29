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
	$role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->UserDetail()->ID_Person));
	$innerSQL = '';
	if(OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('administrator')) >= 0)
	{
		$innerSQL .= ', \'editor\'';
	}
	if(OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('superuser')) === 0)
	{
		$innerSQL .= ', \'administrator\', \'superuser\'';
	}

	$selectSQL = <<<SQL
SELECT SQL_CALC_FOUND_ROWS id, role, name
FROM users
WHERE name LIKE CONCAT('%', ?, '%') AND role IN ('guest', 'user'
SQL
	. $innerSQL . <<<SQL
)
ORDER BY name
LIMIT ?, ?;
SQL;

	$countSQL = <<<SQL
SELECT FOUND_ROWS();
SQL;

	$searchName = '';
	if(isset($_GET['name']))
	{
		$searchName = $_GET['name'];
	}
	$per_page = 100;
	if(isset($_GET['per-page']))
	{
		$per_page = $_GET['per-page'];
	}
	$start = 0;
	if(isset($_GET['page']))
	{
		$start = $per_page * ($_GET['page'] - 1);
	}

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
	$selectStatement->bind_param('sii', $searchName, $start, $per_page);
	if(!$selectStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($selectSQL, $selectStatement);
	}
	$selectStatement->store_result();
	$response = array('users' => array());
	$user_id = '';
	$user_role = '';
	$user_name = '';
	$selectStatement->bind_result($user_id, $user_role, $user_name);
	while($selectStatement->fetch())
	{
		$response['users'][] = new OdymaterialyAPI\User($user_id, $user_role, $user_name);
	}
	$selectStatement->close();

	$countStatement = $db->prepare($countSQL);
	if(!$countStatement)
	{
		throw new OdyMaterialyAPI\QueryException($countSQL, $db);
	}
	if(!$countStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($countSQL, $countStatement);
	}
	$countStatement->store_result();
	$count = 0;
	$countStatement->bind_result($count);
	if(!$countStatement->fetch())
	{
		throw new OdymaterialyAPI\APIException('Couldn\'t retrieve user count.');
	}
	$response['count'] = $count;
	$countStatement->close();
	$db->close();
	echo(json_encode($response, JSON_UNESCAPED_UNICODE));
}

try
{
	OdymaterialyAPI\editorTry('listUsers', true);
}
catch(OdymaterialyAPI\APIException $e)
{
	echo('[]'); // TODO: Error handling
}
