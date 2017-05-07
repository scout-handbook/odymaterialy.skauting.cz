function mainPageSetup()
{
	getMainPage();
}

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
