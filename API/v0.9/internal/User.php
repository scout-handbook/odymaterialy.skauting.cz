<?php
namespace OdyMaterialyAPI;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

@_API_EXEC === 1 or die('Restricted access.');

class User implements \JsonSerializable
{
	public $id;
	public $name;
	public $role;
	public $groups;

	public function __construct($id, $name, $role)
	{
		$this->id = $id;
		$this->name = $name;
		$this->role = new Role($role);
		$this->groups = [];
	}

	public function jsonSerialize()
	{
		$ugroup = [];
		foreach($this->groups as $group)
		{
			$ugroup[] = Uuid::fromBytes($group);
		}
		return ['id' => $this->id, 'name' => $this->name, 'role' => $this->role, 'groups' => $ugroup];
	}
}
