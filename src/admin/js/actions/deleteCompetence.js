"use strict";
/* exported deleteCompetenceOnClick */

function deleteCompetenceOnClick(event)
{
	var number = "";
	var name = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === getAttribute(event, "id"))
		{
			number = COMPETENCES[i].number
			name = COMPETENCES[i].name
			break;
		}
	}

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);

	dialog("Opravdu si přejete smazat kompetenci " + number + ": \"" + name + "\"?", "Ano", aq.closeDispatch, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences");
	refreshLogin();
}
