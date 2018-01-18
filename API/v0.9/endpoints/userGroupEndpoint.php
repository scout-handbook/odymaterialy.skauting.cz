<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$userGroupEndpoint = new OdyMaterialyAPI\Endpoint();

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
	$deleteSQL = <<<SQL
DELETE FROM users_in_groups
WHERE user_id = :user_id;
SQL;
	$insertSQL = <<<SQL
INSERT INTO users_in_groups (user_id, group_id)
VALUES (:user_id, :group_id);
SQL;

	$id = ctype_digit($data['parent-id']) ? intval($data['parent-id']) : null;
	if($id === null)
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	$groups = [];
	if(isset($data['group']))
	{
		if(is_array($data['group']))
		{
			foreach($data['group'] as $group)
			{
				$groups[] = OdyMaterialyAPI\Helper::parseUuid($group, 'group')->getBytes();
			}
		}
		else
		{
			$groups[] = OdyMaterialyAPI\Helper::parseUuid($data['group'], 'group')->getBytes();
		}
	}

	$my_role = OdyMaterialyAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person);

	$db = new OdyMaterialyAPI\Database();
	$db->beginTransaction();

	$db->prepare($selectSQL);
	$db->bindParam(':id', $id);
	$db->execute();
	$other_role = '';
	$db->bindColumn('role', $other_role);
	$db->fetchRequire('user');
	$checkRole($my_role, new OdyMaterialyAPI\Role($other_role));

	$db->prepare($deleteSQL);
	$db->bindParam(':user_id', $id);
	$db->execute();

	$db->prepare($insertSQL);
	foreach($groups as $group)
	{
		$db->bindParam(':user_id', $id);
		$db->bindParam(':group_id', $group);
		$db->execute("user or group");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$userGroupEndpoint->setUpdateMethod(new OdyMaterialyAPI\Role('administrator'), $updateUserRole);
