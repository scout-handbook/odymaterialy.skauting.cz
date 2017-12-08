function deleteFieldOnClick(event)
{
	var name = "";
	var id = getAttribute(event, "id");
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id == id)
		{
			name = FIELDS[i].name
			break;
		}
	}

	dialog("Opravdu si přejete smazat oblast \"" + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/field/" + encodeURIComponent(id), "DELETE", {});
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
