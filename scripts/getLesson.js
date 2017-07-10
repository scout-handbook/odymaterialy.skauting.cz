var converter;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
}

function getLesson(id, noHistory)
{
	if(!id)
	{
		getMainPage(noHistory);
		return;
	}
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	cacheThenNetworkRequest("/API/v0.9/get_lesson", "id=" + id, function(response)
		{
			showLesson(id, response, noHistory);
		});
}

function showLesson(id, markdown, noHistory)
{
	var lesson = {};
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				lesson = FIELDS[i].lessons[j];
				break outer;
			}
		}
	}
	var html = "<h1>" + lesson.name + "</h1>";
	for(var k = 0; k < lesson.competences.length; k++)
	{
		html += "<span class=\"competence\"><span class=\"competenceNumber\"><span><p>" + lesson.competences[k].number + "</p></span></span><span class=\"competenceText\">Lorem ipsum dolor sit amet consectetur adipiscing elit. Nun novam queribus et tu molus est distractus megalomanis.Qui perse nova agia via maria ecclesia. Pro orat mater filibus et iudeorem deus.</span></span>";
	}
	html += converter.makeHtml(markdown);
	document.getElementById("content").innerHTML = html;
	nodes = document.getElementById("content").getElementsByClassName("competence");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = competenceExpand;
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { "id": id };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/lesson/" + id + "/" + encodeURIComponent(lesson.name));
	}
	if("serviceWorker" in navigator)
	{
		caches.match("/API/v0.9/get_lesson?id=" + id).then(function(response)
			{
				if(response === undefined)
				{
					document.getElementById("cacheOffline").checked = false;
				}
				else
				{
					document.getElementById("cacheOffline").checked = true;
				}
			});
		document.getElementById("offlineSwitch").style.display = "block";
	}
}

function competenceExpand(event)
{
	element = event.target;
	while(!element.classList.contains("competence") && (element = element.parentElement)) {}
	if(element.style.width == "400px")
	{
		element.style.width = "";
		element.style.maxHeight = "";
		element.firstChild.style.color = "";
		element.style.borderColor = "";
		element.style.backgroundColor = "";
	}
	else
	{
		nodes = document.getElementById("content").getElementsByClassName("competence");
		for(var i = 0; i < nodes.length; i++)
		{
			nodes[i].style.width = "";
			nodes[i].style.maxHeight = "";
			nodes[i].firstChild.style.color = "";
			nodes[i].style.borderColor = "";
			nodes[i].style.backgroundColor = "";
		}
		element.style.width = "400px";
		element.style.maxHeight = "10em";
		element.firstChild.style.color = "#6534ad";
		element.style.borderColor = "#6534ad";
		element.style.backgroundColor = "#f5f5f5";
	}
}
