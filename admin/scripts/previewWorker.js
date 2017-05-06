var converter

function main()
{
	onmessage = process;
	importScripts('/node_modules/showdown/dist/showdown.min.js');
	importScripts('/scripts/OdyMarkdown.js');
	converter = new showdown.Converter({extensions: ["notes"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
}

function process(message)
{
	var html = converter.makeHtml(message.data);
	postMessage(html);
}

main();
