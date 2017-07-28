function addField()
{
	sidePanelOpen();
	var html = "<h3 class=\"sidePanelTitle\">Nová oblast</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"addFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	html += "<input type=\"text\" class=\"formText\" id=\"fieldName\" value=\"Nová oblast\" autocomplete=\"off\">";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addFieldSave").onclick = addFieldSave;

	var stateObject = { "sidePanel": "open" };
	history.pushState(stateObject, "title", "/admin/");
}

function addFieldSave()
{
	var query = "name=" + document.getElementById("fieldName").value;
	sidePanelClose();
	retryAction("/API/v0.9/add_field", query);
}
