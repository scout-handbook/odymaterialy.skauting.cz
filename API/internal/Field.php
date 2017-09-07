<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

use \Ramsey\Uuid\Uuid;

class Field implements \JsonSerializable
{
	public $id;
	public $name;
	public $lessons = array();

	public function __construct($id, $name)
	{
		$this->id = $id;
		$this->name = $name;
	}

	public function jsonSerialize()
	{
		return ['id' => Uuid::fromBytes($this->id), 'name' => $this->name, 'lessons' => $this->lessons];
	}
}

// Field comparison function used in usort. Assumes that both Fields have their lessons sorted low-to-high.
function Field_cmp($first, $second)
{
	if (get_class($first) === "OdyMaterialyAPI\AnonymousField")
	{
		return -1;
	}
	if (get_class($second) === "OdyMaterialyAPI\AnonymousField")
	{
		return 1;
	}
	if (empty($first->lessons))
	{
		if (empty($second->lessons))
		{
			return 0;
		}
		return -1;
	}
	if (empty($second->lessons))
	{
		return 1;
	}
	return Lesson_cmp($first->lessons[0], $second->lessons[0]);
}
