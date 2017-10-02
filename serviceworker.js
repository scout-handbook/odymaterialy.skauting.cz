var CACHE = "odymaterialy-v1";
var cacheBlocking = [
	"/index.html",
	"/scripts/AfterLoadEvent.js",
	"/scripts/auth.js",
	"/scripts/getLesson.js",
	"/scripts/history.js",
	"/scripts/listLessons.js",
	"/scripts/main.js",
	"/scripts/nav.js",
	"/scripts/OdyMarkdown.js",
	"/scripts/request.js",
	"/scripts/topUI.js",
	"/styles/competenceBubble.css",
	"/styles/lesson.css",
	"/styles/main.css",
	"/styles/mainPage.css",
	"/styles/nav.css",
	"/styles/offlineSwitch.css",
	"/styles/topUI.css",
	"/styles/computer.css",
	"/styles/handheld.css"
];
var cacheNonBlocking = [
	"/node_modules/showdown/dist/showdown.min.js"
];

var cacheUpdating = [
	"/API/v0.9/lesson"
];

// Polyfill
if(!String.prototype.startsWith)
{
	String.prototype.startsWith = function(searchString, position)
		{
			return this.substr(position || 0, searchString.length) === searchString;
		};
}

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
		else if(url.pathname.startsWith("/API/v0.9/lesson"))
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
				return cacheClone(request, response);
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
						return cacheClone(request, response);
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

function cacheClone(request, response)
{
	return caches.open(CACHE).then(function(cache)
		{
			cache.put(request, response.clone());
			return response;
		});
}
