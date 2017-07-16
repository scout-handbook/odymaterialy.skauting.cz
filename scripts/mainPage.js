function getMainPage(noHistory)
{
	lessonListEvent.addCallback(function()
		{
			showMainPage(noHistory);
		});
}

function showMainPage(noHistory)
{
	var html = "<h1>OdyMateriály</h1>";
	html += renderLessonList();
	document.getElementById("content").innerHTML = html;

	nodes = document.getElementById("content").getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = lessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].name)
		{
			html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage secondLevel\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
				if(FIELDS[i].lessons[j].competences.length > 0)
				{
					var competences = [];
					for(var k = 0; k < COMPETENCES.length; k++)
					{
						if(FIELDS[i].lessons[j].competences.indexOf(COMPETENCES[k].id) >= 0)
						{
							competences.push(COMPETENCES[k]);
						}
					}
					html += "<span class=\"mainPage secondLevel\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span>";
				}
			}
		}
		else
		{
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
				if(FIELDS[i].lessons[j].competences.length > 0)
				{
					var competences = [];
					for(var k = 0; k < COMPETENCES.length; k++)
					{
						if(FIELDS[i].lessons[j].competences.indexOf(COMPETENCES[k].id) >= 0)
						{
							competences.push(COMPETENCES[k]);
						}
					}
					html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span>";
				}
			}
		}
	}
	return html;
}
