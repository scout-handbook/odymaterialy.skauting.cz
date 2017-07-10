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
	var name = "";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				name = FIELDS[i].lessons[j].name;
				break outer;
			}
		}
	}
	var html = "<h1>" + name + "</h1>";
	html += converter.makeHtml(markdown);
	document.getElementById("content").innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { "id": id };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/lesson/" + id + "/" + encodeURIComponent(name));
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
