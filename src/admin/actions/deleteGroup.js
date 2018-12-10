"use strict";
/* exported deleteGroupOnClick */

function deleteGroupOnClick(event)
{
	var name = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === getAttribute(event, "id"))
		{
			name = GROUPS[i].name
			break;
		}
	}

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/group/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);
	dialog("Opravdu si přejete smazat skupinu \"" + name + "\"?", "Ano", aq.closeDispatch, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}
