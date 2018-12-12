"use strict";
/* exported changeLessonFieldOnClick */

var lessonFieldChanged = false;

function changeLessonFieldOnClick(id, actionQueue)
{
	lessonFieldChanged = false;
	var html = "<div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeLessonFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit oblast</h3><form id=\"sidePanelForm\">";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var checked = false;
		if((FIELDS[i].id && FIELDS[i].id === lessonSettingsCache.field) || (!FIELDS[i].id && lessonSettingsCache.field === ""))
		{
			checked = true;
		}
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\"";
		if(checked)
		{
			html += " checked";
		}
		if(FIELDS[i].id)
		{
			html += " data-id=\"" + FIELDS[i].id + "\"";
		}
		else
		{
			html += " data-id=\"\"";
		}
		html += "><span class=\"formCustom formRadio\"></span></label>";
		if(FIELDS[i].id)
		{
			html += FIELDS[i].name;
		}
		else
		{
			html += "<span class=\"anonymousField\">Nezařazeno</span>"
		}
		html += "</div>";
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};
	document.getElementById("changeLessonFieldSave").onclick = function() {changeLessonFieldSave(id, actionQueue);};

	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = lessonFieldOnclick;
	}

	refreshLogin();
}

function lessonFieldOnclick()
{
	lessonFieldChanged = true;
}

function changeLessonFieldSave(id, actionQueue)
{
	if(lessonFieldChanged)
	{
		id = typeof id !== 'undefined' ? id : "{id}";
		var fieldId = parseBoolForm()[0];
		actionQueue.actions.push(new Action(CONFIG.apiuri + "/lesson/" + id + "/field", "PUT", function() {return {"field": encodeURIComponent(fieldId)};}));
		lessonSettingsCache.field = fieldId;
		lessonSettings(id, actionQueue, true);
	}
	else
	{
		lessonSettings(id, actionQueue, true);
	}
}
