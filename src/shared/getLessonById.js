"use strict";
/* exported getLessonById */

function getLessonById(id)
{
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				return FIELDS[i].lessons[j];
			}
		}
	}
	return undefined;
}
