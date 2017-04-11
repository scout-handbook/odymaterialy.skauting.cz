var CACHE = "odymaterialy-v1";
var cacheBlocking = [
	"/",
	"/style.css",
	"/handheld.css",
	"/computer.css",
	"/script.js"
];
var cacheNonBlocking = [
	"/node_modules/showdown/dist/showdown.min.js"
];

var cacheUpdating = [
	"/API/list_lessons.php"
];

var cacheOnDemand = [
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
			event.respondWith(cacheUpdatingResponse(event.request));
		}
		else if(cacheOnDemand.indexOf(url.pathname) !== -1)
		{
			event.respondWith(cacheOnDemandResponse(event.request));
		}
		else
		{
			event.respondWith(genericResponse(event.request));
		}
	});

function cacheUpdatingResponse(request)
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

function cacheOnDemandResponse(request)
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return caches.match(request);
	}
	else
	{
		return fetch(request).then(function(response)
			{
				return caches.match(request).then(function(cachedResponse)
					{
						if(cachedResponse === undefined)
						{
							return response
						}
						return caches.open(CACHE).then(function(cache)
							{
								cache.put(request, response.clone());
								return response;
							});
					});
			});
	}
}

function genericResponse(request)
{
	return caches.match(request).then(function(response)
		{
			if(response)
			{
				return response;
			}
			return fetch(request);
		})
}

