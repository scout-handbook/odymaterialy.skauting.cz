function showImageSubview(noHistory)
{
	mainPageTab = "images";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("imageManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Obrázky</h1>";
	html += "<div class=\"button mainPage\" id=\"addImage\">Nahrát obrázek</div>";
	html += "<div id=\"imageList\"></div>";
	document.getElementById("mainPage").innerHTML = html;

	document.getElementById("addImage").onclick = addImage;
	downloadImageList();
	if(!noHistory)
	{
		history.pushState({"page": "images"}, "title", "/admin/images");
	}
}

function downloadImageList(page, perPage)
{
	document.getElementById("imageList").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(!page)
	{
		page = 1;
	}
	if(!perPage)
	{
		perPage = 15;
	}
	request("/API/v0.9/image", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				showImageList(response.response, page, perPage);
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	refreshLogin(true);
}

function showImageList(list, page, perPage)
{
	if(mainPageTab != "images")
	{
		return;
	}
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><img src=\"/API/v0.9/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"><div class=\"button mainPage deleteImage\" data-id=\"" + list[i] + "\">Smazat</div></div>";
	}
	html += renderPagination(Math.ceil(list.length / perPage), page);
	document.getElementById("imageList").innerHTML = html;

	var	nodes = document.getElementById("imageList").getElementsByTagName("img");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = showImagePreview;
	}
	nodes = document.getElementsByClassName("deleteImage");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = deleteImageOnClick;
	}
	nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				downloadImageList(parseInt(event.target.dataset.page), perPage);
			};
	}
}

function showImagePreview(event)
{
	var overlay = document.getElementById("overlay");
	overlay.style.display = "inline";
	overlay.style.cursor = "pointer";
	var html = "<img src=\"/API/v0.9/image/" + event.target.dataset.id + "\" class=\"previewImage\">";
	overlay.innerHTML = html;
	overlay.onclick = function()
		{
			overlay.style.display = "none";
			overlay.style.cursor = "auto";
			overlay.innerHTML = "";
			overlay.onclick = undefined;
		};
}
