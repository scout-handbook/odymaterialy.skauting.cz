"use strict";
/* exported deleteImageOnClick */

function deleteImageOnClick(event)
{
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/image/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);
	dialog("Opravdu si přejete smazat tento obrázek?", "Ano", aq.closeDispatch, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/images");
	refreshLogin();
}
