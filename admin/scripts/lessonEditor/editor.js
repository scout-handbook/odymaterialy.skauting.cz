"use strict";

var changed;
var lessonSettingsCache = {};
var lessonSettingsCacheEvent;
var editor;

function showLessonEditor(name, body, saveActionQueue, id, discardActionQueue, refreshAction)
{
	populateEditorCache(id);
	changed = false;
	var html = '\
<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div>\
<header>\
	<div class="button yellowButton" id="discard">\
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + name + '" autocomplete="off">\
	</form>\
	<div class="button greenButton" id="save">\
		<i class="icon-floppy"></i>Uložit\
	</div>\
	<div class="button" id="lessonSettings">\
		<i class="icon-cog"></i>Nastavení\
	</div>\
</header>\
<div id="imageSelector">\
	<div id="imageScroller">\
		<div class="button yellowButton" id="closeImageSelector">\
			<i class=\"icon-up-open"></i> Zavřít\
		</div>\
		<div class="button greenButton" id="imageSelectorAdd">\
			<i class=\"icon-plus"></i> Nahrát\
		</div>\
		<div id="imageWrapper"></div>\
	</div>\
</div>\
<div id="editor"><textarea></textarea></div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, body, "preview-inner");

	document.getElementById("discard").onclick = function() {editorDiscard(discardActionQueue);};
	document.getElementById("save").onclick = saveActionQueue.defaultDispatch;
	document.getElementById("lessonSettings").onclick = function() {lessonSettings(id, saveActionQueue);};
	document.getElementById("closeImageSelector").onclick = toggleImageSelector;
	document.getElementById("imageSelectorAdd").onclick = function() {addImage(true);};

	editor = new SimpleMDE({
		autoDownloadFontAwesome: false,
		autofocus: true,
		element: document.getElementById("editor").firstchild,
		indentWithTabs: false,
		parsingConfig: {
			allowAtxHeaderWithoutSpace: true
		},
		spellChecker: false,
		status: false,
		tabSize: 4,
		toolbar: [{
				name: "bold",
				action: SimpleMDE.toggleBold,
				className: "icon-bold",
				title: "Tučné"
			},
			{
				name: "italic",
				action: SimpleMDE.toggleItalic,
				className: "icon-italic",
				title: "Kurzíva"
			},
			{
				name: "heading",
				action: SimpleMDE.toggleHeadingSmaller,
				className: "icon-header",
				title: "Nadpis"
			},
			"|",
			{
				name: "unordered-list",
				action: SimpleMDE.toggleUnorderedList,
				className: "icon-list-bullet",
				title: "Seznam s odrážkami"
			},
			{
				name: "ordered-list",
				action: SimpleMDE.toggleOrderedList,
				className: "icon-list-numbered",
				title: "Číslovaný seznam"
			},
			"|",
			{
				name: "link",
				action: SimpleMDE.drawLink,
				className: "icon-link",
				title: "Vložit odkaz"
			},
			{
				name: "image",
				action: toggleImageSelector,
				className: "icon-picture",
				title: "Vložit obrázek"
			},
			{
				name: "table",
				action: SimpleMDE.drawTable,
				className: "icon-table",
				title: "Vložit tabulku"
			}
		]
	});
	editor.value(body);
	editor.codemirror.getDoc().clearHistory();
	editor.codemirror.on("change", function() {editorOnChange(refreshAction);});

	document.getElementById("name").oninput = function() {editorOnChange(refreshAction);};
	document.getElementById("name").onchange = function() {editorOnChange(refreshAction);};

	prepareImageSelector();
}

function editorOnChange(afterAction)
{
	changed = true;
	refreshPreview(document.getElementById("name").value, editor.value(), "preview-inner");
	refreshLogin(false, afterAction);
}

function editorDiscard(actionQueue)
{
	if(!changed)
	{
		editorDiscardNow(actionQueue);
	}
	else
	{
		dialog("Opravdu si přejete zahodit všechny změny?", "Ano", function()
			{
				editorDiscardNow(actionQueue);
			}, "Ne");
	}
	refreshLogin();
}

function editorDiscardNow(actionQueue)
{
	history.back();
	if(actionQueue)
	{
		actionQueue.dispatch(true);
	}
}

function populateEditorCache(id)
{
	lessonSettingsCacheEvent = new AfterLoadEvent(1);
	if(!id)
	{
		lessonSettingsCache["field"] = "";
		lessonSettingsCache["competences"] = [];
		lessonSettingsCache["groups"] = [];
		lessonSettingsCacheEvent.trigger();
		return;
	}
	request(CONFIG.apiuri + "/lesson/" + id + "/group", "GET", undefined, function(response)
		{
			if(response.status === 200)
			{
				lessonSettingsCache["groups"] = response.response;
				lessonSettingsCacheEvent.trigger();
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(CONFIG.apiuri + "/login");
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
			if(FIELDS[i].lessons[j].id === id)
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
