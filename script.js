var converter;

function listLessons(callback)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			callback(JSON.parse(this.responseText));
		}
	}
	xhttp.open("POST", "API/list_lessons.php", true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send();
}

function getLesson(lesson)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			showLesson(lesson, this.responseText);
		}
	}
	xhttp.open("POST", "API/get_lesson.php", true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send("name=" + lesson);
}

function showLessonList(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<h1>" + list[i].name + "</h1>";
		for(var j = 0; j < list[i].lessons.length; j++)
		{
			var name = list[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\" onclick=\"getLesson(\'" + name + "\');return false;\">" + name + "</a><br>";
		}
	}
	document.getElementsByTagName("nav")[0].innerHTML = html;
}

function showLesson(name, markdown)
{
	var html = converter.makeHtml(markdown);
	html = "<h1>" + name + "</h1>" + html;
	document.getElementsByTagName("main")[0].innerHTML = html;
}

function run()
{
	converter = new showdown.Converter();
	converter.setOption("noHeaderId", "true");
	listLessons(showLessonList);
}

window.onload = run;

