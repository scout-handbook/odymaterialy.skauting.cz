function TOCSetup()
{
	metadataEvent.addCallback(renderTOC);
}

function renderTOC()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].name)
		{
			html += "<h1><a title=\"" + FIELDS[i].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].id + "\">" + FIELDS[i].name + "</a></h1>";
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<a class=\"secondLevel\" title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a><br>";
			}
		}
		else
		{
			for(var k = 0; k < FIELDS[i].lessons.length; k++)
			{
				html += "<a title=\"" + FIELDS[i].lessons[k].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[k].id + "\">" + FIELDS[i].lessons[k].name + "</a><br>";
			}
		}
	}
	document.getElementById("navigation").innerHTML = html;
	var nodes = document.getElementById("navigation").getElementsByTagName("a");
	for(var l = 0; l < nodes.length; l++)
	{
		if(nodes[l].parentElement.tagName === "H1")
		{
			nodes[l].onclick = TOCFieldOnClick;
		}
		else
		{
			nodes[l].onclick = TOCLessonOnClick;
		}
	}
	document.getElementsByTagName("nav")[0].style.transition = "margin-left 0.3s ease";
}

function TOCFieldOnClick(event)
{
	showFieldView(event.target.dataset.id);
	return false;
}

function TOCLessonOnClick(event)
{
	showLessonView(event.target.dataset.id);
	return false;
}
