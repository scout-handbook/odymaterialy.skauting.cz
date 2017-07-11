function historySetup()
{
	window.onpopstate = popback;
}

function popback()
{
	if(history.state)
	{
		lessonListEvent.addCallback(function()
			{
				getLesson(history.state.id, true);
			});
	}
}
