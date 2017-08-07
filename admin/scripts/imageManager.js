function showImageManager()
{
	mainPageTab = "images";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("imageManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Obrázky</h1><div id=\"userList\">";
	html += "<div class=\"button mainPage\" id=\"addImage\">Nahrát obrázek</div>";
	document.getElementById("mainPage").innerHTML = html;

	document.getElementById("addImage").onclick = addImage;
}
