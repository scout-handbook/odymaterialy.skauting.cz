var groupChanged = false;

function changeGroupOnClick(event)
{
	groupChanged = false;
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"newButton greenButton\" id=\"changeGroupSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit skupinu</h3><form id=\"sidePanelForm\">";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == getAttribute(event, "id"))
		{
			html += "<input type=\"text\" class=\"formText\" id=\"groupName\" value=\"" + GROUPS[i].name + "\" autocomplete=\"off\"><br>";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeGroupSave").onclick = function() {changeGroupSave(getAttribute(event, "id"));};

	document.getElementById("groupName").oninput = function()
		{
			groupChanged = true;
		};
	document.getElementById("groupName").onchange = function()
		{
			groupChanged = true;
		};

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}

function changeGroupSave(id)
{
	if(groupChanged)
	{
		var payload = {"name": encodeURIComponent(document.getElementById("groupName").value)};
		sidePanelClose();
		spinner();
		retryAction("/API/v0.9/group/" + encodeURIComponent(id), "PUT", payload);
	}
	else
	{
		history.back();
	}
}
