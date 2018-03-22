<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

class LessonContainer
{
	public $lessons = array();

	public function __construct()
	{
	}
}

// Container comparison function used in usort. Assumes that both Containers have their lessons sorted low-to-high.
function LessonContainer_cmp(LessonContainer $first, LessonContainer $second) : int
{
	if(get_class($first) === "HandbookAPI\LessonContainer")
	{
		return -1;
	}
	if(get_class($second) === "HandbookAPI\LessonContainer")
	{
		return 1;
	}
	if(empty($first->lessons))
	{
		if(empty($second->lessons))
		{
			return 0;
		}
		return -1;
	}
	if(empty($second->lessons))
	{
		return 1;
	}
	return Lesson_cmp($first->lessons[0], $second->lessons[0]);
}
