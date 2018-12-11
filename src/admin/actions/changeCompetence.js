"use strict";
/* exported changeCompetenceOnClick */

var competenceChanged = false;

function changeCompetenceOnClick(event)
{
	competenceChanged = false;
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeCompetenceSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit kompetenci</h3><form id=\"sidePanelForm\">";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === getAttribute(event, "id"))
		{
			html += "<span class=\"heading\">Kompetence</span> <input type=\"text\" class=\"formText formName\" id=\"competenceNumber\" value=\"" + COMPETENCES[i].number + "\" autocomplete=\"off\"><br>";
			html += "<input type=\"text\" class=\"formText\" id=\"competenceName\" value=\"" + COMPETENCES[i].name + "\" autocomplete=\"off\"><br>";
			html += "<textarea rows=\"5\" class=\"formText\" id=\"competenceDescription\" autocomplete=\"off\">" + COMPETENCES[i].description + "</textarea>";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence/" + encodeURIComponent(getAttribute(event, "id")), "PUT", changeCompetencePayloadBuilder)]);
	document.getElementById("changeCompetenceSave").onclick = aq.closeDispatch;

	function addOnChange(id)
	{
		document.getElementById(id).oninput = function()
			{
				competenceChanged = true;
			};
		document.getElementById(id).onchange = function()
			{
				competenceChanged = true;
			};
	}
	addOnChange("competenceNumber");
	addOnChange("competenceName");
	addOnChange("competenceDescription");

	history.pushState({"sidePanel": "open"}, "title", "/admin/competences");
	refreshLogin();
}

function changeCompetencePayloadBuilder()
{
	return {"number": encodeURIComponent(document.getElementById("competenceNumber").value), "name": encodeURIComponent(document.getElementById("competenceName").value), "description": encodeURIComponent(document.getElementById("competenceDescription").value)};
}
