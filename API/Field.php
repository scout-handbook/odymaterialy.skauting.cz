<?php
@_API_EXEC == 1 or die('Restricted access.');

class Field
{
	public $name;
	public $lessons = array();

	function __construct($name)
	{
		$this->name = $name;
	}
}
?>
