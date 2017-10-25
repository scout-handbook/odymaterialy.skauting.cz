var lessonListEvent = new AfterLoadEvent(2);

function listLessonsSetup()
{
	cacheThenNetworkRequest("/API/v0.9/lesson", "", function(response, second)
		{
			FIELDS = response;
			if(!second)
			{
				lessonListEvent.trigger();
			}
		});
	cacheThenNetworkRequest("/API/v0.9/competence", "", function(response, second)
		{
			COMPETENCES = response;
			if(!second)
			{
				lessonListEvent.trigger();
			}
		});
	lessonListEvent.addCallback(showLessonList);
}

function showLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].name)
		{
			html += "<h1><a title=\"" + FIELDS[i].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].id + "\">" + FIELDS[i].name + "</a></h1>";
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<a class=\"secondLevel\" title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a><br>";
			}
		}
		else
		{
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a><br>";
			}
		}
	}
	document.getElementById("navigation").innerHTML = html;
	nodes = document.getElementById("navigation").getElementsByTagName("a");
	for(var k = 0; k < nodes.length; k++)
	{
		if(nodes[k].parentElement.tagName == "H1")
		{
			nodes[k].onclick = fieldOnClick;
		}
		else
		{
			nodes[k].onclick = lessonOnClick;
		}
	}
	document.getElementsByTagName("nav")[0].style.transition = "margin-left 0.3s ease";
}

function fieldOnClick(event)
{
	showFieldView(event.target.dataset.id);
	return false;
}

function lessonOnClick(event)
{
	showLessonView(event.target.dataset.id);
	return false;
}
