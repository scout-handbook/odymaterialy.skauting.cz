function historySetup()
{
	window.onpopstate = popback;
	if(window.location.pathname.substring(0, 12) === "/competence/")
	{
		var query = window.location.pathname.substring(12);
		var competenceId = query.split("/")[0];
		showCompetenceView(competenceId);
	}
	else if(window.location.pathname.substring(0, 7) === "/field/")
	{
		var query = window.location.pathname.substring(7);
		var fieldId = query.split("/")[0];
		showFieldView(fieldId);
	}
	else if(window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var query = window.location.pathname.substring(8);
		var lessonId = query.split("/")[0];
		showLessonView(lessonId);
	}
	else
	{
		showLessonListView();
	}
}

function popback()
{
	if(history.state)
	{
		if(window.location.pathname.substring(0, 12) === "/competence/")
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
			showLessonListView();
		}
	}
}
