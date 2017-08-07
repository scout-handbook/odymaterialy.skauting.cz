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
	html += "<div id=\"imageList\"></div>";
	document.getElementById("mainPage").innerHTML = html;

	document.getElementById("addImage").onclick = addImage;
	getImageList();
}

function getImageList()
{
	request("/API/v0.9/list_images", "", function(response)
		{
			showImageList(JSON.parse(response));
		});
}

function showImageList(list)
{
	var html = "";
	for(var i = 0; i < list.length; i++)
	{
		html += "<img src=\"/API/v0.9/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\">";
	}
	document.getElementById("imageList").innerHTML = html;
}
