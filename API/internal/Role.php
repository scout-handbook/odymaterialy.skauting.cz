<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

abstract class Role
{
	const USER = 0;
	const EDITOR = 1;
	const ADMINISTRATOR = 2;
	const SUPERUSER = 3;

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
		default:
			return Role::USER;
			break;
		}
	}
}

function getRole($idPerson)
{
	$getRoleSQL = <<<SQL
SELECT role FROM users WHERE id = ?;
SQL;

	$db = new \mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);
	if ($db->connect_error)
	{
		throw new \Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}
	$statement = $db->prepare($getRoleSQL);
	if($statement === false)
	{
		throw new \Exception('Invalid SQL: "' . $getRoleSQL . '". Error: ' . $db->error);
	}
	$statement->bind_param('i', $idPerson);
	$statement->execute();
	$statement->store_result();
	$role = '';
	$statement->bind_result($role);
	if(!$statement->fetch())
	{
		throw new \Exception('Error: User not in database even though they are logged in.');
		return 0;
	}
	return $role;
}
