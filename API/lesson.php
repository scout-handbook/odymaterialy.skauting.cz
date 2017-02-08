<?php
@_API_EXEC == 1 or die('Restricted access.');

class Lesson
{
	private $name;
	private $competences;

	function __construct($name, $competences)
	{
		$this->name = $name;
		$this->competences = $competences;
	}
}
?>
