var lessonFieldChanged = false;

function changeLessonFieldOnClick(event)
{
	lessonFieldChanged = false;
	sidePanelOpen();
	var html = "";
	var form = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var checked = false;
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == event.target.dataset.id)
			{
				html += "<h3 class=\"sidePanelTitle\">" + FIELDS[i].lessons[j].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeLessonFieldSave\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">"
				checked = true;
				break;
			}
		}
		form += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\"";
		if(checked)
		{
			form += " checked";
		}
		if(FIELDS[i].id)
		{
			form += " data-id=\"" + FIELDS[i].id + "\"";
		}
		else
		{
			form += " data-id=\"\"";
		}
		form += "><span class=\"formCustom formRadio\"></span></label>";
		if(FIELDS[i].id)
		{
			form += FIELDS[i].name;
		}
		else
		{
			form += "<span class=\"anonymousField\">Nezařazeno</span>"
		}
		form += "</div>";
	}
	html += form + "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeLessonFieldSave").onclick = changeLessonFieldSave;

	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = function()
			{
				lessonFieldChanged = true;
			};
	}

	history.pushState({"sidePanel": "open"}, "title", "/admin/");
}

function changeLessonFieldSave()
{
	if(lessonFieldChanged)
	{
		var fieldId = parseForm()[0];
		sidePanelClose();
		retryAction("/API/v0.9/lesson/" + encodeURIComponent(document.getElementById("changeLessonFieldSave").dataset.id) + "/field/" + encodeURIComponent(fieldId), "PUT", {});
	}
	else
	{
		history.back();
	}
}
