"use strict";
/* exported addGroup */

function addGroup()
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addGroupSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat skupinu</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText\" id=\"groupName\" value=\"Nová skupina\" autocomplete=\"off\"><br>";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/group", "POST", addGroupPayloadBuilder)]);
	document.getElementById("addGroupSave").onclick = aq.closeDispatch;

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}

function addGroupPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("groupName").value)};
}
