"use strict";
/* exported changeFieldOnClick */

var fieldChanged = false;

function changeFieldOnClick(event)
{
	fieldChanged = false;
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit oblast</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === getAttribute(event, "id"))
		{
			html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"" + FIELDS[i].name + "\" autocomplete=\"off\">";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field/" + encodeURIComponent(getAttribute(event, "id")), "PUT", changeFieldPayloadBuilder)]);
	document.getElementById("changeFieldSave").onclick = aq.closeDispatch;

	document.getElementById("fieldName").oninput = function()
		{
			fieldChanged = true;
		};
	document.getElementById("fieldName").onchange = function()
		{
			fieldChanged = true;
		};

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}

function changeFieldPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("fieldName").value)};
}
