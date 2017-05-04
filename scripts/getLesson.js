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
	var html = "<h1>OdyMateriály</h1>";
	for(var i = 0; i < lessonList.length; i++)
	{
		html += "<h2 class=\"mainPage\">" + lessonList[i].name + "</h2>";
		for(var j = 0; j < lessonList[i].lessons.length; j++)
		{
			var name = lessonList[i].lessons[j].name;
			html += "<h3 class=\"mainPage\"><a title=\"" + name + "\" href=\"/error/enableJS.html\">" + name + "</a></h3><br>";
			if(lessonList[i].lessons[j].competences.length > 0)
			{
				html += "Kompetence: " + lessonList[i].lessons[j].competences[0];
				for(var k = 1; k < lessonList[i].lessons[j].competences.length; k++)
				{
					html += ", " + lessonList[i].lessons[j].competences[k];
				}
				html += "<br>";
			}
		}
	}
	document.getElementById("content").innerHTML = html;
	
	nodes = document.getElementById("content").getElementsByTagName("h3");
	for(var k = 0; k < nodes.length; k++)
	{
		console.log(nodes[k].firstChild);
		nodes[k].firstChild.onclick = itemOnClick;
	}

	document.getElementById("main").scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
}
