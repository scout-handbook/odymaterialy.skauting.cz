<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

class Role implements \JsonSerializable
{
	private const GUEST = 0;
	private const USER = 1;
	private const EDITOR = 2;
	private const ADMINISTRATOR = 3;
	private const SUPERUSER = 4;

	public $role;

	public function __construct($str)
	{
		switch($str)
		{
		case 'superuser':
			$this->role = self::SUPERUSER;
			break;
		case 'administrator':
			$this->role = self::ADMINISTRATOR;
			break;
		case 'editor':
			$this->role = self::EDITOR;
			break;
		case 'user':
			$this->role = self::USER;
			break;
		default:
			$this->role = self::GUEST;
			break;
		}
	}

	public function __toString()
	{
		switch($this->role)
		{
		case self::SUPERUSER:
			return 'superuser';
			break;
		case self::ADMINISTRATOR:
			return 'administrator';
			break;
		case self::EDITOR:
			return 'editor';
			break;
		case self::USER:
			return 'user';
			break;
		default:
			return 'guest';
			break;
		}
	}

	public function jsonSerialize()
	{
		return $this->__toString();
	}
}

function Role_cmp($first, $second)
{
	return $first->role <=> $second->role;
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
	return new Role($role);
}
