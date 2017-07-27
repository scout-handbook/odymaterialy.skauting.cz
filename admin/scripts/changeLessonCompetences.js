var lessonCompetencesChanged = false;

function changeLessonCompetencesOnClick(event)
{
	sidePanelOpen();
	var html = "";
	var checkedCompetences = [];
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == event.target.dataset.id)
			{
				html += "<h3 class=\"sidePanelTitle\">" + FIELDS[i].lessons[j].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeLessonCompetencesSave\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">"
				checkedCompetences = FIELDS[i].lessons[j].competences;
				break outer;
			}
		}
	}
	for(var k = 0; k < COMPETENCES.length; k++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\"";
		if(checkedCompetences.indexOf(COMPETENCES[k].id) >= 0)
		{
			html += " checked";
		}
		html += " data-id=\"" + COMPETENCES[k].id + "\"";
		html += "><span class=\"formCustom formCheckbox\"></span></label>";
		html += "<span class=\"competenceNumber\">" + COMPETENCES[k].number + ":</span> " + COMPETENCES[k].name + "</div>";
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;
	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeLessonCompetencesSave").onclick = changeLessonCompetencesSave;

	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = function()
			{
				lessonCompetencesChanged = true;
			};
	}

	history.pushState({}, "title", "/admin/");
}

function changeLessonCompetencesSave(event)
{
	if(lessonCompetencesChanged)
	{
		var query = "id=" + document.getElementById("changeLessonCompetencesSave").dataset.id;
		var competences = parseForm();
		for(i = 0; i < competences.length; i++)
		{
			query += "&competence[]=" + competences[i];
		}
		lessonCompetencesChanged = false;
		sidePanelClose();
		retryAction("/API/v0.9/update_lesson_competences", query);
	}
	else
	{
		history.back();
	}
}
