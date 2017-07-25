var changed;
var competences = false;

function getLesson(id, noHistory)
{
	if(!id)
	{
		getMainPage(noHistory);
		return;
	}
	request("/API/v0.9/get_lesson", "id=" + id, function(response)
		{
			lessonListEvent.addCallback(function()
				{
					showLesson(id, response, noHistory);
				});
		});
}

function showLesson(id, markdown, noHistory)
{
	changed = false;
	var lesson = {};
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				lesson = FIELDS[i].lessons[j];
				break outer;
			}
		}
	}
	var html = '\
<header>\
	<div class="button" id="discard">\
		<i class="icon-left-big"></i>\
		Zrušit\
	</div>\
	<form>\
		<input type="text" id="name" value="' + lesson.name + '" autocomplete=off>\
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

	document.getElementsByTagName("main")[0].innerHTML = html;
	renderCompetences(lesson.competences);
	refreshPreview(lesson.name, markdown);

	var stateObject = { "id": id };
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

function competenceChange()
{
	changed = true;
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
		var query = "id=" + document.getElementById("save").dataset.id;
		query += "&name=" + document.getElementById("name").value;
		var competences = parseCompetences();
		var competenceQuery = "";
		for(i = 0; i < competences.length; i++)
		{
			competenceQuery += "&competence[]=" + competences[i];
		}
		if(competenceQuery === "")
		{
			competenceQuery = "&competence[]=";
		}
		query += competenceQuery;
		query += "&body=" + encodeURIComponent(ace.edit("editor").getValue());
		retryAction("/API/v0.9/update_lesson", query);
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
		document.getElementById("competences").style.top = "-100%";
	}
	else
	{
		document.getElementById("competences").style.top = "-91px";
	}
	competences = !competences;
}

function renderCompetences(currentCompetences)
{
	var html = "<form>";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<div class=\"competence\"><label class=\"competenceSwitch\"><input type=\"checkbox\" data-id=\"" + COMPETENCES[i].id + "\"";
		if(currentCompetences.indexOf(COMPETENCES[i].id) >= 0)
		{
			html += " checked";
		}
		html += "><span class=\"checkbox\"></span></label><span class=\"competenceNumber\">" + COMPETENCES[i].number + ":</span> " + COMPETENCES[i].name + "</div>";
	}
	html += "</form>"
	document.getElementById("competenceWrapper").innerHTML = html;

	nodes = document.getElementById("competenceWrapper").getElementsByTagName("input");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onchange = competenceChange;
	}
}

function parseCompetences()
{
	var ret = [];
	nodes = document.getElementById("competenceWrapper").getElementsByTagName("input");
	for(var l = 0; l < nodes.length; l++)
	{
		if(nodes[l].checked)
		{
			ret.push(nodes[l].dataset.id);
		}
	}
	return ret;
}
