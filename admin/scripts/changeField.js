function changeFieldOnClick(event)
{
	sidePanelOpen();
	var html = "";
	var form = "";
	var name = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var checked = false;
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == event.target.dataset.id)
			{
				html += "<h3 class=\"sidePanelTitle\">" + FIELDS[i].lessons[j].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeFieldSave\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">"
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
		form += "><span class=\"formRadio\"></span></label>";
		if(FIELDS[i].id)
		{
			form += FIELDS[i].name;
		}
		else
		{
			form += "<i>Nezařazeno</i>"
		}
		form += "</div>";
	}
	html += form + "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = sidePanelClose;
	document.getElementById("changeFieldSave").onclick = changeFieldSave;

	history.pushState({}, "title", "/admin/");
}

function changeFieldSave(event)
{
	var lessonId = document.getElementById("changeFieldSave").dataset.id;
	var fieldId = parseForm()[0];
	var query = "lesson-id=" + lessonId;
	if(fieldId)
	{
		query += "&field-id=" + fieldId;
	}
	retryAction("/API/v0.9/update_lesson_field", query);
}
