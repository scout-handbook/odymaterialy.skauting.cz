<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/User.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/userRoleEndpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/userGroupEndpoint.php');

$userEndpoint = new OdyMaterialyAPI\Endpoint('user');
$userEndpoint->addSubEndpoint('role', $userRoleEndpoint);
$userEndpoint->addSubEndpoint('group', $userGroupEndpoint);

$listUsers = function($skautis, $data, $endpoint)
{
	$role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person));
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
SELECT SQL_CALC_FOUND_ROWS id, name, role
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
	$groupSQL = <<<SQL
SELECT group_id
FROM users_in_groups
WHERE user_id = ?;
SQL;

	$searchName = '';
	if(isset($data['name']))
	{
		$searchName = $data['name'];
	}
	$per_page = 25;
	if(isset($data['per-page']))
	{
		$per_page = ctype_digit($data['per-page']) ? intval($data['per-page']) : null;
		if($per_page === null)
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('per-page', ['Integer']);
		}
	}
	$start = 0;
	if(isset($data['page']))
	{
		$start = ctype_digit($data['page']) ? ($per_page * (intval($data['page']) - 1)) : null;
		if($start === null)
		{
			throw new OdyMaterialyAPI\InvalidArgumentTypeException('page', ['Integer']);
		}
	}

	$db = new OdymaterialyAPI\Database();
	$db->prepare($selectSQL);
	$db->bind_param('sii', $searchName, $start, $per_page);
	$db->execute();
	$user_id = '';
	$user_name = '';
	$user_role = '';
	$db->bind_result($user_id, $user_name, $user_role);
	$users = [];
	while($db->fetch())
	{
		$users[] = new OdymaterialyAPI\User($user_id, $user_name, $user_role);

		$db2 = new OdymaterialyAPI\Database();
		$db2->prepare($groupSQL);
		$db2->bind_param('s', $user_id);
		$db2->execute();
		$group = '';
		$db2->bind_result($group);
		while($db2->fetch())
		{
			end($users)->groups[] = $group;
		}
	}

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('users');
	return ['status' => 200, 'response' => ['count' => $count, 'users' => $users]];
};
$userEndpoint->setListMethod(new OdymaterialyAPI\Role('editor'), $listUsers);

$addUser = function($skautis, $data, $endpoint)
{
	if(!isset($data['id']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'id');
	}
	$id = ctype_digit($data['id']) ? intval($data['id']) : null;
	if($id === null)
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	if(!isset($data['name']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'name');
	}
	$name = $endpoint->xss_sanitize($data['name']);

	$SQL = <<<SQL
INSERT INTO users (id, name)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SQL;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('is', $id, $name);
	$db->execute();
	return ['status' => 200];
};
$userEndpoint->setAddMethod(new OdyMaterialyAPI\Role('editor'), $addUser);
