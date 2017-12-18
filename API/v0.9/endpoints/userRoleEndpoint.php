<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$userRoleEndpoint = new OdyMaterialyAPI\Endpoint('user');

$updateUserRole = function($skautis, $data, $endpoint)
{
	$checkRole = function($my_role, $role)
	{
		if((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('administrator')) === 0) and (OdymaterialyAPI\Role_cmp($role, new OdymaterialyAPI\Role('administrator')) >= 0))
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

	$id = ctype_digit($data['parent-id']) ? intval($data['parent-id']) : null;
	if($id === null)
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	if(!isset($data['role']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::POST, 'role');
	}
	$new_role = new OdymaterialyAPI\Role($data['role']);

	$my_role = new OdyMaterialyAPI\Role(OdymaterialyAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person));
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
$userRoleEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('administrator'), $updateUserRole);
