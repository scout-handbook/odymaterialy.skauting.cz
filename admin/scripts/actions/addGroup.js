function addGroup()
{
	sidePanelOpen();
	var html = "<h3 class=\"sidePanelTitle\">Nová skupina</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"addGroupSave\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	html += "<input type=\"text\" class=\"formText\" id=\"groupName\" value=\"Nová skupina\" autocomplete=\"off\"><br>";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addGroupSave").onclick = addGroupSave;

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}

function addGroupSave()
{
	var payload = {"name": encodeURIComponent(document.getElementById("groupName").value)};
	sidePanelClose();
	spinner();
	retryAction("/API/v0.9/group", "POST", payload);
}
