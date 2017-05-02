function cacheThenNetworkRequest(url, query, callback)
{
	var networkDataReceived = false;
	request(url, query, {}).then(function(response)
		{
			networkDataReceived = true;
			callback(response);
		});
	request(url, query, {"Accept": "x-cache/only"}).then(function(response)
		{
			if(!networkDataReceived)
			{
				callback(response);
			}
		}, function(reject){});
}

function request(url, query, headers)
{
	return new Promise(function(resolve, reject)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
			{
				if (this.readyState === 4)
				{
					if(this.status === 200)
					{
						resolve(this.responseText);
					}
					else
					{
						reject(Error(this.statusText));
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
			if({}.hasOwnProperty.call(headers, key))
			{
				xhttp.setRequestHeader(key, headers[key]);
			}
		}
		xhttp.send();
	});
}

