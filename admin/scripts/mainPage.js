function mainPageSetup()
{
	getMainPage();
}

function getMainPage(noHistory)
{
	request("/API/list_lessons", "", function(response)
		{
			showMainPage(JSON.parse(response), noHistory);
		});
}

function showMainPage(lessonList, noHistory)
{
	var html = "<div id=\"mainPage\">";
	html += "<h1>OdyMateriály - administrace</h1>";
	html += renderLessonList(lessonList);
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
	getLesson(event.srcElement.dataset.id, event.srcElement.innerHTML, JSON.parse(event.srcElement.dataset.competences));
	return false;
}

function renderLessonList(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<h2 class=\"mainPage\">" + list[i].name + "</h2>";
		for(var j = 0; j < list[i].lessons.length; j++)
		{
			var name = list[i].lessons[j].name;
			var chtml = "";
			var competences = [];
			if(list[i].lessons[j].competences.length > 0)
			{
				competences.push(list[i].lessons[j].competences[0].id);
				chtml += "<span class=\"mainPage\">Kompetence: " + list[i].lessons[j].competences[0].number;
				for(var k = 1; k < list[i].lessons[j].competences.length; k++)
				{
					competences.push(list[i].lessons[j].competences[k].id);
					chtml += ", " + list[i].lessons[j].competences[k].number;
				}
				chtml += "</span>";
			}
			html += "<h3 class=\"mainPage\"><a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + list[i].lessons[j].id + "\" data-competences=\"" + JSON.stringify(competences) + "\">" + name + "</a></h3>";
			html += chtml;
		}
	}
	return html;
}
