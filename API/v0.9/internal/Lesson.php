<?php declare(strict_types=1);
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

use \Ramsey\Uuid\Uuid;

class Lesson implements \JsonSerializable
{
	public $id;
	public $name;
	public $version;
	public $competences = array();
	public $lowestCompetence;

	public function __construct(string $id, string $name, int $version)
	{
		$this->id = $id;
		$this->name = $name;
		$this->version = $version;
	}

	public function jsonSerialize() : array
	{
		$ucomp = [];
		foreach($this->competences as $competence)
		{
			$ucomp[] = Uuid::fromBytes($competence);
		}
		return ['id' => Uuid::fromBytes($this->id), 'name' => $this->name, 'version' => $this->version, 'competences' => $ucomp];
	}
}

// Lesson comparison function used in usort. Assumes that both Lessons have their competences field sorted low-to-high.
function Lesson_cmp(Lesson $first, Lesson $second) : int
{
	if(empty($first->competences))
	{
		if(empty($second->competences))
		{
			return 0;
		}
		return -1;
	}
	if(empty($second->competences))
	{
		return 1;
	}
	if($first->lowestCompetence == $second->lowestCompetence)
	{
		return 0;
	}
	return ($first->lowestCompetence < $second->lowestCompetence) ? -1 : 1;
}
