function addField()
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"newButton greenButton\" id=\"addFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat oblast</h3><form id=\"sidePanelForm\">";
	html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"Nová oblast\" autocomplete=\"off\">";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addFieldSave").onclick = addFieldSave;

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}

function addFieldSave()
{
	var payload = {"name": encodeURIComponent(document.getElementById("fieldName").value)};
	sidePanelClose();
	spinner();
	retryAction("/API/v0.9/field", "POST", payload);
}
