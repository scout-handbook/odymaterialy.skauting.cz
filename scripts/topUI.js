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
		var id = window.location.pathname.substring(8).split("/")[0];
		caches.open(CACHE).then(function(cache)
			{
				if(checked)
				{
					cache.add("/API/v0.9/get_lesson?id=" + id);
				}
				else
				{
					cache.delete("/API/v0.9/get_lesson?id=" + id);
				}
		});
	}
}
