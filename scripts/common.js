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
				html += "<span class=\"mainPage\">Kompetence: " + list[i].lessons[j].competences[0];
				for(var k = 1; k < list[i].lessons[j].competences.length; k++)
				{
					html += ", " + list[i].lessons[j].competences[k];
				}
				html += "</span>";
			}
		}
	}
	return html;
}

function popback()
{
	if(history.state)
	{
		getLesson(history.state.id, history.state.name , true);
	}
}
