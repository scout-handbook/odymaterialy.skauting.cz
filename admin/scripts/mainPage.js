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
	var html = "<div id=\"mainPage\">";
	html += "<h1>OdyMateriály - administrace</h1>";
	html += "<div class=\"button\" id=\"addLesson\">Nová lekce</div><br>";
	html += renderLessonList();
	html += "</div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	
	document.getElementById("addLesson").onclick = addLesson;
	nodes = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = itemOnClick;
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
		if(FIELDS[i].name)
		{
			html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage secondLevel\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
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
					html += "<span class=\"mainPage secondLevel\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span>";
				}
			}
		}
		else
		{
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
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
					html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span>";
				}
			}
		}
	}
	return html;
}
