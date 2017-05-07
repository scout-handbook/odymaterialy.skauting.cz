var converter;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
}

function getLesson(id, name, noHistory)
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
	cacheThenNetworkRequest("/API/get_lesson", "id=" + id, function(response)
		{
			showLesson(id, name, response, noHistory);
		});
}

function showLesson(id, name, markdown, noHistory)
{
	var html = "<h1>" + name + "</h1>";
	html += converter.makeHtml(markdown);
	document.getElementById("content").innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { "id": id, "name": name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/lesson/" + id + "/" + encodeURIComponent(name));
	}
	if("serviceWorker" in navigator)
	{
		caches.match("/API/get_lesson?id=" + id).then(function(response)
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
	}
	if("serviceWorker" in navigator)
	{
		document.getElementById("offlineSwitch").style.display = "block";
	}
}
