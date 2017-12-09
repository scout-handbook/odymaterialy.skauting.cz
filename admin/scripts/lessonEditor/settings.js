function lessonSettings(id, actionQueue, noHistory)
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-right-open\"></i>Zavřít</div>";
	html += renderField(id);
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeField").onclick = function() {changeLessonFieldOnClick(id, actionQueue);};
	if(!noHistory)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	}
	refreshLogin();
}

function renderField(id)
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Oblast</h3>"
	html += "<div class=\"newButton cyanButton\" id=\"changeField\" data-id=\"" + id + "\"><i class=\"icon-pencil\"></i>Upravit</div><br>";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				if(FIELDS[i].id)
				{
					html += FIELDS[i].name;
				}
				else
				{
					html += "<span class=\"anonymousField\">Nezařazeno</span>"
				}
				break outer;
			}
		}
	}
	return html;
}
