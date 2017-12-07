function showLessonSubview(noHistory)
{
	mainPageTab = "lessons";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("lessonManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Lekce</h1>";
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		html += "<div class=\"newButton addButton\" id=\"addField\"><i class=\"icon-plus\"></i>Přidat oblast</div>";
	}
	html += "<div class=\"newButton addButton\" id=\"addLesson\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
	html += renderLessonList();
	document.getElementById("mainPage").innerHTML = html;

	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		document.getElementById("addField").onclick = addField;
	}
	document.getElementById("addLesson").onclick = function() {showLessonAddView();};

	addOnClicks("changeField", changeFieldOnClick);
	addOnClicks("deleteField", deleteFieldOnClick);
	addOnClicks("addLessonInField", addLessonInFieldOnClick);
	addOnClicks("changeLesson", changeLessonOnClick);
	addOnClicks("changeLessonField", changeLessonFieldOnClick);
	addOnClicks("changeLessonCompetences", changeLessonCompetencesOnClick);
	addOnClicks("deleteLesson", deleteLessonOnClick);
	addOnClicks("exportLesson", exportLessonOnClick);
	addOnClicks("changeLessonGroups", changeLessonGroupsOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "lessons"}, "title", "/admin/lessons");
	}
	refreshLogin(true);
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var secondLevel = "";
		if(FIELDS[i].name)
		{
			secondLevel = " secondLevel";
			html += "<br><h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
			{
				html += "<div class=\"newButton editButton changeField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
				html += "<div class=\"newButton deleteButton deleteField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
			}
			html += "<div class=\"newButton addButton addLessonInField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += "<br><h3 class=\"mainPage" + secondLevel + "\">" + FIELDS[i].lessons[j].name + "</h3>";
			html += "<div class=\"newButton editButton" + secondLevel + " changeLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
			if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
			{
				html += "<div class=\"newButton deleteButton deleteLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
			}
			html += "<div class=\"newButton exportLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-file-pdf\"></i>PDF</div>";
			html += "<br>"
			if(FIELDS[i].lessons[j].competences.length > 0)
			{
				var competences = [];
				for(var k = 0; k < COMPETENCES.length; k++)
				{
					if(FIELDS[i].lessons[j].competences.indexOf(COMPETENCES[k].id) >= 0)
					{
						competences.push(COMPETENCES[k]);
					}
				}
				html += "<span class=\"mainPage" + secondLevel + "\">Kompetence: " + competences[0].number;
				for(var m = 1; m < competences.length; m++)
				{
					html += ", " + competences[m].number;
				}
				html += "</span><br>";
			}
			html += "<div class=\"button mainPage changeLessonField\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změň oblast</div>";
			html += "<div class=\"button mainPage changeLessonCompetences\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změň kompetence</div>";
			html += "<div class=\"button mainPage changeLessonGroups\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Publikuj</div>";
		}
	}
	return html;
}

function changeLessonOnClick(event)
{
	showLessonEditView(event.target.dataset.id);
	return false;
}

function exportLessonOnClick(event)
{
	window.open("/API/v0.9/lesson/" + event.target.dataset.id + "/pdf")
	return false;
}
