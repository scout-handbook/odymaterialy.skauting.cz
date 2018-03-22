function request(url, query, headers)
{
	var ret = new AfterLoadEvent(1);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if(this.readyState === 4)
			{
				var body = JSON.parse(this.responseText);
				if(this.status === 200)
				{
					ret.trigger(body.response);
				}
				else if(this.status === 403 && body.type === "RoleException")
				{
					showLessonListView();
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
		if(!headers.hasOwnProperty(key))
		{
			continue;
		}
		xhttp.setRequestHeader(key, headers[key]);
	}
	xhttp.send();
	return ret;
}
