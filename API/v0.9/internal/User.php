<?php
namespace OdyMaterialyAPI;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

@_API_EXEC === 1 or die('Restricted access.');

class User
{
	public $id;
	public $name;
	public $role;

	public function __construct($id, $name, $role)
	{
		$this->id = $id;
		$this->name = $name;
		$this->role = new Role($role);
	}
}
