function lessonSettings(id, actionQueue, noHistory)
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-right-open\"></i>Zavřít</div>";
	html += renderField();
	html += renderCompetences();
	html += prerenderGroups();
	document.getElementById("sidePanel").innerHTML = html;
	lessonSettingsCacheEvent.addCallback(renderGroups);

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

function prerenderGroups()
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Publikováno ve skupinách</h3>"
	html += "<div class=\"newButton cyanButton\" id=\"changeGroups\"><i class=\"icon-pencil\"></i>Upravit</div><br><div id=\"settingsGroupList\"><div id=\"embeddedSpinner\"></div></div>";
	return html;
}

function renderGroups()
{
	document.getElementById("changeGroups").style.display = "inline-block";
	var html = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(lessonSettingsCache.groups.indexOf(GROUPS[i].id) >= 0)
		{
			if(GROUPS[i].id == "00000000-0000-0000-0000-000000000000")
			{
				html += "<span class=\"publicGroup\">" + GROUPS[i].name + "</span><br>";
			}
			else
			{
				html += GROUPS[i].name + "<br>";
			}
		}
	}
	document.getElementById("settingsGroupList").innerHTML = html;
}

function populateEditorCache(id)
{
	lessonSettingsCacheEvent = new AfterLoadEvent(1);
	request("/API/v0.9/lesson/" + id + "/group", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				lessonSettingsCache["groups"] = response.response;
				lessonSettingsCacheEvent.trigger();
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
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
