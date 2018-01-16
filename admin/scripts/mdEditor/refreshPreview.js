var MDconverter;
var MDworker;
var MDrunning = false;
var MDqueue;

function MDrefreshPreviewSetup()
{
	if(window.Worker)
	{
		MDworker = new Worker("scripts/lessonEditor/previewWorker.js");
		MDworker.onmessage = function(message)
		{
			document.getElementById("preview-inner").innerHTML = filterXSS(message.data);
			if(MDqueue)
			{
				MDworker.postMessage(MDqueue);
				MDqueue = undefined;
			}
			else
			{
				MDrunning = false;
			}
		}
	}
	else
	{
		MDconverter = new showdown.Converter({extensions: ["OdyMarkdown"]});
		MDconverter.setOption("noHeaderId", "true");
		MDconverter.setOption("tables", "true");
		MDconverter.setOption("smoothLivePreview", "true");
	}
}

function MDrefreshPreview(name, markdown)
{
	markdown = "# " + name + "\n" + markdown;
	if(window.Worker)
	{
		if(MDrunning)
		{
			MDqueue = markdown;
		}
		else
		{
			MDrunning = true;
			MDworker.postMessage(markdown);
		}
	}
	else
	{
		var html = "<h1>" + name + "</h1>";
		html += filterXSS(MDconverter.makeHtml(markdown));
		document.getElementById("preview").innerHTML = html;
	}
}

