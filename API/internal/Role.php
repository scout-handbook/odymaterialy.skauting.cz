<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

abstract class Role
{
	const GUEST = 0;
	const USER = 1;
	const EDITOR = 2;
	const ADMINISTRATOR = 3;
	const SUPERUSER = 4;

	public static function parse($str)
	{
		switch($str)
		{
		case 'superuser':
			return Role::SUPERUSER;
			break;
		case 'administrator':
			return Role::ADMINISTRATOR;
			break;
		case 'editor':
			return Role::EDITOR;
			break;
		case 'user':
			return Role::USER;
			break;
		default:
			return Role::GUEST;
			break;
		}
	}
}

function getRole($idPerson)
{
	$SQL = <<<SQL
SELECT role
FROM users
WHERE id = ?;
SQL;

	$db = new \mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);
	if ($db->connect_error)
	{
		throw new ConnectionException($db);
	}

	$statement = $db->prepare($SQL);
	if(!$statement)
	{
		throw new QueryException($SQL, $db);
	}
	$statement->bind_param('i', $idPerson);
	if(!$statement->execute())
	{
		throw new ExecutionException($SQL, $statement);
	}
	$statement->store_result();
	$role = '';
	$statement->bind_result($role);
	if(!$statement->fetch())
	{
		throw new APIException('Error: User not in database even though they are logged in. This should never happen.');
		return 0;
	}
	return $role;
}
