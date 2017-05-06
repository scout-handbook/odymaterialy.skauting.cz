function historySetup()
{
	window.onpopstate = popback;
}

function popback()
{
	getLesson(history.state.lessonName, true);
}
