var converter;
var activeCompetence = null;

function lessonViewSetup()
{
	converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	window.addEventListener("resize", reflowCompetenceBubbles)
}

function showLessonView(id, noHistory)
{
	document.getElementById("content").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	cacheThenNetworkRequest("/API/v0.9/lesson/" + id, "", function(response, second)
		{
			metadataEvent.addCallback(function()
				{
					renderLessonView(id, response, noHistory, second);
				});
		});
	refreshLogin();
}

function renderLessonView(id, markdown, noHistory, second)
{
	var lesson = {};
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
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
	for(var l = 0; l < competences.length; l++)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><p>" + competences[l].number + "</p></span><span class=\"competenceBubbleText\">" + competences[l].name + "</span><span class=\"competenceBubbleLessons\"><a title=\"Detail kompetence\" href=\"/error/enableJS.html\" data-id=\"" + competences[l].id + "\">Detail kompetence</a></span></span>";
	}
	html += filterXSS(converter.makeHtml(markdown));
	document.getElementById("content").innerHTML = html;
	nodes = document.getElementById("content").getElementsByClassName("competenceBubble");
	for(var m = 0; m < nodes.length; m++)
	{
		nodes[m].onclick = toggleCompetenceBubble;
	}
	nodes = document.getElementById("content").getElementsByClassName("competenceBubbleLessons");
	for(var n = 0; n < nodes.length; n++)
	{
		nodes[n].firstChild.onclick = competenceBubbleDetailOnClick;
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
