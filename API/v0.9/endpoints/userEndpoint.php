<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');
require_once($BASEPATH . '/v0.9/internal/User.php');

require_once($BASEPATH . '/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

require_once($BASEPATH . '/v0.9/endpoints/userRoleEndpoint.php');
require_once($BASEPATH . '/v0.9/endpoints/userGroupEndpoint.php');

$userEndpoint = new HandbookAPI\Endpoint();
$userEndpoint->addSubEndpoint('role', $userRoleEndpoint);
$userEndpoint->addSubEndpoint('group', $userGroupEndpoint);


function constructSelectSQL(Skautis\Skautis $skautis) : string
{
	$role = HandbookAPI\getRole($skautis->UserManagement->LoginDetail()->ID_Person);

	$innerSQL = '';
	if(HandbookAPI\Role_cmp($role, new HandbookAPI\Role('administrator')) >= 0)
	{
		$innerSQL .= ', \'editor\'';
	}
	if(HandbookAPI\Role_cmp($role, new HandbookAPI\Role('superuser')) === 0)
	{
		$innerSQL .= ', \'administrator\', \'superuser\'';
	}

	$selectSQL = <<<SQL
SELECT SQL_CALC_FOUND_ROWS id, name, role
FROM users
WHERE name LIKE CONCAT('%', :name, '%') AND role IN ('guest', 'user'
SQL
	. $innerSQL . <<<SQL
)
ORDER BY name
LIMIT :start, :per_page;
SQL;
	return $selectSQL;
}

$listUsers = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$selectSQL = constructSelectSQL($skautis);
	$countSQL = <<<SQL
SELECT FOUND_ROWS();
SQL;
	$groupSQL = <<<SQL
SELECT group_id
FROM users_in_groups
WHERE user_id = :user_id;
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
			throw new HandbookAPI\InvalidArgumentTypeException('per-page', ['Integer']);
		}
	}
	$start = 0;
	if(isset($data['page']))
	{
		$start = ctype_digit($data['page']) ? ($per_page * (intval($data['page']) - 1)) : null;
		if($start === null)
		{
			throw new HandbookAPI\InvalidArgumentTypeException('page', ['Integer']);
		}
	}

	$db = new HandbookAPI\Database();
	$db->prepare($selectSQL);
	$db->bindParam(':name', $searchName, PDO::PARAM_STR);
	$db->bindParam(':start', $start, PDO::PARAM_INT);
	$db->bindParam(':per_page', $per_page, PDO::PARAM_INT);
	$db->execute();
	$userResult = $db->fetchAll();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bindColumn(1, $count);
	$db->fetchRequire('users');

	$users = [];
	foreach($userResult as $row)
	{
		$users[] = new HandbookAPI\User(intval($row['id']), $row['name'], $row['role']);

		$db2 = new HandbookAPI\Database();
		$db2->prepare($groupSQL);
		$db2->bindParam(':user_id', $row['id'], PDO::PARAM_STR);
		$db2->execute();
		$group = '';
		$db2->bindColumn('group_id', $group);
		while($db2->fetch())
		{
			end($users)->groups[] = $group;
		}
	}

	return ['status' => 200, 'response' => ['count' => $count, 'users' => $users]];
};
$userEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listUsers);

$addUser = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	if(!isset($data['id']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'id');
	}
	$id = ctype_digit($data['id']) ? intval($data['id']) : null;
	if($id === null)
	{
		throw new HandbookAPI\InvalidArgumentTypeException('id', ['Integer']);
	}
	if(!isset($data['name']))
	{
		throw new HandbookAPI\MissingArgumentException(HandbookAPI\MissingArgumentException::POST, 'name');
	}
	$name = $data['name'];

	$SQL = <<<SQL
INSERT INTO users (id, name)
VALUES (:id, :name)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SQL;

	$db = new HandbookAPI\Database();
	$db->prepare($SQL);
	$db->bindParam(':id', $id, PDO::PARAM_INT);
	$db->bindParam(':name', $name, PDO::PARAM_STR);
	$db->execute();
	return ['status' => 200];
};
$userEndpoint->setAddMethod(new HandbookAPI\Role('editor'), $addUser);
