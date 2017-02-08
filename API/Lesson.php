<?php
@_API_EXEC == 1 or die('Restricted access.');

class Lesson
{
	public $name;
	public $competences = array();

	function __construct($name)
	{
		$this->name = $name;
	}
}
?>
