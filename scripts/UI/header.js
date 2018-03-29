"use strict";

function headerSetup()
{
	document.getElementById("lessonsButton").onclick = toggleNavigation;
	document.getElementById("fontIncrease").onclick = function()
		{
			fontResize(2);
		}
	document.getElementById("fontDecrease").onclick = function()
		{
			fontResize(-2);
		}
	document.getElementById("cacheOffline").onclick = toggleLessonOffline;
}

function fontResize(delta)
{
	var content = document.getElementById("content");
	var current = parseInt(window.getComputedStyle(content, null).getPropertyValue("font-size").replace("px", ""), 10);
	content.style.fontSize = current + delta + "px";
	content.style.lineHeight = "160%";
	reflowCompetenceBubbles();
}
