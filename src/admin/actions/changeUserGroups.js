"use strict";
/* exported changeUserGroupsOnClick */

var groupsChanged = false;

function changeUserGroupsOnClick(event)
{
	groupsChanged = false;
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeUserGroupsSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit skupiny: " + getAttribute(event, "name") + "</h3><form id=\"sidePanelForm\">";
	var currentGroups = JSON.parse(getAttribute(event, "groups"));
	var publicName = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === "00000000-0000-0000-0000-000000000000")
		{
			publicName = GROUPS[i].name;
		}
		else
		{
			html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\"";
			if(currentGroups.indexOf(GROUPS[i].id) >= 0)
			{
				html += " checked";
			}
			html += " data-id=\"" + GROUPS[i].id + "\"";
			html += "><span class=\"formCustom formCheckbox\"></span></label>";
			html += GROUPS[i].name + "</div>";
		}
	}
	html += "</form>";
	html += "<div class=\"groupHelp\"><i class=\"icon-info-circled\"></i> Každého uživatele lze zařadit do několika skupin (nebo i žádné). Podle toho poté tento uživatel bude moct zobrazit pouze lekce, které byly těmto skupiným zveřejněny. Lekce ve skupině \"<span class=\"publicGroup\">" + publicName + "</span>\" uvidí všichni uživatelé bez ohledu na jejich skupiny. </div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/user/" + encodeURIComponent(getAttribute(event, "id")) + "/group", "PUT", changeUserPayloadBuilder)]);
	document.getElementById("changeUserGroupsSave").onclick = aq.closeDispatch;

	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = userGroupsOnclick;
	}

	history.pushState({"sidePanel": "open"}, "title", "/admin/users");
	refreshLogin();
}

function userGroupsOnclick()
{
	groupsChanged = true;
}

function changeUserPayloadBuilder()
{
	var groups = parseBoolForm();
	var encodedGroups = [];
	for(var i = 0; i < groups.length; i++)
	{
		encodedGroups.push(encodeURIComponent(groups[i]));
	}
	return {"group": encodedGroups};
}
