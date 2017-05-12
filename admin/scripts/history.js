function historySetup()
{
	window.onpopstate = popback;
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, history.state.name, history.state.competences, true);
	}
}
