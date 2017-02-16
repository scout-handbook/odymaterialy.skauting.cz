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

// Lesson comparison function used in usort. Assumes that both Lessons have their competences field sorted low-to-high.
function Lesson_cmp($a, $b)
{
	if($a->competences[0] == $b->competences[0])
	{
		return 0;
	}
	return ($a->competences[0] < $b->competences[0]) ? -1 : 1;
}

?>
