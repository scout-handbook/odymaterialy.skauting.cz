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
	if($first->lessons[0]->competences[0] == $second->lessons[0]->competences[0])
	{
		return 0;
	}
	return ($first->lessons[0]->competences[0] < $second->lessons[0]->competences[0]) ? -1 : 1;
}

?>
