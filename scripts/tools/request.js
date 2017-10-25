function request(url, query, headers)
{
	var ret = new AfterLoadEvent(1);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if(this.readyState === 4 && this.status === 200)
			{
				ret.trigger(JSON.parse(this.responseText).response)
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
