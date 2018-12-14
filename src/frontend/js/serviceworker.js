"use strict";
/* eslint-env serviceworker */

var CACHE = "odymaterialy-" + ""/*INJECTED-VERSION*/;
var APIPATH = "/API/v0.9"
var cacheBlocking = [
	"/",
	"/index.html",
	"/dist/frontend-computer.min.css",
	"/dist/frontend-handheld.min.css",
	"/dist/frontend.min.css",
	"/dist/frontend.min.js",
	"/dist/frontend-pushed.min.css",
	"/dist/frontend-pushed.min.js",
	"/dist/shared.min.css",
	"/dist/shared-pushed.min.css",
];
var cacheNonBlocking = [
	"/node_modules/showdown/dist/showdown.min.js",
	"/node_modules/xss/dist/xss.min.js",
	"/font/fontello.woff"
];

var cacheUpdating = [
	APIPATH + "/lesson",
	APIPATH + "/competence"
];

function startsWith(haystack, needle)
{
	return haystack.substr(0, needle.length) === needle;
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
		var url = new URL(event.request.url); // eslint-disable-line compat/compat
		if(cacheUpdating.indexOf(url.pathname) !== -1)
		{
			event.respondWith(cacheUpdatingResponse(event.request));
		}
		else if(startsWith(url.pathname, APIPATH + "/lesson"))
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
		return new Promise(function(resolve) { // eslint-disable-line no-undef, compat/compat
				caches.match(request).then(function(response)
					{
						if(response)
						{
							resolve(response);
						}
						else
						{
							resolve(new Response(new Blob(["{\"status\": 404}"]), {"status": 404, "statusText": "Not Found"}));
						}
					});
			});
	}
	else
	{
		return fetch(request).then(function(response) // eslint-disable-line compat/compat
			{
				return cacheClone(request, response);
			});
	}
}

function cacheOnDemandResponse(request)
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return caches.open(CACHE).then(function(cache)
			{
				return cache.match(request);
			});
	}
	else
	{
		return fetch(request).then(function(response) // eslint-disable-line compat/compat
			{
				return caches.open(CACHE).then(function(cache)
					{
						return cache.match(request).then(function(cachedResponse)
							{
								if(cachedResponse === undefined)
								{
									return response
								}
								return cacheClone(request, response);
							});
					});
			});
	}
}

function genericResponse(request)
{
	return caches.open(CACHE).then(function(cache)
		{
			return cache.match(request).then(function(response)
				{
					if(response)
					{
						return response;
					}
					return fetch(request); // eslint-disable-line compat/compat
				})
		});
}

function cacheClone(request, response)
{
	return caches.open(CACHE).then(function(cache)
		{
			cache.put(request, response.clone());
			return response;
		});
}
