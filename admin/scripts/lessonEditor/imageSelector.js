"use strict";

var imageSelectorOpen = false;

function prepareImageSelector(page, perPage)
{
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
			renderImageSelector(response, page, perPage);
		}, reAuthHandler);
	refreshLogin();
}

function renderImageSelector(list, page, perPage)
{
	if(!document.getElementById("imageWrapper"))
	{
		return;
	}
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><div class=\"buttonContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"></div></div>";
	}
	if(list.length > perPage)
	{
		var maxPage = Math.ceil(list.length / perPage);
		html += "<div id=\"pagination\">";
		if(page > 3)
		{
			html += "<div class=\"paginationButton\" data-page=\"1\">1</div> ... ";
		}
		if(page > 2)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page - 2) + "\">" + (page - 2) + "</div>";
		}
		if(page > 1)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page - 1) + "\">" + (page - 1) + "</div>";
		}
		html += "<div class=\"paginationButton active\">" + page + "</div>";
		if(page < maxPage)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page + 1) + "\">" + (page + 1) + "</div>";
		}
		if(page < maxPage - 1)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page + 2) + "\">" + (page + 2) + "</div>";
		}
		if(page < maxPage - 2)
		{
			html += " ... <div class=\"paginationButton\" data-page=\"" + maxPage + "\">" + maxPage + "</div>";
		}
		html += "</div>";
	}
	document.getElementById("imageWrapper").innerHTML = html;

	var	nodes = document.getElementById("imageWrapper").getElementsByTagName("img");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = insertImage;
	}
	nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				prepareImageSelector(parseInt(event.target.dataset.page, 10), perPage);
			};
	}
}

function toggleImageSelector()
{
	if(imageSelectorOpen)
	{
		document.getElementById("imageSelector").style.top = "-100%";
	}
	else
	{
		document.getElementById("imageSelector").style.top = "-76px";
	}
	imageSelectorOpen = !imageSelectorOpen;
	refreshLogin();
}

function insertImage(event)
{
	var markdown = "![Text po najetí kurzorem](" + CONFIG.apiuri + "/image/" + event.target.dataset.id + ")"
	var doc = editor.codemirror.getDoc();
	doc.replaceRange(markdown, doc.getCursor());
	toggleImageSelector();
	refreshLogin();
}
