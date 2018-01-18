<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$userGroupEndpoint = new HandbookAPI\Endpoint();

$updateUserRole = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$checkRole = function(HandbookAPI\Role $my_role, HandbookAPI\Role $role) : void
	{
		if((HandbookAPI\Role_cmp($my_role, new HandbookAPI\Role('administrator')) === 0) and (HandbookAPI\Role_cmp($role, new HandbookAPI\Role('administrator')) >= 0))
		{
			throw new HandbookAPI\RoleException();
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
		throw new HandbookAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	$groups = [];
	if(isset($data['group']))
	{
		if(is_array($data['group']))
		{
			foreach($data['group'] as $group)
			{
				$groups[] = HandbookAPI\Helper::parseUuid($group, 'group')->getBytes();
			}
		}
		else
		{
			$groups[] = HandbookAPI\Helper::parseUuid($data['group'], 'group')->getBytes();
		}
	}

	$my_role = HandbookAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person);

	$db = new HandbookAPI\Database();
	$db->beginTransaction();

	$db->prepare($selectSQL);
	$db->bindParam(':id', $id, PDO::PARAM_INT);
	$db->execute();
	$other_role = '';
	$db->bindColumn('role', $other_role);
	$db->fetchRequire('user');
	$checkRole($my_role, new HandbookAPI\Role($other_role));

	$db->prepare($deleteSQL);
	$db->bindParam(':user_id', $id, PDO::PARAM_STR);
	$db->execute();

	$db->prepare($insertSQL);
	foreach($groups as $group)
	{
		$db->bindParam(':user_id', $id, PDO::PARAM_STR);
		$db->bindParam(':group_id', $group, PDO::PARAM_STR);
		$db->execute("user or group");
	}

	$db->endTransaction();
	return ['status' => 200];
};
$userGroupEndpoint->setUpdateMethod(new HandbookAPI\Role('administrator'), $updateUserRole);
