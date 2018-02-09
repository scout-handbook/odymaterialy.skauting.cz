var converter;
var worker;
var running = false;
var queue;

function refreshPreviewSetup()
{
	if(window.Worker)
	{
		worker = new Worker("scripts/lessonEditor/previewWorker.js");
		worker.onmessage = function(message)
		{
			document.getElementById("preview-inner").innerHTML = filterXSS(message.data, xssOptions());
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

function refreshPreview(name, markdown)
{
	markdown = "# " + name + "\n" + markdown;
	if(window.Worker)
	{
		if(running)
		{
			queue = markdown;
		}
		else
		{
			running = true;
			worker.postMessage(markdown);
		}
	}
	else
	{
		var html = "<h1>" + name + "</h1>";
		html += filterXSS(converter.makeHtml(markdown), xssOptions());
		document.getElementById("preview").innerHTML = html;
	}
}

