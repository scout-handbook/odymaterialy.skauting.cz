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

	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/lesson/" + encodeURIComponent(event.target.dataset.id), "DELETE", {});
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;");
	refreshLogin();
}
