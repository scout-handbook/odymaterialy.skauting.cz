<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$userRoleEndpoint = new OdyMaterialyAPI\Endpoint();

$updateUserRole = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$checkRole = function(OdyMaterialyAPI\Role $my_role, OdyMaterialyAPI\Role $role) : void
	{
		if((OdyMaterialyAPI\Role_cmp($my_role, new OdyMaterialyAPI\Role('administrator')) === 0) and (OdyMaterialyAPI\Role_cmp($role, new OdyMaterialyAPI\Role('administrator')) >= 0))
		{
			throw new OdyMaterialyAPI\RoleException();
		}
	};

	$selectSQL = <<<SQL
SELECT role
FROM users
WHERE id = :id;
SQL;
	$updateSQL = <<<SQL
UPDATE users
SET role = :role
WHERE id = :id
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
	$new_role = new OdyMaterialyAPI\Role($data['role']);

	$my_role = OdyMaterialyAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person);
	$checkRole($my_role, $new_role);

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($selectSQL);
	$db->bindParam(':id', $id);
	$db->execute();
	$old_role = '';
	$db->bind_result($old_role);
	$db->fetchRequire('user');
	$checkRole($my_role, new OdyMaterialyAPI\Role($old_role));

	$new_role_str = $new_role->__toString();
	$db->prepare($updateSQL);
	$db->bindParam(':role', $new_role_str);
	$db->bindParam(':id', $id);
	$db->execute();
	return ['status' => 200];
};
$userRoleEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('administrator'), $updateUserRole);
