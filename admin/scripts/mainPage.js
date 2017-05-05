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
	var html = "<h1>OdyMateriály - administrace</h1>";
	for(var i = 0; i < lessonList.length; i++)
	{
		html += "<h2 class=\"mainPage\">" + lessonList[i].name + "</h2>";
		for(var j = 0; j < lessonList[i].lessons.length; j++)
		{
			var name = lessonList[i].lessons[j].name;
			html += "<h3 class=\"mainPage\"><a title=\"" + name + "\" href=\"/error/enableJS.html\">" + name + "</a></h3>";
			if(lessonList[i].lessons[j].competences.length > 0)
			{
				html += "<span class=\"mainPage\">Kompetence: " + lessonList[i].lessons[j].competences[0];
				for(var k = 1; k < lessonList[i].lessons[j].competences.length; k++)
				{
					html += ", " + lessonList[i].lessons[j].competences[k];
				}
				html += "</span>";
			}
		}
	}
	document.getElementsByTagName("main")[0].innerHTML = html;
	
	nodes = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = itemOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/admin/");
	}
}

function itemOnClick(event)
{
	getLesson(event.srcElement.innerHTML);
	return false;
}
