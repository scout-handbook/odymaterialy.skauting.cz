"use strict";

function cacheThenNetworkRequest(url, query, callback)
{
	var networkDataReceived = false;
	var cacheDataReceived = false;
	request(url, query, undefined).addCallback(function(response)
		{
			networkDataReceived = true;
			callback(response, cacheDataReceived);
		});
	request(url, query, {"Accept": "x-cache/only"}).addCallback(function(response)
		{
			if(!networkDataReceived)
			{
				cacheDataReceived = true;
				callback(response, false);
			}
		});
}
