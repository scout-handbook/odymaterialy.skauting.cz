function deleteLessonOnClick(event)
{
	var name = "";
	var id = getAttribute(event, "id");
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				name = FIELDS[i].lessons[j].name
				break outer;
			}
		}
	}

	var aq = new ActionQueue([new Action(APIURI + "/lesson/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", aq.closeDispatch, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
