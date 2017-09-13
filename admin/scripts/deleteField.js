function deleteFieldOnClick(event)
{
	var name = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id == event.target.dataset.id)
		{
			name = FIELDS[i].name
			break;
		}
	}

	history.pushState({"sidePanel": "open"}, "title", "/admin/");

	dialog("Opravdu si přejete smazat oblast \"" + name + "\"?", "Ano", function()
		{
			retryAction("/API/v0.9/field/" + encodeURIComponent(event.target.dataset.id), "DELETE", {});
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;", function()
		{
			history.back();
		});
}
