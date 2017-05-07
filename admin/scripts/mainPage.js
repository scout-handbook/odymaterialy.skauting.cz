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
	getLesson(event.srcElement.dataset.id, event.srcElement.innerHTML);
	return false;
}
