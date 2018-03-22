var converter;

function main()
{
	self.onmessage = process;
	importScripts('/node_modules/showdown/dist/showdown.min.js');
	importScripts('/scripts/tools/OdyMarkdown.js');
	converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	converter.setOption("smoothLivePreview", "true");
}

function process(payload)
{
	var html = converter.makeHtml(payload.data.body);
	postMessage({"id": payload.data.id, "body": html});
}

main();
