"use strict";
/* exported changeLessonGroupsOnClick */

var lessonGroupsChanged = false;

function changeLessonGroupsOnClick(id, actionQueue)
{
	lessonGroupsChanged = false;
	var html = "<div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeLessonGroupsSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit skupiny</h3><form id=\"sidePanelForm\">";
	var publicName = ''
	for(var i = 0; i < GROUPS.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\"";
		if(lessonSettingsCache.groups.indexOf(GROUPS[i].id) >= 0)
		{
			html += " checked";
		}
		html += " data-id=\"" + GROUPS[i].id + "\"";
		html += "><span class=\"formCustom formCheckbox\"></span></label>";
		if(GROUPS[i].id === "00000000-0000-0000-0000-000000000000")
		{
			html += "<span class=\"publicGroup\">" + GROUPS[i].name + "</span></div>";
			publicName = GROUPS[i].name;
		}
		else
		{
			html += GROUPS[i].name + "</div>";
		}
	}
	html += "</form>";
	html += "<div class=\"groupHelp\"><i class=\"icon-info-circled\"></i> U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele vůbec přístupná (pouze v administraci). Pokud je vybrána skupina \"<span class=\"publicGroup\">" + publicName + "</span>\", bude lekce přístupná všem uživatelům (i nepřihlášeným návštěvníkům webu) bez ohledu na skupiny.</div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};
	document.getElementById("changeLessonGroupsSave").onclick = function() {changeLessonGroupsSave(id, actionQueue);};

	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = lessonGroupsOnclick;
	}

	refreshLogin();
}

function lessonGroupsOnclick()
{
	lessonGroupsChanged = true;
}

function changeLessonGroupsSave(id, actionQueue)
{
	if(lessonGroupsChanged)
	{
		id = typeof id !== 'undefined' ? id : "{id}";
		var groups = parseBoolForm();
		var encodedGroups = [];
		for(var i = 0; i < groups.length; i++)
		{
			encodedGroups.push(encodeURIComponent(groups[i]));
		}
		actionQueue.actions.push(new Action(CONFIG.apiuri + "/lesson/" + id + "/group", "PUT", function () {return {"group": encodedGroups};}));
		lessonSettingsCache.groups = groups;
		lessonSettings(id, actionQueue, true);
	}
	else
	{
		lessonSettings(id, actionQueue, true);
	}
}
