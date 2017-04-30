var CACHE = "odymaterialy-v1";
var converter;
var navOpen = true;

function getLoginState(callbackUser, callbackGuest)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				response = JSON.parse(this.responseText);
				if(response.login_state)
				{
					callbackUser(response);
				}
				else
				{
					callbackGuest(response);
				}
			}
		}
	xhttp.open("GET", "/server/get_login_state.php?returnUri=" + window.location.pathname, true);
	xhttp.send();
}

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
	cacheThenNetworkRequest("/API/get_lesson.php", "name=" + encodeURIComponent(lesson), function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showUserAccount(response)
{
	document.getElementById("userName").innerHTML = response.user_name;
	document.getElementById("logLink").innerHTML = "<a href=\"/auth/logout.php\">Odhlásit</a>";
	if(response.hasOwnProperty("user_avatar"))
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + response.user_avatar;
	}
	else
	{
		document.getElementById("userAvatar").src = "/images/avatar.png";
	}
}

function showLoginForm(response)
{
	document.getElementById("userName").innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink").innerHTML = "<a href=\"/auth/login.php\">Přihlásit</a>";
	document.getElementById("userAvatar").src = "/images/avatar.png";
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

function switchNav()
{
	navOpen = !navOpen;
	reflow();
}

function fontResize(delta)
{
	var content = document.getElementById("content");
	var current = parseInt(window.getComputedStyle(content, null).getPropertyValue("font-size").replace("px", ""), 10);
	content.style.fontSize = current + delta + "px";
	content.style.lineHeight = "160%";
}

function cacheThenNetworkRequest(url, query, callback)
{
	var networkDataReceived = false;
	request(url, query, {}).then(function(response)
		{
			networkDataReceived = true;
			callback(response);
		});
	request(url, query, {"Accept": "x-cache/only"}).then(function(response)
		{
			if(!networkDataReceived)
			{
				callback(response);
			}
		}, function(reject){});
}

function request(url, query, headers)
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
		if(query !== undefined && query !== "")
		{
			url += "?" + query;
		}
		xhttp.open("GET", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		for(var key in headers)
		{
			xhttp.setRequestHeader(key, headers[key]);
		}
		xhttp.send();
	});
}

function cacheOffline()
{
	var checked = document.getElementById("cacheOffline").checked;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var lessonName = window.location.pathname.substring(8);
		caches.open(CACHE).then(function(cache)
			{
				if(checked)
				{
					cache.add("/API/get_lesson.php?name=" + lessonName);
				}
				else
				{
					cache.delete("/API/get_lesson.php?name=" + lessonName);
				}
		});
	}
}

function run()
{
	getLoginState(showUserAccount, showLoginForm);
	listLessons(showLessonList);
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var lessonName = decodeURIComponent(window.location.pathname.substring(8));
		getLesson(lessonName);
	}
	if("serviceWorker" in navigator)
	{
		navigator.serviceWorker.register("/serviceworker.js");
	}
	reflow();
}

function popback()
{
	if (window.location.pathname.substring(0, 8) === "/lesson/")
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
			document.getElementById("overlay").style.display = "none";
		}
		else
		{
			document.getElementById("main").style.marginLeft = "0px"
			document.getElementById("overlay").style.display = "inline";
		}
	}
	else
	{
		document.getElementById("navBar").style.marginLeft = "-300px"
		document.getElementById("main").style.marginLeft = "0px"
		document.getElementById("overlay").style.display = "none";
	}
}

window.onload = run;
window.onpopstate = popback;
window.onresize = reflow;

