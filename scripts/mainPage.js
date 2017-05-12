function getMainPage(noHistory)
{
	listLessons(function(lessonList)
		{
			showMainPage(lessonList, noHistory);
		});
}

function showMainPage(lessonList, noHistory)
{
	var html = "<h1>OdyMateriály</h1>";
	html += renderLessonList(lessonList);
	document.getElementById("content").innerHTML = html;

	nodes = document.getElementById("content").getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = itemOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
	document.getElementById("offlineSwitch").style.display = "none";
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
			html += "<h3 class=\"mainPage\"><a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + list[i].lessons[j].id + "\">" + name + "</a></h3>";
			if(list[i].lessons[j].competences.length > 0)
			{
				html += "<span class=\"mainPage\">Kompetence: " + list[i].lessons[j].competences[0].number;
				for(var k = 1; k < list[i].lessons[j].competences.length; k++)
				{
					html += ", " + list[i].lessons[j].competences[k].number;
				}
				html += "</span>";
			}
		}
	}
	return html;
}
