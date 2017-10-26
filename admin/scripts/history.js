function historySetup()
{
	window.onpopstate = popback;
	if(window.location.pathname.substring(7))
	{
		mainPageTab = window.location.pathname.substring(7);
	}
	showMainView();
}

function popback()
{
	if(history.state)
	{
		if(history.state.id)
		{
			metadataEvent.addCallback(function()
				{
					showLessonEditView(history.state.id, true);
				});
		}
		else if(history.state.page)
		{
			mainPageTab = history.state.page;
			showMainView(true)
		}
		else if(sidePanelState)
		{
			sidePanelClose();
		}
		else
		{
			showMainView();
		}
	}
}
