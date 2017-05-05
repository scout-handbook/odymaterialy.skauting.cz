var converter;

function getLessonSetup()
{
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
}

function getLesson(lesson, noHistory)
{
	if(lesson === undefined || lesson === "")
	{
		getMainPage(noHistory);
	}
	request("/API/get_lesson", "name=" + encodeURIComponent(lesson), function(response)
		{
			showLesson(lesson, response, noHistory);
		});
}

function showLesson(name, markdown, noHistory)
{
	var html = "<header>HELLO</header>"
	html += "<div id=\"editor\">" + markdown + "</div><div id=\"preview\">";
	html += "<h1>" + name + "</h1>";
	html += converter.makeHtml(markdown);
	html += "</div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	var stateObject = { lessonName: name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
}
