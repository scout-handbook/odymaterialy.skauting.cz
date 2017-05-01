<?php
namespace OdyMaterialy;

@_API_EXEC == 1 or die('Restricted access.');

class Field
{
	public $name;
	public $lessons = array();

	public function __construct($name)
	{
		$this->name = $name;
	}
}

// Field comparison function used in usort. Assumes that both Fields have their lessons sorted low-to-high.
function Field_cmp($first, $second)
{
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
