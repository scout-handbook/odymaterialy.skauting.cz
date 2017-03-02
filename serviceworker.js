var CACHE = "odymaterialy-v1";
var cacheBlocking = [
	"/",
	"/style.css",
	"/handheld.css",
	"/computer.css",
	"/script.js"
];
var cacheNonBlocking = [
	"/bower_components/showdown/dist/showdown.min.js"
];

var cacheUpdating = [
	"/API/list_lessons.php",
	"/API/get_lesson.php"
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
		var url = new URL(event.request.url);
		if(cacheUpdating.indexOf(url.pathname) !== -1)
		{
			event.respondWith(fetchCacheThenNetwork(event.request));
		}
		else
		{
			event.respondWith(
				caches.match(event.request).then(function(response)
					{
						if(response)
						{
							return response;
						}
						return fetch(event.request);
					})
			);
		}
	});

function fetchCacheThenNetwork(request)
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return caches.match(request);
	}
	else
	{
		return fetch(request).then(function(response)
			{
				return caches.open(CACHE).then(function(cache)
					{
						cache.put(request, response.clone());
						return response;
					});
			});
	}
}

