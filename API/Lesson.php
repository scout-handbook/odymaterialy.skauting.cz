<?php
@_API_EXEC == 1 or die('Restricted access.');

class Lesson
{
	public $name;
	public $version;
	public $competences = array();

	function __construct($name, $version)
	{
		$this->name = $name;
		$this->version = $version;
	}
}
?>
