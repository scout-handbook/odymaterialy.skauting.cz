var CACHE = "odymaterialy-v1";
var cacheResources = [
	"/",
	"/style.css",
	"/script.js"
];

self.addEventListener("install", function(event)
{
	event.waitUntil(
		caches.open(CACHE)
			.then(function(cache)
			{
				return cache.addAll(cacheResources);
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

