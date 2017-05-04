var converter;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	getLesson();
}

function getLesson(lesson, noHistory)
{
	if(lesson === undefined)
	{
		listLessons(function(lessonList)
			{
				showMainPage(lessonList, noHistory);
			});
		return;
	}
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	cacheThenNetworkRequest("/API/get_lesson", "name=" + encodeURIComponent(lesson), function(response)
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
		caches.match("/API/get_lesson?name=" + encodeURIComponent(name)).then(function(response)
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

function showMainPage(lessonList, noHistory)
{
	document.getElementById("content").innerHTML = "Main Page";
}
