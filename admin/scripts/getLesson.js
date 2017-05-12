var changed;
var competences = false;

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
	var html = '\
<header>\
	<div class="button" id="discard">\
		<i class="icon-left-big"></i>\
		Zrušit\
	</div>\
	<form>\
		<input type="text" id="name" value="' + name + '" autocomplete=off>\
	</form>\
	<div class="button" id="save" data-id="' + id + '">\
		Uložit\
		<i class="icon-floppy"></i>\
	</div>\
	<div class="button" id="competenceButton">\
		Kompetence\
	</div>\
</header>\
<div id="competences">\
	<div id="competenceWrapper"></div>\
</div>'
	html += '<div id="editor">' + markdown + '</div><div id="preview"><div id="preview-inner"></div></div>';

	request("/API/list_competences", "", function(response)
		{
			renderCompetences(JSON.parse(response));
		});

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, markdown);

	var stateObject = { "id": id, "name": name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = saveCallback;
	document.getElementById("competenceButton").onclick = showCompetences;

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/odymaterialy");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", change);
	document.getElementById("name").oninput = change;
	document.getElementById("name").onchange = change;
}

function change()
{
	changed = true;
	refreshPreview(document.getElementById("name").value, ace.edit("editor").getValue());
}

function discard()
{
	if(!changed)
	{
		history.back();
	}
	else
	{
		dialog("Opravdu si přejete zahodit všechny změny?", "Ano", function()
			{
				history.back();
			}, "&nbsp;&nbsp;Ne&nbsp;&nbsp;");
	}
}

function saveCallback()
{
	if(changed)
	{
		var id = document.getElementById("save").dataset.id;
		var name = document.getElementById("name").value;
		var body = ace.edit("editor").getValue();
		save(id, name, body);
	}
	else
	{
		discard();
	}
}

function showCompetences()
{
	if(competences)
	{
		document.getElementById("competences").style.marginTop = "-100%";
	}
	else
	{
		document.getElementById("competences").style.marginTop = "-91px";
	}
	competences = !competences;
}

function renderCompetences(competenceList)
{
	var html = "<form>";
	for(var i = 0; i < competenceList.length; i++)
	{
		html += "<input type=\"checkbox\"><b>" + competenceList[i].number + "</b>: " + competenceList[i].name + "<br>";
	}
	html += "</form>"
	document.getElementById("competenceWrapper").innerHTML = html;
}
