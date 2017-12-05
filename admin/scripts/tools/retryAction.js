var retry = false;

function retryActionSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("retryActionUrl"))
	{
		retry = true;
		retryAction(sessionStorage.getItem("retryActionUrl"), sessionStorage.getItem("retryActionMethod"), JSON.parse(sessionStorage.getItem("retryActionPayload")));
		sessionStorage.clear();
	}
}

function retryAction(url, method, payload, final)
{
	final = typeof final !== 'undefined' ? final : true;
	request(url, method, payload, function(response)
		{
			retryActionAfter(response, url, method, payload, final);
		})
	refreshLogin();
}

function retryActionAfter(response, url, method, payload, final)
{
	if(Math.floor(response.status / 100) === 2)
	{
		if(final)
		{
			dialog("Akce byla úspěšná.", "OK");
			refreshMetadata();
			if(retry)
			{
				showMainView();
			}
			else
			{
				history.back();
			}
		}
		retry = false;
	}
	else if(response.type === "AuthenticationException")
	{
		if(!retry && window.sessionStorage)
		{
			sessionStorage.setItem("retryActionUrl", url);
			sessionStorage.setItem("retryActionMethod", method);
			sessionStorage.setItem("retryActionPayload", JSON.stringify(payload));
			window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login?return-uri=/admin/" + mainPageTab);
		}
		else
		{
			dialog("Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.", "OK");
		}
	}
	else if(response.type === "RoleException")
	{
		dialog("Nemáte dostatečné oprávnění k této akci.", "OK");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
	}
}
