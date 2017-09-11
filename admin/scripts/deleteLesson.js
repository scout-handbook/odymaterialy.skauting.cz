function deleteLessonOnClick(event)
{
	var name = "";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == event.target.dataset.id)
			{
				name = FIELDS[i].lessons[j].name
				break outer;
			}
		}
	}

	history.pushState({"sidePanel": "open"}, "title", "/admin/");

	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", function()
		{
			var payload = {"id": encodeURIComponent(event.target.dataset.id)};
			retryAction("/API/v0.9/delete_lesson", "POST", payload);
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;", function()
		{
			history.back();
		});
}
