"use strict";
/* exported showLessonSubview */

function showLessonSubview(noHistory)
{
	window.mainPageTab = "lessons";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("lessonManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Lekce</h1>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button greenButton\" id=\"addField\"><i class=\"icon-plus\"></i>Přidat oblast</div>";
	}
	html += "<div class=\"button greenButton\" id=\"addLesson\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button\" id=\"restoreLesson\"><i class=\"icon-history\"></i>Smazané lekce</div>";
	}
	html += renderLessonList();
	document.getElementById("mainPage").innerHTML = html;
	document.getElementById("mainPageContainer").scrollTop = 0;

	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("addField").onclick = addField;
	}
	document.getElementById("addLesson").onclick = function() {showLessonAddView();};
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("restoreLesson").onclick = restoreLesson;
	}

	addOnClicks("changeField", changeFieldOnClick);
	addOnClicks("deleteField", deleteFieldOnClick);
	addOnClicks("addLessonInField", addLessonInFieldOnClick);
	addOnClicks("changeLesson", changeLessonOnClick);
	addOnClicks("deleteLesson", deleteLessonOnClick);
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
			if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
			{
				html += "<div class=\"button cyanButton changeField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
				html += "<div class=\"button redButton deleteField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
			}
			html += "<div class=\"button greenButton addLessonInField\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += renderLessonListLesson(FIELDS[i].lessons[j], secondLevel);
		}
	}
	return html;
}

function renderLessonListLesson(lesson, secondLevel)
{
	var html = "<br><h3 class=\"mainPage" + secondLevel + "\">" + lesson.name + "</h3>";
	html += "<div class=\"button cyanButton changeLesson\" data-id=\"" + lesson.id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button redButton deleteLesson\" data-id=\"" + lesson.id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
	}
	html += "<a href=\"" + CONFIG.baseuri + "/admin/lesson/" + lesson.id + "\" target=\"_blank\" class=\"button exportLesson\"><i class=\"icon-file-pdf\"></i>PDF</a>";
	html += "<br><span class=\"mainPage" + secondLevel + "\">Kompetence: ";
	if(lesson.competences.length > 0)
	{
		var competences = [];
		for(var k = 0; k < COMPETENCES.length; k++)
		{
			if(lesson.competences.indexOf(COMPETENCES[k].id) >= 0)
			{
				competences.push(COMPETENCES[k]);
			}
		}
		html += competences[0].number;
		for(var m = 1; m < competences.length; m++)
		{
			html += ", " + competences[m].number;
		}
	}
	html += "</span>";
	return html;
}

function changeLessonOnClick(event)
{
	showLessonEditView(getAttribute(event, "id"));
	return false;
}
