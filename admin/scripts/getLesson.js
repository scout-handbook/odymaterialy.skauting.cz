var changed;
var imageSelectorOpen = false;

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
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + lesson.name + '" autocomplete="off">\
	</form>\
	<div class="button" id="save" data-id="' + id + '">\
		Uložit<i class="icon-floppy"></i>\
	</div>\
	<div class="button" id="addImageButton">\
		Vložit obrázek\
	</div>\
</header>\
<div id="imageSelector">\
	<div id="imageWrapper"></div>\
</div>'
	html += '<div id="editor">' + markdown + '</div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(lesson.name, markdown);

	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = save;
	document.getElementById("addImageButton").onclick = showImageSelector;

	var editor = ace.edit("editor");
	editor.setOption("scrollPastEnd", 0.9);
	editor.setTheme("ace/theme/odymaterialy");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", change);
	document.getElementById("name").oninput = change;
	document.getElementById("name").onchange = change;

	getImageSelector();
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
		var query = "id=" + encodeURIComponent(document.getElementById("save").dataset.id);
		query += "&name=" + encodeURIComponent(document.getElementById("name").value);
		query += "&body=" + encodeURIComponent(ace.edit("editor").getValue());
		retryAction("/API/v0.9/update_lesson", query);
	}
	else
	{
		discard();
	}
}

function showImageSelector()
{
	if(imageSelectorOpen)
	{
		document.getElementById("imageSelector").style.top = "-100%";
	}
	else
	{
		document.getElementById("imageSelector").style.top = "-91px";
	}
	imageSelectorOpen = !imageSelectorOpen;
}

function getImageSelector()
{
	request("/API/v0.9/list_images", "", function(response)
		{
			renderImageSelector(JSON.parse(response));
		});
}

function renderImageSelector(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<img src=\"/API/v0.9/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\">";
	}
	document.getElementById("imageWrapper").innerHTML = html;

	var	nodes = document.getElementById("imageWrapper").getElementsByTagName("img");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = insertImage;
	}
}

function insertImage(event)
{
	var markdown = "![Text po najetí kurzorem](https://odymaterialy.skauting.cz/API/v0.9/image/" + event.target.dataset.id + ")"
	var editor = ace.edit("editor");
	editor.session.insert(editor.getCursorPosition(), markdown);
	showImageSelector();
}
