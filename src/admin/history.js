"use strict";
/* exported historySetup */

function historySetup()
{
	window.onpopstate = popback;
	if(window.location.pathname.substring(7))
	{
		window.mainPageTab = window.location.pathname.substring(7);
	}
	configEvent.addCallback(showMainView);
}

function popback()
{
	if(history.state)
	{
		if(window.sidePanelState)
		{
			sidePanelClose();
		}
		else if(history.state.id)
		{
			if(window.imageSelectorOpen)
			{
				prepareImageSelector();
			}
			else
			{
				metadataEvent.addCallback(function()
					{
						showLessonEditView(history.state.id, true);
					});
			}
		}
		else if(history.state.page)
		{
			window.mainPageTab = history.state.page;
			showMainView(true)
		}
		else
		{
			showMainView();
		}
	}
}
