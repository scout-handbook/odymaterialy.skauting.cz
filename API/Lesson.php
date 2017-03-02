<?php
namespace OdyMaterialy;

@_API_EXEC == 1 or die('Restricted access.');

class Lesson
{
	public $name;
	public $version;
	public $competences = array();

	public function __construct($name, $version)
	{
		$this->name = $name;
		$this->version = $version;
	}
}

// Lesson comparison function used in usort. Assumes that both Lessons have their competences field sorted low-to-high.
function Lesson_cmp($first, $second)
{
	if ($first->competences[0] == $second->competences[0])
	{
		return 0;
	}
	return ($first->competences[0] < $second->competences[0]) ? -1 : 1;
}
