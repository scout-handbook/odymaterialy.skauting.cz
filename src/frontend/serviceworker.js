"use strict";
/* eslint-env serviceworker */

var CACHE = "odymaterialy-" + ""/*INJECTED-VERSION*/;
var APIPATH = "/API/v0.9"
var cacheBlocking = [
	"/",
	"/index.html",
	"/styles/fontello.css",
	"/styles/competenceBubble.css",
	"/styles/lesson.css",
	"/styles/main.css",
	"/styles/mainPage.css",
	"/styles/nav.css",
	"/styles/offlineSwitch.css",
	"/styles/topUI.css",
	"/styles/handheld.css",
	"/styles/computer.css",
	"/client-config.json",
	"/scripts/tools/AfterLoadEvent.js",
	"/scripts/tools/cacheThenNetworkRequest.js",
	"/scripts/tools/config.js",
	"/scripts/tools/getLessonById.js",
	"/scripts/tools/OdyMarkdown.js",
	"/scripts/tools/request.js",
	"/scripts/tools/urlEscape.js",
	"/scripts/UI/header.js",
	"/scripts/UI/lessonView.js",
	"/scripts/UI/navigation.js",
	"/scripts/UI/TOC.js",
	"/scripts/views/competence.js",
	"/scripts/views/competenceList.js",
	"/scripts/views/field.js",
	"/scripts/views/lesson.js",
	"/scripts/views/lessonList.js",
	"/scripts/authentication.js",
	"/scripts/history.js",
	"/scripts/main.js",
	"/scripts/metadata.js"
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
