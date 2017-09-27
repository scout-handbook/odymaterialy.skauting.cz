<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/User.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$userEndpoint = new OdyMaterialyAPI\Endpoint('user');

$listUsers = function($skautis, $data, $endpoint)
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
	if(isset($data['name']))
	{
		if(!is_string($data['name']))
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('name', ['String']);
		}
		$searchName = $data['name'];
	}
	$per_page = 25;
	if(isset($data['per-page']))
	{
		if(!is_int($data['per-page']))
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('per-page', ['Integer']);
		}
		$per_page = $data['per-page'];
	}
	$start = 0;
	if(isset($data['page']))
	{
		if(!is_int($data['page']))
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('page', ['Integer']);
		}
		$start = $per_page * ($data['page'] - 1);
	}

	$db = new OdymaterialyAPI\Database();
	$db->prepare($selectSQL);
	$db->bind_param('sii', $searchName, $start, $per_page);
	$db->execute();
	$user_id = '';
	$user_role = '';
	$user_name = '';
	$db->bind_result($user_id, $user_role, $user_name);
	$users = [];
	while($db->fetch())
	{
		$users[] = new OdymaterialyAPI\User($user_id, $user_role, $user_name);
	}

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('users');
	return ['status' => 200, 'response' => ['count' => $count, 'users' => $users]];
};
$userEndpoint->setListMethod(new OdymaterialyAPI\Role('editor'), $listUsers);

$updateUser = function($skautis, $data, $endpoint)
{
	$checkRole = function($my_role, $role)
	{
		if((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('editor')) === 0) and (OdymaterialyAPI\Role_cmp($role, new OdymaterialyAPI\Role('user')) > 0))
		{
			throw new OdymaterialyAPI\RoleException();
		}
		elseif((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('administrator')) === 0) and (OdymaterialyAPI\Role_cmp($role, new OdymaterialyAPI\Role('administrator')) >= 0))
		{
			throw new OdymaterialyAPI\RoleException();
		}
	};

	$selectSQL = <<<SQL
SELECT role
FROM users
WHERE id = ?;
SQL;
	$updateSQL = <<<SQL
UPDATE users
SET role = ?
WHERE id = ?
LIMIT 1;
SQL;

	if(!is_int($data['id']))
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	$id = $data['id'];
	if(!isset($data['role']))
	{
		if(!is_string($data['role']))
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('role', ['String']);
		}
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'role');
	}
	$new_role = new OdymaterialyAPI\Role($data['role']);

	$my_role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->UserDetail()->ID_Person));
	$checkRole($my_role, $new_role);

	$db = new OdymaterialyAPI\Database();
	$db->prepare($selectSQL);
	$db->bind_param('i', $id);
	$db->execute();
	$old_role = '';
	$db->bind_result($old_role);
	$db->fetch_require('user');
	$checkRole($my_role, new OdymaterialyAPI\Role($old_role));

	$new_role_str = $new_role->__toString();
	$db->prepare($updateSQL);
	$db->bind_param('si', $new_role_str, $id);
	$db->execute();
	return ['status' => 200];
};
$userEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('editor'), $updateUser);
