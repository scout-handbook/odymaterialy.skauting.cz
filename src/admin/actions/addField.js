"use strict";
/* exported addField */

function addField()
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat oblast</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"Nová oblast\" autocomplete=\"off\">";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field", "POST", addFiledPayloadBuilder)]);
	document.getElementById("addFieldSave").onclick = aq.closeDispatch;

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}

function addFiledPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("fieldName").value)};
}
