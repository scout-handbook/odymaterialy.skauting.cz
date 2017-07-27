var lessonListEvent = new AfterLoadEvent(2);
var FIELDS = [];
var COMPETENCES = [];

function mainPageSetup()
{
	getMainPage();
	lessonListSetup();
}

function lessonListSetup()
{
	request("/API/v0.9/list_lessons", "", function(response)
		{
			FIELDS = JSON.parse(response);
			lessonListEvent.trigger();
		});
	request("/API/v0.9/list_competences", "", function(response)
		{
			COMPETENCES = JSON.parse(response);
			lessonListEvent.trigger();
		});
}

function getMainPage(noHistory)
{
	lessonListEvent.addCallback(function()
		{
			showMainPage(noHistory);
		});
}

function showMainPage(noHistory)
{
	var html = "<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div><div id=\"mainPageContainer\"><div id=\"mainPage\">";
	html += "<h1>OdyMateriály - administrace</h1>";
	html += "<div class=\"button\" id=\"addLesson\">Přidat lekci</div><br>";
	html += renderLessonList();
	html += "</div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	
	document.getElementById("addLesson").onclick = function()
		{
			addLesson();
		};
	nodes = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = itemOnClick;
	}
	nodes = document.getElementsByTagName("main")[0].getElementsByClassName("changeField");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = changeFieldOnClick;
	}
	nodes = document.getElementsByTagName("main")[0].getElementsByClassName("changeCompetences");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = changeCompetencesOnClick;
	}
	nodes = document.getElementsByTagName("main")[0].getElementsByClassName("deleteLesson");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = deleteLessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { lessonName: "" };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}
}

function itemOnClick(event)
{
	getLesson(event.target.dataset.id);
	return false;
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var secondLevel = "";
		if(FIELDS[i].name)
		{
			html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			secondLevel = " secondLevel";
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += "<h3 class=\"mainPage" + secondLevel + "\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
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
			html += "<div class=\"button mainPage" + secondLevel + " changeField\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit oblast</div>";
			html += "<div class=\"button mainPage changeCompetences\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit kompetence</div>";
			html += "<div class=\"button mainPage deleteLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Smazat lekci</div>";
		}
	}
	return html;
}
