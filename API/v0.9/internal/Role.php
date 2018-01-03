<?php declare(strict_types=1);
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');

class Role implements \JsonSerializable
{
	private const GUEST = 0;
	private const USER = 1;
	private const EDITOR = 2;
	private const ADMINISTRATOR = 3;
	private const SUPERUSER = 4;

	public $role;

	public function __construct(string $str)
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

	public function __toString() : string
	{
		switch($this->role)
		{
			case self::SUPERUSER:
				return 'superuser';
			case self::ADMINISTRATOR:
				return 'administrator';
			case self::EDITOR:
				return 'editor';
			case self::USER:
				return 'user';
			default:
				return 'guest';
		}
	}

	public function jsonSerialize() : string
	{
		return $this->__toString();
	}
}

function Role_cmp(Role $first, Role $second) : int
{
	return $first->role <=> $second->role;
}

function getRole(int $idPerson) : Role
{
	$SQL = <<<SQL
SELECT role
FROM users
WHERE id = ?;
SQL;

	$db = new Database();
	$db->prepare($SQL);
	$db->bind_param('i', $idPerson);
	$db->execute();
	$role = '';
	$db->bind_result($role);
	$db->fetch_require('user');
	return new Role($role);
}
