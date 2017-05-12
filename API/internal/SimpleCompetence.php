<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class SimpleCompetence
{
	public $id;
	public $number;

	public function __construct($id, $number)
	{
		$this->id = $id;
		$this->number = $number;
	}
}
