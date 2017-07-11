<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Lesson implements \JsonSerializable
{
	public $id;
	public $name;
	public $version;
	public $competences = array();
	public $lowestCompetence;

	public function __construct($id, $name, $version)
	{
		$this->id = $id;
		$this->name = $name;
		$this->version = $version;
	}

	public function jsonSerialize()
	{
		return ['id' => $this->id, 'name' => $this->name, 'version' => $this->version, 'competences' => $this->competences];
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
	if ($first->lowestCompetence == $second->lowestCompetence)
	{
		return 0;
	}
	return ($first->lowestCompetence < $second->lowestCompetence) ? -1 : 1;
}
