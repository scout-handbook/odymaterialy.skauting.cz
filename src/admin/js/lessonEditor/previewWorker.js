"use strict";
/* eslint-env worker */

var converter;

function main()
{
	self.onmessage = process;
	importScripts('/node_modules/showdown/dist/showdown.min.js');
	importScripts('/node_modules/xss/dist/xss.min.js');
	importScripts('/dist/admin-worker-deps.min.js');
	converter = new showdown.Converter({extensions: ["OdyMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	converter.setOption("smoothLivePreview", "true");
}

function process(payload)
{
	var html = filterXSS(converter.makeHtml(payload.data.body), xssOptions());
	postMessage({"id": payload.data.id, "body": html});
}

main();
