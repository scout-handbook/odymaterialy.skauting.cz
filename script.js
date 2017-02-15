function xhttpPost()
{
	if (this.readyState == 4 && this.status == 200)
	{
		var converter = new showdown.Converter();
		var html = converter.makeHtml(this.responseText);
		document.getElementById("main_id").innerHTML = html;
	}
}
function run()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = xhttpPost;
	xhttp.open("POST", "API/get_lesson.php", true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send("name=Prostředky");
}

window.onload = run;

