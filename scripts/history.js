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
	getLesson(lessonId);
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, true);
	}
}
