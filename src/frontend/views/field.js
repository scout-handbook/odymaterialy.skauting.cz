"use strict";
/* exported showFieldView */

function showFieldView(id, noHistory)
{
	if(screen.width < 700)
	{
		window.navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
		{
			renderFieldView(id, noHistory);
		});
	refreshLogin();
}

function renderFieldView(id, noHistory)
{
	var field = {};
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === id)
		{
			field = FIELDS[i];
			break;
		}
	}
	var html = "<h1>" + field.name + "</h1>";
	html += renderFieldLessonList(field);
	document.getElementById("content").innerHTML = html;

	var nodes = document.getElementById("content").getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = TOCLessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/field/" + id + "/" + urlEscape(field.name));
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function renderFieldLessonList(field)
{
	var html = "";
	for(var i = 0; i < field.lessons.length; i++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + field.lessons[i].name + "\" href=\"/error/enableJS.html\" data-id=\"" + field.lessons[i].id + "\">" + field.lessons[i].name + "</a></h3>";
		if(field.lessons[i].competences.length > 0)
		{
			var competences = [];
			for(var k = 0; k < COMPETENCES.length; k++)
			{
				if(field.lessons[i].competences.indexOf(COMPETENCES[k].id) >= 0)
				{
					competences.push(COMPETENCES[k]);
				}
			}
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(var m = 1; m < competences.length; m++)
			{
				html += ", " + competences[m].number;
			}
			html += "</span>";
		}
	}
	return html;
}
