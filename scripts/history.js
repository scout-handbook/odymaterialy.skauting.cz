function historySetup()
{
	window.onpopstate = popback;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var query = window.location.pathname.substring(8);
		var spl = query.split("/");
		getLesson(spl[0], decodeURIComponent(spl[1]));
	}
	else
	{
		getLesson();
	}
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, history.state.name , true);
	}
}
