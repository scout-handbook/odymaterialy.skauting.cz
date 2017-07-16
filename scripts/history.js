function historySetup()
{
	window.onpopstate = popback;
	if(window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var query = window.location.pathname.substring(8);
		var lessonId = query.split("/")[0];
		getLesson(lessonId);
	}
	else
	{
		getMainPage();
	}
}

function popback()
{
	if(history.state)
	{
		if(window.location.pathname.substring(0, 8) === "/lesson/")
		{
			getLesson(history.state.id, true);
		}
		else
		{
			getMainPage();
		}
	}
}
