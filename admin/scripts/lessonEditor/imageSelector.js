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
	request("/API/v0.9/image", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				renderImageSelector(response.response, page, perPage);
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	refreshLogin();
}

function renderImageSelector(list, page, perPage)
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
				prepareImageSelector(parseInt(event.target.dataset.page), perPage);
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
		document.getElementById("imageSelector").style.top = "-91px";
	}
	imageSelectorOpen = !imageSelectorOpen;
	refreshLogin();
}

function insertImage(event)
{
	var markdown = "![Text po najetí kurzorem](https://odymaterialy.skauting.cz/API/v0.9/image/" + event.target.dataset.id + ")"
	var editor = ace.edit("editor");
	editor.session.insert(editor.getCursorPosition(), markdown);
	toggleImageSelector();
	refreshLogin();
}
