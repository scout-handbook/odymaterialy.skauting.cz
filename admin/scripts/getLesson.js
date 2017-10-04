var changed;
var imageSelectorOpen = false;

function changeLessonOnClick(event)
{
	getLesson(event.target.dataset.id);
	return false;
}

function getLesson(id, noHistory)
{
	spinner();
	request("/API/v0.9/lesson/" + id, "GET", "", function(response)
		{
			if(response.status === 200)
			{
				lessonListEvent.addCallback(function()
					{
						showLesson(id, response.response, noHistory);
					});
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
}

function showLesson(id, markdown, noHistory)
{
	dismissSpinner();
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
	<div id="imageScroller">\
		<div id="imageWrapper"></div>\
	</div>\
</div>'
	html += '<div id="editor"></div><div id="preview"><div id="preview-inner"></div></div>';

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
	editor.$blockScrolling = Infinity;
	editor.setValue(markdown, -1);
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
		var payload = {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
		spinner();
		retryAction("/API/v0.9/lesson/" + encodeURIComponent(document.getElementById("save").dataset.id), "PUT", payload);
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

function getImageSelector(page, perPage)
{
	if(!page)
	{
		page = 1;
	}
	if(!perPage)
	{
		perPage = 15;
	}
	request("/API/v0.9/image", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				renderImageSelector(response.response, page, perPage);
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
}

function renderImageSelector(list, page, perPage)
{
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<img src=\"/API/v0.9/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\">";
	}
	if(list.length > perPage)
	{
		var maxPage = Math.ceil(list.length / perPage);

		function renderPage(page)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + page + "\">" + page + "</div>";
		}
		html += "<div id=\"pagination\">";
		if(page > 3)
		{
			renderPage(1);
			html += " ... ";
		}
		if(page > 2)
		{
			renderPage(page - 2);
		}
		if(page > 1)
		{
			renderPage(page - 1);
		}
		html += "<div class=\"paginationButton active\">" + page + "</div>";
		if(page < maxPage)
		{
			renderPage(page + 1);
		}
		if(page < maxPage - 1)
		{
			renderPage(page + 2);
		}
		if(page < maxPage - 2)
		{
			html += " ... ";
			renderPage(maxPage);
		}
		html += "</div>";
	}
	document.getElementById("imageWrapper").innerHTML = html;

	var	nodes = document.getElementById("imageWrapper").getElementsByTagName("img");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = insertImage;
	}
	nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				getImageSelector(parseInt(event.target.dataset.page), perPage);
			};
	}
}

function insertImage(event)
{
	var markdown = "![Text po najetí kurzorem](https://odymaterialy.skauting.cz/API/v0.9/image/" + event.target.dataset.id + ")"
	var editor = ace.edit("editor");
	editor.session.insert(editor.getCursorPosition(), markdown);
	showImageSelector();
}
