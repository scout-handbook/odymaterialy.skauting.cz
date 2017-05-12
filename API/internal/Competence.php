<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Competence
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
}
