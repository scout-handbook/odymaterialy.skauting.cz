<?php
namespace OdyMaterialy;
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

// Field comparison function used in usort. Assumes that both Fields have their lessons sorted low-to-high.
function Field_cmp($a, $b)
{
	if($a->lessons[0]->competences[0] == $b->lessons[0]->competences[0])
	{
		return 0;
	}
	return ($a->lessons[0]->competences[0] < $b->lessons[0]->competences[0]) ? -1 : 1;
}

?>
