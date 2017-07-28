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

	var stateObject = { "sidePanel": "open" };
	history.pushState(stateObject, "title", "/admin/");

	dialog("Opravdu si přejete smazat oblast \"" + name + "\"?", "Ano", function()
		{
			retryAction("/API/v0.9/delete_field", "id=" + encodeURIComponent(event.target.dataset.id));
		}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;", function()
		{
			history.back();
		});
}
