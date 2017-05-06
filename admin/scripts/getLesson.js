var changed;

function getLesson(lesson, noHistory)
{
	if(lesson === undefined || lesson === "")
	{
		getMainPage(noHistory);
		return;
	}
	request("/API/get_lesson", "name=" + encodeURIComponent(lesson), function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showLesson(name, markdown, noHistory)
{
	changed = false;
	var html = "<header><div id=\"discard\"><i class=\"icon-left-big\"></i>Zrušit</div><div id=\"save\">Uložit<i class=\"icon-floppy\"></i></div></header>"
	html += "<div id=\"editor\">" + markdown + "</div><div id=\"preview\"><div id=\"preview-inner\"></div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, markdown);

	var stateObject = { lessonName: name };
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
	console.log("SAVE");
}
