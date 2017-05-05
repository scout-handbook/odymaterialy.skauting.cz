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
	var lessonName = decodeURIComponent(window.location.pathname.substring(8));
	getLesson(lessonName, true);
}

