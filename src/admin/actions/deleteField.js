"use strict";
/* exported deleteFieldOnClick */

function deleteFieldOnClick(event)
{
	var name = "";
	var id = getAttribute(event, "id");
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === id)
		{
			name = FIELDS[i].name
			break;
		}
	}

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat oblast \"" + name + "\"?", "Ano", aq.closeDispatch, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
