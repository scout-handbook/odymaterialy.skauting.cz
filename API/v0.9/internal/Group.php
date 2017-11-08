<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

use \Ramsey\Uuid\Uuid;

class Group implements \JsonSerializable
{
	public $id;
	public $name;
	public $count;

	public function __construct($id, $name, $count)
	{
		$this->id = $id;
		$this->name = $name;
		$this->count = $count;
	}

	public function jsonSerialize()
	{
		return ['id' => Uuid::fromBytes($this->id), 'name' => $this->name, 'count' => $this->count];
	}
}
