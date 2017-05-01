function topUIsetup()
{
	document.getElementById("lessonsButton").onclick = switchNav;
	document.getElementById("fontIncrease").onclick = function()
		{
			fontResize(2);
		}
	document.getElementById("fontDecrease").onclick = function()
		{
			fontResize(-2);
		}
	document.getElementById("cacheOffline").onclick = cacheOffline;
}

function fontResize(delta)
{
	var content = document.getElementById("content");
	var current = parseInt(window.getComputedStyle(content, null).getPropertyValue("font-size").replace("px", ""), 10);
	content.style.fontSize = current + delta + "px";
	content.style.lineHeight = "160%";
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

