var changed;
var competences = false;

function changeLessonOnClick(event)
{
	getLesson(event.target.dataset.id);
	return false;
}

function getLesson(id, noHistory)
{
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
		<input type="text" id="name" value="' + lesson.name + '" autocomplete="off">\
	</form>\
	<div class="button" id="save" data-id="' + id + '">\
		Uložit\
		<i class="icon-floppy"></i>\
	</div>\
</header>'
	html += '<div id="editor">' + markdown + '</div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(lesson.name, markdown);

	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = save;

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

function save()
{
	if(changed)
	{
		var query = "id=" + document.getElementById("save").dataset.id;
		query += "&name=" + document.getElementById("name").value;
		query += "&body=" + encodeURIComponent(ace.edit("editor").getValue());
		retryAction("/API/v0.9/update_lesson", query);
	}
	else
	{
		discard();
	}
}
