function run()
{
	var converter = new showdown.Converter();
	var src = "#Hello, markdown!";
	//var html = converter.makeHtml(src);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			document.getElementById("main_id").innerHTML = this.responseText;
		}
	};
	  xhttp.open("GET", "API/list_lessons.php", true);
	  xhttp.send();
	//document.getElementById("main_id").innerHTML = html;
}

window.onload = run;

