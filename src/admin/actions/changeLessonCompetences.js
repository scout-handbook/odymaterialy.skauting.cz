"use strict";
/* exported changeLessonCompetencesOnClick */

var lessonCompetencesChanged = false;

function changeLessonCompetencesOnClick(id, actionQueue)
{
	lessonCompetencesChanged = false;
	var html = "<div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeLessonCompetencesSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit kompetence</h3><form id=\"sidePanelForm\">";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\"";
		if(lessonSettingsCache.competences.indexOf(COMPETENCES[i].id) >= 0)
		{
			html += " checked";
		}
		html += " data-id=\"" + COMPETENCES[i].id + "\"";
		html += "><span class=\"formCustom formCheckbox\"></span></label>";
		html += "<span class=\"competenceNumber\">" + COMPETENCES[i].number + ":</span> " + COMPETENCES[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};
	document.getElementById("changeLessonCompetencesSave").onclick = function() {changeLessonCompetencesSave(id, actionQueue);};

	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var j = 0; j < nodes.length; j++)
	{
		nodes[j].onchange = lessonCompetenceOnclick;
	}

	refreshLogin();
}

function lessonCompetenceOnclick()
{
	lessonCompetencesChanged = true;
}

function changeLessonCompetencesSave(id, actionQueue)
{
	if(lessonCompetencesChanged)
	{
		id = typeof id !== 'undefined' ? id : "{id}";
		var competences = parseBoolForm();
		var encodedCompetences = [];
		for(var i = 0; i < competences.length; i++)
		{
			encodedCompetences.push(encodeURIComponent(competences[i]));
		}
		actionQueue.actions.push(new Action(CONFIG.apiuri + "/lesson/" + id + "/competence", "PUT", function() {return {"competence": encodedCompetences};}));
		lessonSettingsCache.competences = competences;
		lessonSettings(id, actionQueue, true);
	}
	else
	{
		lessonSettings(id, actionQueue, true);
	}
}
