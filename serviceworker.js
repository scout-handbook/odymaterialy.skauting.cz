var CACHE = "odymaterialy-v1";
var cacheBlocking = [
	"/",
	"/style.css",
	"/handheld.css",
	"/computer.css",
	"/script.js",
];
var cacheNonBlocking =[
	"/bower_components/showdown/dist/showdown.min.js",
];

self.addEventListener("install", function(event)
	{
		event.waitUntil(
			caches.open(CACHE).then(function(cache)
				{
					cache.addAll(cacheNonBlocking);
					return cache.addAll(cacheBlocking);
				})
		);
	});

self.addEventListener("fetch", function(event)
	{
		event.respondWith(
			caches.match(event.request)
				.then(function(response)
				{
					if(response)
					{
						return response;
					}
					return fetch(event.request);
				})
		);
	});

