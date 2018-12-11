"use strict";
/* exported showImageSubview */

function showImageSubview(noHistory)
{
	window.mainPageTab = "images";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var i = 0; i < nodes.length; i++)
	{
		nodes[i].className = "topBarTab";
	}
	document.getElementById("imageManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Obrázky</h1>";
	html += "<div class=\"button greenButton\" id=\"addImage\"><i class=\"icon-plus\"></i>Nahrát</div>";
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
	request(CONFIG.apiuri + "/image", "GET", undefined, function(response)
		{
			showImageList(response, page, perPage);
		}, reAuthHandler);
	refreshLogin(true);
}

function showImageList(list, page, perPage)
{
	if(mainPageTab !== "images")
	{
		return;
	}
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><div class=\"buttonContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"><div class=\"button redButton deleteImage\" data-id=\"" + list[i] + "\"><i class=\"icon-trash-empty\"></i>Smazat</div></div></div>";
	}
	html += renderPagination(Math.ceil(list.length / perPage), page);
	document.getElementById("imageList").innerHTML = html;

	var	nodes = document.getElementById("imageList").getElementsByTagName("img");
	for(var j = 0; j < nodes.length; j++)
	{
		nodes[j].onclick = showImagePreview;
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
				downloadImageList(parseInt(event.target.dataset.page, 10), perPage);
			};
	}
}

function showImagePreview(event)
{
	var overlay = document.getElementById("overlay");
	overlay.style.display = "inline";
	overlay.style.cursor = "pointer";
	var html = "<img src=\"" + CONFIG.apiuri + "/image/" + event.target.dataset.id + "\" class=\"previewImage\">";
	overlay.innerHTML = html;
	overlay.onclick = function()
		{
			overlay.style.display = "none";
			overlay.style.cursor = "auto";
			overlay.innerHTML = "";
			overlay.onclick = undefined;
		};
}
