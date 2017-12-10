function lessonSettings(id, actionQueue, noHistory)
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-right-open\"></i>Zavřít</div>";
	html += renderField();
	html += renderCompetences();
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeField").onclick = function() {changeLessonFieldOnClick(id, actionQueue);};
	document.getElementById("changeCompetences").onclick = function() {changeLessonCompetencesOnClick(id, actionQueue);};
	if(!noHistory)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	}
	refreshLogin();
}

function renderField()
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Oblast</h3>"
	html += "<div class=\"newButton cyanButton\" id=\"changeField\"><i class=\"icon-pencil\"></i>Upravit</div><br>";
	if(lessonSettingsCache.field == "")
	{
		html += "<span class=\"anonymousField\">Nezařazeno</span>"
	}
	else
	{
		for(var i = 0; i < FIELDS.length; i++)
		{
			if(FIELDS[i].id && FIELDS[i].id == lessonSettingsCache.field)
			{
				html += FIELDS[i].name;
				break;
			}
		}
	}
	return html;
}

function renderCompetences()
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Kompetence</h3>"
	html += "<div class=\"newButton cyanButton\" id=\"changeCompetences\"><i class=\"icon-pencil\"></i>Upravit</div>";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(lessonSettingsCache.competences.indexOf(COMPETENCES[i].id) >= 0)
		{
			html += "<br><span class=\"competenceNumber\">" + COMPETENCES[i].number + ":</span> " + COMPETENCES[i].name;
		}
	}
	return html;
}

function populateEditorCache(id)
{
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				if(FIELDS[i].id)
				{
					lessonSettingsCache["field"] = FIELDS[i].id;
				}
				else
				{
					lessonSettingsCache["field"] = "";
				}
				lessonSettingsCache["competences"] = FIELDS[i].lessons[j].competences;
				break outer;
			}
		}
	}
}
