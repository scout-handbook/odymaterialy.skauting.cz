function showImageManager(noHistory)
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
	getImageList();
	if(!noHistory)
	{
		history.pushState({"page": "images"}, "title", "/admin/images");
	}
}

function getImageList(page, perPage)
{
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
}

function showImageList(list, page, perPage)
{
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<img src=\"/API/v0.9/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\">";
	}
	if(list.length > perPage)
	{
		var maxPage = Math.ceil(list.length / perPage);

		function renderPage(page)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + page + "\">" + page + "</div>";
		}
		html += "<div id=\"pagination\">";
		if(page > 3)
		{
			renderPage(1);
			html += " ... ";
		}
		if(page > 2)
		{
			renderPage(page - 2);
		}
		if(page > 1)
		{
			renderPage(page - 1);
		}
		html += "<div class=\"paginationButton active\">" + page + "</div>";
		if(page < maxPage)
		{
			renderPage(page + 1);
		}
		if(page < maxPage - 1)
		{
			renderPage(page + 2);
		}
		if(page < maxPage - 2)
		{
			html += " ... ";
			renderPage(maxPage);
		}
		html += "</div>";
	}
	document.getElementById("imageList").innerHTML = html;

	var	nodes = document.getElementById("imageList").getElementsByTagName("img");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = showImagePreview;
	}
	nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				getImageList(parseInt(event.target.dataset.page), perPage);
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
