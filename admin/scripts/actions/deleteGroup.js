function deleteGroupOnClick(event)
{
	var name = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == event.target.dataset.id)
		{
			name = GROUPS[i].name
			break;
		}
	}

	dialog("Opravdu si přejete smazat skupinu " + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/group/" + encodeURIComponent(event.target.dataset.id), "DELETE", {});
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;");
	refreshLogin();
}
