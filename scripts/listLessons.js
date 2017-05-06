function listLessonsSetup()
{
	listLessons(showLessonList);
}

function listLessons(callback)
{
	cacheThenNetworkRequest("/API/list_lessons", "", function(response)
		{
			callback(JSON.parse(response));
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
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + list[i].lessons[j].id + "\">" + list[i].lessons[j].name + "</a><br>";
		}
	}
	document.getElementById("navigation").innerHTML = html;
	nodes = document.getElementById("navigation").getElementsByTagName("a");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = itemOnClick;
	}
	document.getElementsByTagName("nav")[0].style.transition = "margin-left 0.3s ease";
}

function itemOnClick(event)
{
	getLesson(event.srcElement.dataset.id, event.srcElement.innerHTML);
	return false;
}
