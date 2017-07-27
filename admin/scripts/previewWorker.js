var converter

function main()
{
	onmessage = process;
	importScripts('/node_modules/showdown/dist/showdown.min.js');
	importScripts('/scripts/OdyMarkdown.js');
	converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	converter.setOption("smoothLivePreview", "true");
}

function process(message)
{
	var html = converter.makeHtml(message.data);
	postMessage(html);
}

main();
