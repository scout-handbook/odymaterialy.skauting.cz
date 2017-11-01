function refreshLogin(forceRelogin)
{
	var allCookies = "; " + document.cookie;
	var parts = allCookies.split("; skautis_timeout=");
	if(parts.length == 2)
	{
		var timeout = parts.pop().split(";").shift();
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			request("/API/v0.9/refresh", "GET", undefined, function(response)
				{
					if(response.status == 200) {}
					else if(response.type === "AuthenticationException")
					{
						if(forceRelogin)
						{
							window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login?return-uri=/admin/" + mainPageTab);
						}
					}
					else
					{
						dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
					}
				});
		}
	}
}
