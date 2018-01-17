var MDchanged;
var MDlessonSettingsCache = {};
var MDlessonSettingsCacheEvent;
var editor;

function MDshowLessonEditor(name, body, actionQueue, id)
{
	MDpopulateEditorCache(id);
	MDchanged = false;
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
<div id="MDimageSelector">\
	<div id="imageScroller">\
		<div class="button yellowButton" id="closeImageSelector">\
			<i class=\"icon-up-open"></i> Zavřít\
		</div>\
		<div id="imageWrapper"></div>\
	</div>\
</div>\
<div id="MDeditor"><textarea></textarea></div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	MDrefreshPreview(name, body);

	document.getElementById("discard").onclick = MDeditorDiscard;
	document.getElementById("save").onclick = function() {actionQueue.addDefaultCallback(); actionQueue.dispatch();};
	document.getElementById("lessonSettings").onclick = function() {MDlessonSettings(id, actionQueue);};
	document.getElementById("closeImageSelector").onclick = MDtoggleImageSelector;

	editor = new SimpleMDE({
		autoDownloadFontAwesome: false,
		autofocus: true,
		element: document.getElementById("MDeditor").firstchild,
		indentWithTabs: false,
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
				action: MDtoggleImageSelector,
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
	editor.codemirror.on("change", MDeditorOnChange);

	document.getElementById("name").oninput = MDeditorOnChange;
	document.getElementById("name").onchange = MDeditorOnChange;

	MDprepareImageSelector();
}

function MDeditorOnChange()
{
	MDchanged = true;
	MDrefreshPreview(document.getElementById("name").value, editor.value());
	refreshLogin();
}

function MDeditorDiscard()
{
	if(!MDchanged)
	{
		history.back();
	}
	else
	{
		dialog("Opravdu si přejete zahodit všechny změny?", "Ano", function()
			{
				history.back();
			}, "Ne");
	}
	refreshLogin();
}

function MDpopulateEditorCache(id)
{
	MDlessonSettingsCacheEvent = new AfterLoadEvent(1);
	if(!id)
	{
		MDlessonSettingsCache["field"] = "";
		MDlessonSettingsCache["competences"] = [];
		MDlessonSettingsCache["groups"] = [];
		MDlessonSettingsCacheEvent.trigger();
		return;
	}
	request("/API/v0.9/lesson/" + id + "/group", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				MDlessonSettingsCache["groups"] = response.response;
				MDlessonSettingsCacheEvent.trigger();
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
			if(FIELDS[i].lessons[j].id === id)
			{
				if(FIELDS[i].id)
				{
					MDlessonSettingsCache["field"] = FIELDS[i].id;
				}
				else
				{
					MDlessonSettingsCache["field"] = "";
				}
				MDlessonSettingsCache["competences"] = FIELDS[i].lessons[j].competences;
				break outer;
			}
		}
	}
}
