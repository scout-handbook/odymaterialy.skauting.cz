<?php declare(strict_types = 1);
namespace HandbookAPI;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');

require_once($BASEPATH . '/v0.9/internal/Helper.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

@_API_EXEC === 1 or die('Restricted access.');

class User implements \JsonSerializable
{
	public $id;
	public $name;
	public $role;
	public $groups;

	public function __construct(int $id, string $name, string $role)
	{
		$this->id = $id;
		$this->name = Helper::xssSanitize($name);
		$this->role = new Role($role);
		$this->groups = [];
	}

	public function jsonSerialize() : array
	{
		$ugroup = [];
		foreach($this->groups as $group)
		{
			$ugroup[] = \Ramsey\Uuid\Uuid::fromBytes($group);
		}
		return ['id' => $this->id, 'name' => $this->name, 'role' => $this->role, 'groups' => $ugroup];
	}
}
