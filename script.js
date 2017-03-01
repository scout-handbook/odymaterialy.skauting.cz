var converter;
var navOpen = true;

function listLessons(callback)
{
	cacheThenNetworkRequest("/API/list_lessons.php", "", function(response)
		{
			callback(JSON.parse(response));
		});
}

function getLesson(lesson, noHistory)
{
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	cacheThenNetworkRequest("/API/get_lesson.php", "name=" + lesson, function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showLessonList(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<h1>" + list[i].name + "</h1>";
		for(var j = 0; j < list[i].lessons.length; j++)
		{
			var name = list[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\" onclick=\"getLesson(\'" + name + "\');return false;\">" + name + "</a><br>";
		}
	}
	document.getElementById("navigation").innerHTML = html;
	document.getElementById("navBar").style.transition = "margin-left 0.3s ease";
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
}

function switchNav()
{
	navOpen = !navOpen;
	reflow();
}

function fontDecrease()
{
	var content = document.getElementById("content");
	var current = parseInt(window.getComputedStyle(content, null).getPropertyValue("font-size").replace("px", ""));
	content.style.fontSize = current - 2 + "px";
}

function fontIncrease()
{
	var content = document.getElementById("content");
	var current = parseInt(window.getComputedStyle(content, null).getPropertyValue("font-size").replace("px", ""));
	content.style.fontSize = current + 2 + "px";
}

function cacheThenNetworkRequest(url, query, callback)
{
	var networkDataReceived = false;
	request(url, query, false).then(function(response)
		{
			networkDataReceived = true;
			callback(response);
		});
	request(url, query, true).then(function(response)
		{
			if(!networkDataReceived)
			{
				callback(response);
			}
		});
}

function request(url, query, fromCache)
{
	return new Promise(function(resolve, reject)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
			{
				if (this.readyState === 4)
				{
					if(this.status === 200)
					{
						resolve(this.responseText);
					}
					else
					{
						reject(Error(this.statusText));
					}
				}
			}
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if(fromCache)
		{
			xhttp.setRequestHeader("Accept", "x-cache/only");
		}
		xhttp.send(query);
	});
}

function run()
{
	listLessons(showLessonList);
	converter = new showdown.Converter();
	converter.setOption("noHeaderId", "true");
	if (window.location.pathname.substring(0, 8) == "/lesson/")
	{
		var lessonName = decodeURIComponent(window.location.pathname.substring(8));
		getLesson(lessonName);
	}
	if("serviceWorker" in navigator)
	{
		navigator.serviceWorker.register("/serviceworker.js");
	}
}

function popback()
{
	if (window.location.pathname.substring(0, 8) == "/lesson/")
	{
		var lessonName = decodeURIComponent(window.location.pathname.substring(8));
		getLesson(lessonName, true);
	}
	else
	{
		document.getElementById("content").innerHTML = "";
	}
}

function reflow()
{
	if(navOpen)
	{
		document.getElementById("navBar").style.marginLeft = "0px"
		if(screen.width > 700)
		{
			document.getElementById("main").style.marginLeft = "300px"
		}
		else
		{
			document.getElementById("main").style.marginLeft = "0px"
		}
	}
	else
	{
		document.getElementById("navBar").style.marginLeft = "-300px"
		document.getElementById("main").style.marginLeft = "0px"
	}
}

window.onload = run;
window.onpopstate = popback;
window.onresize = reflow;

