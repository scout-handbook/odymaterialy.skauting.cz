function historySetup()
{
	window.onpopstate = popback;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var lessonName = decodeURIComponent(window.location.pathname.substring(8));
		getLesson(lessonName);
	}
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, history.state.name , true);
	}
}
