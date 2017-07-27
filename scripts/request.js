function cacheThenNetworkRequest(url, query, callback)
{
	var networkDataReceived = false;
	var cacheDataReceived = false;
	request(url, query, {}).addCallback(function(response)
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

function request(url, query, headers)
{
	var ret = new AfterLoadEvent(1);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if(this.readyState === 4)
			{
				if(this.status === 200)
				{
					ret.trigger(this.responseText);
				}
			}
		}
	if(query !== undefined && query !== "")
	{
		url += "?" + query;
	}
	xhttp.open("GET", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	for(var key in headers)
	{
		if(Object.prototype.hasOwnProperty.call(headers, key))
		{
			xhttp.setRequestHeader(key, headers[key]);
		}
		else if({}.hasOwnProperty.call(headers, key))
		{
			xhttp.setRequestHeader(key, headers[key]);
		}
	}
	xhttp.send();
	return ret;
}

