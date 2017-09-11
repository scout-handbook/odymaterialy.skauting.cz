function request(url, method, payload, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
		{
			if(this.readyState === 4 && this.status === 200)
			{
				if(JSON.parse(this.responseText).response)
				{
					callback(JSON.parse(this.responseText).response);
				}
				else // TODO: Remove
				{
					callback(this.responseText);
				}
			}
		}
	if(payload)
	{
		if(method === "GET" || method === "DELETE" || payload.toString() != "[object FormData]")
		{
			var query = "";
			var first = true;
			for(key in payload)
			{
				if(payload.hasOwnProperty(key))
				{
					if(payload[key].constructor === Array)
					{
						for(var i = 0; i < payload[key].length; i++)
						{
							if(!first)
							{
								query += "&";
							}
							query += key + "[]=" + payload[key][i];
						}
					}
					else
					{
						if(!first)
						{
							query += "&";
						}
						query += key + "=" + payload[key];
					}
					first = false;
				}
			}
		}
		if(method === "GET" || method === "DELETE")
		{
			url += "?" + query;
		}
	}
	xhr.open(method, url, true);
	if(method === "GET" || method === "DELETE" || payload.toString() != "[object FormData]")
	{
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}
	if(method === "GET" || method === "DELETE")
	{
		xhr.send();
	}
	else if(payload.toString() != "[object FormData]")
	{
		xhr.send(query);
	}
	else
	{
		xhr.send(payload);
	}
}
