var lessonListEvent = new AfterLoadEvent(2);

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
	html += renderLessonList();
	html += "</div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	
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
	getLesson(event.target.dataset.id, JSON.parse(event.target.dataset.competences));
	return false;
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			var name = FIELDS[i].lessons[j].name;
			var chtml = "";
			var competences = [];
			if(FIELDS[i].lessons[j].competences.length > 0)
			{
				competences.push(FIELDS[i].lessons[j].competences[0].id);
				chtml += "<span class=\"mainPage\">Kompetence: " + FIELDS[i].lessons[j].competences[0].number;
				for(var k = 1; k < FIELDS[i].lessons[j].competences.length; k++)
				{
					competences.push(FIELDS[i].lessons[j].competences[k].id);
					chtml += ", " + FIELDS[i].lessons[j].competences[k].number;
				}
				chtml += "</span>";
			}
			html += "<h3 class=\"mainPage\"><a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\" data-competences=\"" + JSON.stringify(competences) + "\">" + name + "</a></h3>";
			html += chtml;
		}
	}
	return html;
}
