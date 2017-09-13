<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

use \Ramsey\Uuid\Uuid;

class Competence implements \JsonSerializable
{
	public $id;
	public $number;
	public $name;
	public $description;

	public function __construct($id, $number, $name, $description)
	{
		$this->id = $id;
		$this->number = $number;
		$this->name = $name;
		$this->description = $description;
	}

	public function jsonSerialize()
	{
		return ['id' => Uuid::fromBytes($this->id), 'number' => $this->number, 'name' => $this->name, 'description' => $this->description];
	}
}
