var readd = false;

function addSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("action") === "add")
	{
		readd = true;
		addSave(sessionStorage.getItem("name"), JSON.parse(sessionStorage.getItem("competences")), sessionStorage.getItem("body"));
		sessionStorage.clear();
	}
}

function addLesson(noHistory)
{
	changed = true;
	var html = '\
<header>\
	<div class="button" id="discard">\
		<i class="icon-left-big"></i>\
		Zrušit\
	</div>\
	<form>\
		<input type="text" id="name" value="Prázdná lekce" autocomplete=off>\
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
	html += '<div id="editor">## Nadpis</div><div id="preview"><div id="preview-inner"></div></div>';
	document.getElementsByTagName("main")[0].innerHTML = html;
	renderCompetences([]);
	refreshPreview("Prázdná lekce", "## Nadpis");

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
	if(changed)
	{
		var name = document.getElementById("name").value;
		var competences = parseCompetences();
		var body = ace.edit("editor").getValue();
		addSave(name, competences, body);
	}
	else
	{
		discard();
	}
}

function addSave(name, competences, body)
{
	var competenceQuery = "";
	for(i = 0; i < competences.length; i++)
	{
		competenceQuery += "&competence[]=" + competences[i];
	}
	if(competenceQuery === "")
	{
		competenceQuery = "&competence[]=";
	}
	var query = "name=" + name + competenceQuery + "&body=" + encodeURIComponent(body);
	POSTrequest("/API/v0.9/add_lesson", query, afterAdd);
}

function afterAdd(response)
{
	var success = JSON.parse(response).success;
	if(success)
	{
		dialog("Úspěšně uloženo.", "OK", function()
			{
				if(readd)
				{
					window.location.reload();
				}
			});
		lessonListEvent = new AfterLoadEvent(2);
		lessonListSetup();
		history.back();
	}
	else
	{
		if(!readd && window.sessionStorage)
		{
			sessionStorage.setItem("action", "add");
			sessionStorage.setItem("name", document.getElementById("name").value);
			sessionStorage.setItem("competences", JSON.stringify(parseCompetences()));
			sessionStorage.setItem("body", ace.edit("editor").getValue());
			window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
		}
		else
		{
			dialog("Byl jste odhlášen a uložení se tedy nezdařilo. Přihlaste se prosím a zkuste to znovu.", "OK");
		}
	}
}
