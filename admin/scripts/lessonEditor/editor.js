var changed;
var lessonSettingsCache = {};
var lessonSettingsCacheEvent;

function showLessonEditor(name, body, actionQueue, id)
{
	populateEditorCache(id);
	changed = false;
	var html = '\
<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div>\
<header>\
	<div class="newButton yellowButton" id="discard">\
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + name + '" autocomplete="off">\
	</form>\
	<div class="newButton greenButton" id="save">\
		<i class="icon-floppy"></i>Uložit\
	</div>\
	<div class="newButton" id="lessonSettings">\
		<i class="icon-cog"></i>Nastavení\
	</div>\
</header>\
<div id="imageSelector">\
	<div id="imageScroller">\
		<div class="newButton yellowButton" id="closeImageSelector">\
			<i class=\"icon-up-open"></i> Zavřít\
		</div>\
		<div id="imageWrapper"></div>\
	</div>\
</div>\
<div id="editor-bar">\
	<div class="newButton" id="addImageButton">\
		<i class="icon-picture"></i> Vložit obrázek\
	</div>\
</div>\
<div id="editor"></div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, body);

	document.getElementById("discard").onclick = editorDiscard;
	document.getElementById("save").onclick = function() {actionQueue.addDefaultCallback(); actionQueue.dispatch();};
	document.getElementById("lessonSettings").onclick = function() {lessonSettings(id, actionQueue);};
	document.getElementById("addImageButton").onclick = toggleImageSelector;
	document.getElementById("closeImageSelector").onclick = toggleImageSelector;

	var editor = ace.edit("editor");
	editor.$blockScrolling = Infinity;
	editor.setValue(body, -1);
	editor.setOption("scrollPastEnd", 0.9);
	editor.setTheme("ace/theme/odymaterialy");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", editorOnChange);
	document.getElementById("name").oninput = editorOnChange;
	document.getElementById("name").onchange = editorOnChange;

	prepareImageSelector();
}

function editorOnChange()
{
	changed = true;
	refreshPreview(document.getElementById("name").value, ace.edit("editor").getValue());
	refreshLogin();
}

function editorDiscard()
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
	refreshLogin();
}

function populateEditorCache(id)
{
	lessonSettingsCacheEvent = new AfterLoadEvent(1);
	request("/API/v0.9/lesson/" + id + "/group", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				lessonSettingsCache["groups"] = response.response;
				lessonSettingsCacheEvent.trigger();
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				if(FIELDS[i].id)
				{
					lessonSettingsCache["field"] = FIELDS[i].id;
				}
				else
				{
					lessonSettingsCache["field"] = "";
				}
				lessonSettingsCache["competences"] = FIELDS[i].lessons[j].competences;
				break outer;
			}
		}
	}
}
