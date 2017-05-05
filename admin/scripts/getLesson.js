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
	var html = converter.makeHtml(markdown);
	html = "<h1>" + name + "</h1>" + html;
	document.getElementsByTagName("main")[0].innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { lessonName: name };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}
}
