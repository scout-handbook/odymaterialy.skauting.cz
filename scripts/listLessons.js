function listLessonsSetup()
{
	listLessons();
}

function listLessons()
{
	cacheThenNetworkRequest("/API/list_lessons", "", function(response)
		{
			showLessonList(JSON.parse(response));
		});
}

function showLessonList(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<h1>" + list[i].name + "</h1>";
		for(var j = 0; j < list[i].lessons.length; j++)
		{
			var name = list[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\">" + name + "</a><br>";
		}
	}
	document.getElementById("navigation").innerHTML = html;
	nodes = document.getElementById("navigation").getElementsByTagName("a");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = itemOnClick;
	}
	document.getElementById("navBar").style.transition = "margin-left 0.3s ease";
}

function itemOnClick(event)
{
	getLesson(event.srcElement.innerHTML);
	return false;
}

