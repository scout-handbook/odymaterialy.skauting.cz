function historySetup()
{
	window.onpopstate = popback;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		listLessons(showInitialLesson);
	}
	else
	{
		getLesson();
	}
}

function showInitialLesson()
{
	var query = window.location.pathname.substring(8);
	var lessonId = query.split("/")[0];
	var lessonName = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == lessonId)
			{
				var lessonName = FIELDS[i].lessons[j].name;
			}
		}
	}
	getLesson(lessonId, lessonName);
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, history.state.name , true);
	}
}
