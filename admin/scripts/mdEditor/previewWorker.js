var MDconverter;

function MDmain()
{
	onmessage = MDprocess;
	importScripts('/node_modules/showdown/dist/showdown.min.js');
	importScripts('/scripts/tools/OdyMarkdown.js');
	MDconverter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	MDconverter.setOption("noHeaderId", "true");
	MDconverter.setOption("tables", "true");
	MDconverter.setOption("smoothLivePreview", "true");
}

function MDprocess(message)
{
	var html = MDconverter.makeHtml(message.data);
	postMessage(html);
}

MDmain();
