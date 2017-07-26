function historySetup()
{
	window.onpopstate = popback;
}

function popback()
{
	if(history.state)
	{
		if(history.state.id)
		{
			lessonListEvent.addCallback(function()
				{
					getLesson(history.state.id, true);
				});
		}
		else if(sidePanelState)
		{
			sidePanelClose();
		}
		else
		{
			getMainPage();
		}
	}
}
