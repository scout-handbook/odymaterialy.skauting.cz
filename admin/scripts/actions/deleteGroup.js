function deleteGroupOnClick(event)
{
	var name = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == getAttribute(event, "id"))
		{
			name = GROUPS[i].name
			break;
		}
	}

	dialog("Opravdu si přejete smazat skupinu \"" + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/group/" + encodeURIComponent(getAttribute(event, "id")), "DELETE", {});
		}, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}
