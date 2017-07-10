function listLessonsSetup()
{
	listLessons(showLessonList);
}

function listLessons(callback)
{
	cacheThenNetworkRequest("/API/v0.9/list_lessons", "", function(response)
		{
			FIELDS = JSON.parse(response);
			callback();
		});
}

function showLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		html += "<h1>" + FIELDS[i].name + "</h1>";
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			var name = FIELDS[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + name + "</a><br>";
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
	getLesson(event.srcElement.dataset.id);
	return false;
}
