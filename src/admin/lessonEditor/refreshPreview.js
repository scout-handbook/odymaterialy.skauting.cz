"use strict";
/* exported refreshPreviewSetup, refreshPreview */

var converter;
var worker;
var running = false;
var queue;

function refreshPreviewSetup()
{
	if(window.Worker)
	{
		worker = new Worker("../dist/admin-worker.min.js");
		worker.onmessage = function(payload)
		{
			document.getElementById(payload.data.id).innerHTML = payload.data.body;
			if(queue)
			{
				worker.postMessage(queue);
				queue = undefined;
			}
			else
			{
				running = false;
			}
		}
	}
	else
	{
		converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
		converter.setOption("noHeaderId", "true");
		converter.setOption("tables", "true");
		converter.setOption("smoothLivePreview", "true");
	}
}

function refreshPreview(name, markdown, id)
{
	var payload = {"id": id, "body": "# " + name + "\n" + markdown};
	if(window.Worker)
	{
		if(running)
		{
			queue = payload;
		}
		else
		{
			running = true;
			worker.postMessage(payload);
		}
	}
	else
	{
		var html = "<h1>" + name + "</h1>";
		html += filterXSS(converter.makeHtml(payload.body), xssOptions());
		document.getElementById(payload.id).innerHTML = html;
	}
}

