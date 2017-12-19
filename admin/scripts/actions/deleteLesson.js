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

	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/lesson/" + encodeURIComponent(id), "DELETE", {});
		}, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
