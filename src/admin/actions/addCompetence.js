"use strict";
/* exported addCompetence */

function addCompetence()
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addCompetenceSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat kompetenci</h3><form id=\"sidePanelForm\">";
	html += "<span class=\"heading\">Kompetence</span> <input type=\"text\" class=\"formText formName\" id=\"competenceNumber\" value=\"00\" autocomplete=\"off\"><br>";
	html += "<input type=\"text\" class=\"formText\" id=\"competenceName\" value=\"Nová kompetence\" autocomplete=\"off\"><br>";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"competenceDescription\" autocomplete=\"off\">Popis nové kompetence</textarea>";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence", "POST", addCompetencePayloadBuilder)]);
	document.getElementById("addCompetenceSave").onclick = aq.closeDispatch;

	history.pushState({"sidePanel": "open"}, "title", "/admin/competences");
	refreshLogin();
}

function addCompetencePayloadBuilder()
{
	return {"number": encodeURIComponent(document.getElementById("competenceNumber").value), "name": encodeURIComponent(document.getElementById("competenceName").value), "description": encodeURIComponent(document.getElementById("competenceDescription").value)};
}
