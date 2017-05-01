var converter;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
}

function getLesson(lesson, noHistory)
{
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	cacheThenNetworkRequest("/API/get_lesson.php", "name=" + encodeURIComponent(lesson), function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showLesson(name, markdown, noHistory)
{
	var html = converter.makeHtml(markdown);
	html = "<h1>" + name + "</h1>" + html;
	document.getElementById("content").innerHTML = html;
	document.getElementById("main").scrollTop = 0;
	var stateObject = { lessonName: name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/lesson/" + encodeURIComponent(name));
	}
	if("serviceWorker" in navigator)
	{
		caches.match("/API/get_lesson.php?name=" + encodeURIComponent(name)).then(function(response)
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

