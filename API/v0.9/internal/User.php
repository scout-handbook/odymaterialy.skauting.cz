<?php
namespace OdyMaterialyAPI;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

@_API_EXEC === 1 or die('Restricted access.');

class User
{
	public $id;
	public $role;
	public $name;

	public function __construct($id, $role, $name)
	{
		$this->id = $id;
		$this->role = new Role($role);
		$this->name = $name;
	}
}
