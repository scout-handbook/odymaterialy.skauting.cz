"use strict";
/* exported changeGroupOnClick */

var groupChanged = false;

function changeGroupOnClick(event)
{
	groupChanged = false;
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeGroupSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit skupinu</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === getAttribute(event, "id"))
		{
			html += "<input type=\"text\" class=\"formText\" id=\"groupName\" value=\"" + GROUPS[i].name + "\" autocomplete=\"off\"><br>";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/group/" + encodeURIComponent(getAttribute(event, "id")), "PUT", changeGrouPayloadBuilder)]);
	document.getElementById("changeGroupSave").onclick = aq.closeDispatch;

	document.getElementById("groupName").oninput = function()
		{
			groupChanged = true;
		};
	document.getElementById("groupName").onchange = function()
		{
			groupChanged = true;
		};

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}

function changeGrouPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("groupName").value)};
}
