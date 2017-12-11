var fieldChanged = false;

function changeFieldOnClick(event)
{
	fieldChanged = false;
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"newButton greenButton\" id=\"changeFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit oblast</h3>";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id == getAttribute(event, "id"))
		{
			html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"" + FIELDS[i].name + "\" autocomplete=\"off\">";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeFieldSave").onclick = function() {changeFieldSave(getAttribute(event, "id"));};

	document.getElementById("fieldName").oninput = function()
		{
			fieldChanged = true;
		};
	document.getElementById("fieldName").onchange = function()
		{
			fieldChanged = true;
		};

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}

function changeFieldSave(id)
{
	if(fieldChanged)
	{
		var payload = {"name": encodeURIComponent(document.getElementById("fieldName").value)};
		sidePanelClose();
		spinner();
		retryAction("/API/v0.9/field/" + encodeURIComponent(id), "PUT", payload);
	}
	else
	{
		history.back();
	}
}
