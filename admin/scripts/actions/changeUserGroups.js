var groupsChanged = false;

function changeUserGroupsOnClick(event)
{
	groupsChanged = false;
	sidePanelOpen();
	var html = "";
	html += "<h3 class=\"sidePanelTitle\">" + event.target.dataset.name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeUserGroupsSave\" data-id=\"" + event.target.dataset.id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	var currentGroups = JSON.parse(event.target.dataset.groups);
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == "00000000-0000-0000-0000-000000000000")
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
	document.getElementById("changeUserGroupsSave").onclick = changeUserGroupsSave;
	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = function()
			{
				groupsChanged = true;
			};
	}

	history.pushState({"sidePanel": "open"}, "title", "/admin/users");
	refreshLogin();
}

function changeUserGroupsSave()
{
	if(groupsChanged)
	{
		var groups = parseBoolForm();
		var encodedGroups = [];
		for(i = 0; i < groups.length; i++)
		{
			encodedGroups.push(encodeURIComponent(groups[i]));
		}
		var payload = {"group": encodedGroups};
		sidePanelClose();
		spinner();
		retryAction("/API/v0.9/user/" + encodeURIComponent(document.getElementById("changeUserGroupsSave").dataset.id) + "/group", "PUT", payload);
	}
	else
	{
		history.back();
	}
}
