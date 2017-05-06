function historySetup()
{
	window.onpopstate = popback;
}

function popback()
{
	getLesson(history.state.id, history.state.name, true);
}
