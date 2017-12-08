var changed;

function showLessonEditor(name, body, actionQueue)
{
	changed = false;
	var html = '\
<header>\
	<div class="newButton yellowButton" id="discard">\
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + name + '" autocomplete="off">\
	</form>\
	<div class="newButton greenButton" id="save" data-id="">\
		<i class="icon-floppy"></i>Uložit\
	</div>\
</header>\
<div id="imageSelector">\
	<div id="imageScroller">\
		<div class="newButton" id="closeImageSelector">\
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
	document.getElementById("save").onclick = actionQueue.dispatch;
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
