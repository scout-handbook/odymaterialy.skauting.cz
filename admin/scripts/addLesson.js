function addLesson(noHistory)
{
	var html = '\
<header>\
	<div class="button" id="discard">\
		<i class="icon-left-big"></i>\
		Zrušit\
	</div>\
	<form>\
		<input type="text" id="name" value="' + defaultName + '" autocomplete=off>\
	</form>\
	<div class="button" id="save">\
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
	html += '<div id="editor">' + defaultBody + '</div><div id="preview"><div id="preview-inner"></div></div>';
	document.getElementsByTagName("main")[0].innerHTML = html;
	renderCompetences([]);
	refreshPreview(defaultName, defaultBody);

	var stateObject = {};
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = addCallback;
	document.getElementById("competenceButton").onclick = showCompetences;

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/odymaterialy");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", change);
	document.getElementById("name").oninput = change;
	document.getElementById("name").onchange = change;
}

function addCallback()
{
	var query = "name=" + document.getElementById("name").value;
	var competences = parseCompetences();
	var competenceQuery = ""
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
	retryAction("/API/v0.9/add_lesson", query);
}
