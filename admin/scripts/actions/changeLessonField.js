var lessonFieldChanged = false;

function changeLessonFieldOnClick(id, actionQueue)
{
	lessonFieldChanged = false;
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	var form = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				html += "<div class=\"newButton greenButton\" id=\"changeLessonFieldSave\" data-id=\"" + FIELDS[i].lessons[j].id + "\"><i class=\"icon-floppy\"></i>Uložit</div>";
				html += "<h3 class=\"sidePanelTitle\">Změnit oblast</h3><form id=\"sidePanelForm\">"
				break;
			}
		}
		var checked = false;
		if((FIELDS[i].id && FIELDS[i].id == lessonSettingsCache.field) || (!FIELDS[i].id && lessonSettingsCache.field == ""))
		{
			checked = true;
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

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};
	document.getElementById("changeLessonFieldSave").onclick = function() {changeLessonFieldSave(id, actionQueue);};

	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = function()
			{
				lessonFieldChanged = true;
			};
	}

	refreshLogin();
}

function changeLessonFieldSave(id, actionQueue)
{
	if(lessonFieldChanged)
	{
		var fieldId = parseBoolForm()[0];
		id = typeof id !== 'undefined' ? id : "{id}";
		actionQueue.actions.push(new Action("/API/v0.9/lesson/" + id + "/field", "PUT", function() {return {"field": encodeURIComponent(fieldId)};}));
		lessonSettingsCache.field = fieldId;
		lessonSettings(id, actionQueue, true);
	}
	else
	{
		history.back();
	}
}
