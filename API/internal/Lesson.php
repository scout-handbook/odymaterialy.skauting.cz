<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Lesson
{
	public $id;
	public $name;
	public $version;
	public $competences = array();

	public function __construct($id, $name, $version)
	{
		$this->id = $id;
		$this->name = $name;
		$this->version = $version;
	}
}

// Lesson comparison function used in usort. Assumes that both Lessons have their competences field sorted low-to-high.
function Lesson_cmp($first, $second)
{
	if (empty($first->competences))
	{
		if (empty($second->competences))
		{
			return 0;
		}
		return -1;
	}
	if (empty($second->competences))
	{
		return 1;
	}
	if ($first->competences[0]->number == $second->competences[0]->number)
	{
		return 0;
	}
	return ($first->competences[0]->number < $second->competences[0]->number) ? -1 : 1;
}
