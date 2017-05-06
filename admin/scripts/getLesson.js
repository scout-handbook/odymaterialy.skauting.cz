var converter;
var worker;

function getLessonSetup()
{
	if(!window.Worker)
	{
		converter = new showdown.Converter({extensions: ["notes"]});
		converter.setOption("noHeaderId", "true");
		converter.setOption("tables", "true");
	}
}

function getLesson(lesson, noHistory)
{
	if(lesson === undefined || lesson === "")
	{
		getMainPage(noHistory);
		return;
	}
	request("/API/get_lesson", "name=" + encodeURIComponent(lesson), function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showLesson(name, markdown, noHistory)
{
	var html = "<header><div id=\"discard\"><i class=\"icon-left-big\"></i>Zrušit</div><div id=\"save\">Uložit<i class=\"icon-floppy\"></i></div></header>"
	html += "<div id=\"editor\">" + markdown + "</div><div id=\"preview\"></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;

	var stateObject = { lessonName: name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	document.getElementById("discard").onclick = discard;
	document.getElementById("save").onclick = save;

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	if(window.Worker)
	{
		worker = new Worker("scripts/previewWorker.js");
		worker.onmessage = function(message)
		{
			document.getElementById("preview").innerHTML = "<h1>" + name + "</h1>" + message.data;
		}
	}
	editor.getSession().on("change", function()
		{
			refreshPreview(name, editor.getValue());
		});
	refreshPreview(name, markdown);
}

function refreshPreview(name, markdown)
{
	if(window.Worker)
	{
		worker.postMessage(markdown);
	}
	else
	{
		var html = "<h1>" + name + "</h1>";
		html += converter.makeHtml(markdown);
		document.getElementById("preview").innerHTML = html;
	}
}

function discard()
{
	if(confirm("Opravdu si přejete zahodit všechny změny?"))
	{
		if(window.Worker)
		{
			worker.terminate();
		}
		history.back();
	}
}

function save()
{
	console.log("SAVE");
}
