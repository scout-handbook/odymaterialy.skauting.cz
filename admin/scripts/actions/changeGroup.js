var groupChanged = false;

function changeGroupOnClick(event)
{
	groupChanged = false;
	sidePanelOpen();
	var html = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == event.target.dataset.id)
		{
			html += "<h3 class=\"sidePanelTitle\">Skupina " + GROUPS[i].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeGroupSave\" data-id=\"" + GROUPS[i].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
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
	document.getElementById("changeGroupSave").onclick = changeGroupSave;

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

function changeGroupSave()
{
	if(groupChanged)
	{
		var payload = {"name": encodeURIComponent(document.getElementById("groupName").value)};
		sidePanelClose();
		spinner();
		retryAction("/API/v0.9/group/" + encodeURIComponent(document.getElementById("changeGroupSave").dataset.id), "PUT", payload);
	}
	else
	{
		history.back();
	}
}
