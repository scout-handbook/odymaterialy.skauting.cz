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
			var converter = new showdown.Converter();
			converter.setOption("noHeaderId", "true");
			var html = converter.makeHtml(this.responseText);
			html = "<h1>" + lesson + "</h1>" + html;
			document.getElementById("main_id").innerHTML = html;
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
		html += "<h5>" + list[i].name + "</h5>";
		for(var j = 0; j < list[i].lessons.length; j++)
		{
			var name = list[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"enableJS.html\" onclick=\"getLesson(\'" + name + "\');return false;\">" + name + "</a><br>"; // TODO: enableJS.html
		}
	}
	document.getElementById("nav_id").innerHTML = html;
}

function run()
{
	listLessons(showLessonList);
}

window.onload = run;

