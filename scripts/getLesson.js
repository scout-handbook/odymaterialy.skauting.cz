var converter;
var activeCompetence = null;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	window.addEventListener("resize", competenceReflow)
}

function getLesson(id, noHistory)
{
	document.getElementById("content").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	cacheThenNetworkRequest("/API/v0.9/lesson/" + id, "", function(response, second)
		{
			lessonListEvent.addCallback(function()
				{
					showLesson(id, response, noHistory, second);
				});
		});
	refreshLogin();
}

function showLesson(id, markdown, noHistory, second)
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
	var competences = [];
	for(var k = 0; k < COMPETENCES.length; k++)
	{
		if(lesson.competences.indexOf(COMPETENCES[k].id) >=0)
		{
			competences.push(COMPETENCES[k]);
		}
	}
	var html = "<h1>" + lesson.name + "</h1>";
	activeCompetence = null;
	for(var k = 0; k < competences.length; k++)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><p>" + competences[k].number + "</p></span><span class=\"competenceBubbleText\">" + competences[k].name + "</span><span class=\"competenceBubbleLessons\"><a title=\"Detail kompetence\" href=\"/error/enableJS.html\" data-id=\"" + competences[k].id + "\">Detail kompetence</a></span></span>";
	}
	html += filterXSS(converter.makeHtml(markdown));
	document.getElementById("content").innerHTML = html;
	nodes = document.getElementById("content").getElementsByClassName("competenceBubble");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = competenceExpand;
	}
	nodes = document.getElementById("content").getElementsByClassName("competenceBubbleLessons");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = competenceLessonsOnClick;
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!second)
	{
		if(!noHistory)
		{
			history.pushState({"id": id}, "title", "/lesson/" + id + "/" + urlEscape(lesson.name));

		}
	}
	if("serviceWorker" in navigator)
	{
		caches.match("/API/v0.9/lesson/" + id).then(function(response)
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
	while(!element.classList.contains("competenceBubble") && (element = element.parentElement)) {}
	if(element.style.width !== "")
	{
		activeCompetence = null;
		element.childNodes[1].style.width = "";
		element.style.width = "";
		element.style.height = "";
		element.firstChild.style.color = "";
		element.style.borderColor = "";
		element.style.backgroundColor = "";
	}
	else
	{
		nodes = document.getElementById("content").getElementsByClassName("competenceBubble");
		for(var i = 0; i < nodes.length; i++)
		{
			nodes[i].childNodes[1].style.width = "";
			nodes[i].style.width = "";
			nodes[i].style.height = "";
			nodes[i].firstChild.style.color = "";
			nodes[i].style.borderColor = "";
			nodes[i].style.backgroundColor = "";
		}
		activeCompetence = element;
		competenceReflow();
		element.firstChild.style.color = "#6534ad";
		element.style.borderColor = "#6534ad";
		element.style.backgroundColor = "#f5f5f5";
	}
}

function competenceReflow()
{
	if(activeCompetence)
	{
		var fontSize = parseFloat(window.getComputedStyle(activeCompetence).getPropertyValue("font-size"));
		activeCompetence.childNodes[1].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.childNodes[2].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.style.width = Math.min(400, activeCompetence.parentElement.clientWidth) + "px";
		activeCompetence.style.height = (activeCompetence.childNodes[1].offsetHeight + 1.4 * fontSize - 6) + "px";
	}
}

function competenceLessonsOnClick(event)
{
	getCompetence(event.target.dataset.id)
	return false;
}
