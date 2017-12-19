function showCompetenceView(id, noHistory)
{
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
		{
			renderCompetenceView(id, noHistory);
		});
	refreshLogin();
}

function renderCompetenceView(id, noHistory)
{
	var competence = {};
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === id)
		{
			competence = COMPETENCES[i];
			break;
		}
	}
	var html = "<h1>" + competence.number + ": " + competence.name + "</h1>";
	html += competence.description;
	var lessonList = [];
	for(var j = 0; j < FIELDS.length; j++)
	{
		for(var k = 0; k < FIELDS[j].lessons.length; k++)
		{
			for(var m = 0; m < FIELDS[j].lessons[k].competences.length; m++)
			{
				if(FIELDS[j].lessons[k].competences[m] === competence.id)
				{
					lessonList.push(FIELDS[j].lessons[k]);
					break;
				}
			}
		}
	}
	html += renderCompetenceLessonList(lessonList);
	document.getElementById("content").innerHTML = html;

	nodes = document.getElementById("content").getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = TOCLessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/competence/" + id + "/" + urlEscape(competence.number + "-" + competence.name));
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function renderCompetenceLessonList(lessonList)
{
	var html = "";
	for(var n = 0; n < lessonList.length; n++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + lessonList[n].name + "\" href=\"/error/enableJS.html\" data-id=\"" + lessonList[n].id + "\">" + lessonList[n].name + "</a></h3>";
		if(lessonList[n].competences.length > 0)
		{
			var competences = [];
			for(var o = 0; o < COMPETENCES.length; o++)
			{
				if(lessonList[n].competences.indexOf(COMPETENCES[o].id) >= 0)
				{
					competences.push(COMPETENCES[o]);
				}
			}
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(var p = 1; p < competences.length; p++)
			{
				html += ", " + competences[p].number;
			}
			html += "</span>";
		}
	}
	return html;
}
