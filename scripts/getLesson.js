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
			lessonListEvent.addCallback(function()
				{
					showLesson(id, response, noHistory);
				});
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
	var competences = [];
	for(var k = 0; k < COMPETENCES.length; k++)
	{
		for(var l = 0; l < lesson.competences.length; l++)
		{
			if(lesson.competences[l].id === COMPETENCES[k].id)
			{
				competences.push(COMPETENCES[k]);
				break;
			}
		}
	}
	var html = "<h1>" + lesson.name + "</h1>";
	for(var k = 0; k < competences.length; k++)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><span><p>" + competences[k].number + "</p></span></span><span class=\"competenceBubbleText\">" + competences[k].name + "</span></span>";
	}
	html += converter.makeHtml(markdown);
	document.getElementById("content").innerHTML = html;
	nodes = document.getElementById("content").getElementsByClassName("competenceBubble");
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
	while(!element.classList.contains("competenceBubble") && (element = element.parentElement)) {}
	if(element.style.width !== "")
	{
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
		element.childNodes[1].style.width = Math.min(360, element.parentElement.clientWidth - 40) + "px";
		element.style.width = Math.min(400, element.parentElement.clientWidth) + "px";
		element.style.height = element.childNodes[1].offsetHeight + "px";
		element.firstChild.style.color = "#6534ad";
		element.style.borderColor = "#6534ad";
		element.style.backgroundColor = "#f5f5f5";
	}
}
