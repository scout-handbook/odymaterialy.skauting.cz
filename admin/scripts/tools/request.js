"use strict";

function request(url, method, payload, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
		{
			if(this.readyState === 4)
			{
				callback(JSON.parse(this.responseText));
			}
		}
	var query = "";
	if(payload)
	{
		if(method === "GET" || method === "DELETE" || payload.toString() !== "[object FormData]")
		{
			query = requestQueryBuilder(payload);
		}
		if((method === "GET" || method === "DELETE") && query)
		{
			url += "?" + query;
		}
	}
	xhr.open(method, url, true);
	if(method === "GET" || method === "DELETE" || payload.toString() !== "[object FormData]")
	{
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}
	if(method === "GET" || method === "DELETE")
	{
		xhr.send();
	}
	else if(payload.toString() !== "[object FormData]")
	{
		xhr.send(query);
	}
	else
	{
		xhr.send(payload);
	}
}

function requestQueryBuilder(payload)
{
	var query = "";
	var first = true;
	for(var key in payload)
	{
		if(!payload.hasOwnProperty(key))
		{
			continue;
		}
		if(payload[key].constructor === Array)
		{
			for(var i = 0; i < payload[key].length; i++)
			{
				if(!first)
				{
					query += "&";
				}
				query += key + "[]=" + payload[key][i];
				first = false;
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
	return query;
}
