var changed;

function getLesson(id, name, noHistory)
{
	if(!id)
	{
		getMainPage(noHistory);
		return;
	}
	request("/API/get_lesson", "id=" + id, function(response)
		{
			showLesson(id, name, response, noHistory);
		});
}

function showLesson(id, name, markdown, noHistory)
{
	changed = false;
	var html = "<header><div id=\"discard\"><i class=\"icon-left-big\"></i>Zrušit</div><div id=\"save\" data-id=\"" + id + "\">Uložit<i class=\"icon-floppy\"></i></div></header>"
	html += "<div id=\"editor\">" + markdown + "</div><div id=\"preview\"><div id=\"preview-inner\"></div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, markdown);

	var stateObject = { "id": id, "name": name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = save;

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", function()
		{
			changed = true;
			refreshPreview(name, editor.getValue());
		});
}

function discard()
{
	if(!changed || confirm("Opravdu si přejete zahodit všechny změny?"))
	{
		history.back();
	}
}

function save()
{
	if(changed)
	{
		var id = document.getElementById("save").dataset.id;
		var query = "id=" + id + "&body=" + encodeURIComponent(ace.edit("editor").getValue());
		POSTrequest("/API/change_lesson", query, afterSave);
	}
	else
	{
		discard();
	}
}

function afterSave(data)
{
	console.log(data);
	history.back();
}
