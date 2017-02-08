<?php
@_API_EXEC == 1 or die('Restricted access.');

class Field
{
	private $name;
	private $lessons;

	function __construct($name, $lessons)
	{
		$this->name = $name;
		$this->lessons = $lessons;
	}
}
?>
