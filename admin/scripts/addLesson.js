function addLesson(noHistory)
{
	var html = '\
<header>\
	<div class="button" id="discard">\
		<i class="icon-cancel"></i>\
		Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + defaultName + '" autocomplete=off>\
	</form>\
	<div class="button" id="save">\
		Uložit\
		<i class="icon-floppy"></i>\
	</div>\
</header>'
	html += '<div id="editor">' + defaultBody + '</div><div id="preview"><div id="preview-inner"></div></div>';
	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(defaultName, defaultBody);

	var stateObject = {};
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = addCallback;

	var editor = ace.edit("editor");
	editor.setOption("scrollPastEnd", 0.9);
	editor.setTheme("ace/theme/odymaterialy");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().on("change", change);
	document.getElementById("name").oninput = change;
	document.getElementById("name").onchange = change;
}

function addCallback()
{
	var query = "name=" + encodeURIComponent(document.getElementById("name").value);
	query += "&body=" + encodeURIComponent(ace.edit("editor").getValue());
	retryAction("/API/v0.9/add_lesson", query);
}
