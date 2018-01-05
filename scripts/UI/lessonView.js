function toggleLessonOffline()
{
	var checked = document.getElementById("cacheOffline").checked;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var id = window.location.pathname.substring(8).split("/")[0];
		caches.open(CACHE).then(function(cache)
			{
				if(checked)
				{
					cache.add(new Request("/API/v0.9/lesson/" + id, {credentials: "same-origin"}));
				}
				else
				{
					cache.delete("/API/v0.9/lesson/" + id);
				}
		});
	}
}

function toggleCompetenceBubble(event)
{
	element = event.target;
	while(!element.classList.contains("competenceBubble") && (element = element.parentElement)) { /* Empty */ }
	if(element.style.width !== "")
	{
		activeCompetence = null;
		element.childNodes[1].style.width = "";
		element.style.width = "";
		element.style.height = "";
		element.firstChild.style.color = "";
		element.style.borderColor = "";
		element.style.backgroundColor = "";
	}
	else
	{
		nodes = document.getElementById("content").getElementsByClassName("competenceBubble");
		for(var i = 0; i < nodes.length; i++)
		{
			nodes[i].childNodes[1].style.width = "";
			nodes[i].style.width = "";
			nodes[i].style.height = "";
			nodes[i].firstChild.style.color = "";
			nodes[i].style.borderColor = "";
			nodes[i].style.backgroundColor = "";
		}
		activeCompetence = element;
		reflowCompetenceBubbles();
		element.firstChild.style.color = "#6534ad";
		element.style.borderColor = "#6534ad";
		element.style.backgroundColor = "#f5f5f5";
	}
}

function reflowCompetenceBubbles()
{
	if(activeCompetence)
	{
		var fontSize = parseFloat(window.getComputedStyle(activeCompetence).getPropertyValue("font-size"));
		activeCompetence.childNodes[1].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.childNodes[2].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.style.width = Math.min(400, activeCompetence.parentElement.clientWidth) + "px";
		activeCompetence.style.height = (activeCompetence.childNodes[1].offsetHeight + 1.4 * fontSize - 6) + "px";
	}
}

function competenceBubbleDetailOnClick(event)
{
	showCompetenceView(event.target.dataset.id)
	return false;
}
