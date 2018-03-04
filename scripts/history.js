function historySetup()
{
	window.onpopstate = historyPopback;
	if(window.location.pathname === "/competence")
	{
		showCompetenceListView();
	}
	else if(window.location.pathname.substring(0, 12) === "/competence/")
	{
		var competenceId = window.location.pathname.substring(12).split("/")[0];
		showCompetenceView(competenceId);
	}
	else if(window.location.pathname.substring(0, 7) === "/field/")
	{
		var fieldId = window.location.pathname.substring(7).split("/")[0];
		showFieldView(fieldId);
	}
	else if(window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var lessonId = window.location.pathname.substring(8).split("/")[0];
		metadataEvent.addCallback(function()
			{
				showLessonView(lessonId);
			});
	}
	else
	{
		showLessonListView();
	}
}

function historyPopback()
{
	if(history.state)
	{
		if(window.location.pathname === "/competence")
		{
			showCompetenceListView(true);
		}
		else if(window.location.pathname.substring(0, 12) === "/competence/")
		{
			showCompetenceView(history.state.id, true);
		}
		else if(window.location.pathname.substring(0, 7) === "/field/")
		{
			showFieldView(history.state.id, true);
		}
		else if(window.location.pathname.substring(0, 8) === "/lesson/")
		{
			showLessonView(history.state.id, true);
		}
		else
		{
			showLessonListView(true);
		}
	}
}
