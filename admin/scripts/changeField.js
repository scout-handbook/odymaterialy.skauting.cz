var fieldChanged = false;

function changeFieldOnClick(event)
{
	sidePanelOpen();
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id == event.target.dataset.id)
		{
			html += "<h3 class=\"sidePanelTitle\">" + FIELDS[i].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeFieldSave\" data-id=\"" + FIELDS[i].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
			html += "<input type=\"text\" id=\"fieldName\" value=\"" + FIELDS[i].name + "\" autocomplete=\"off\">";
			html += "</form>";
			break;
		}
	}
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeFieldSave").onclick = changeFieldSave;

	document.getElementById("fieldName").oninput = function()
		{
			fieldChanged = true;
		};
	document.getElementById("fieldName").onchange = function()
		{
			fieldChanged = true;
		};

	var stateObject = { "sidePanel": "open" };
	history.pushState(stateObject, "title", "/admin/");
}

function changeFieldSave()
{
	if(fieldChanged)
	{
		var query = "id=" + document.getElementById("changeFieldSave").dataset.id;
		query += "&name=" + document.getElementById("fieldName").value;
		fieldChanged = false;
		sidePanelClose();
		retryAction("/API/v0.9/update_field", query);
	}
}
