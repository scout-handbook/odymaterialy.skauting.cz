function deleteCompetenceOnClick(event)
{
	var number = "";
	var name = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id == event.target.dataset.id)
		{
			number = COMPETENCES[i].number
			name = COMPETENCES[i].name
			break;
		}
	}

	dialog("Opravdu si přejete smazat kompetenci " + number + ": \"" + name + "\"?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/competence/" + encodeURIComponent(event.target.dataset.id), "DELETE", {});
		}, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences");
	refreshLogin();
}
