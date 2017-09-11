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

function retryAction(url, method, payload)
{
	request(url, method, payload, function(response)
		{
			retryActionAfter(JSON.parse(response), url, method, payload);
		})
}

function retryActionAfter(result, url, method, payload)
{
	if(result.success)
	{
		dialog("Akce byla úspěšná.", "OK");
		lessonListEvent = new AfterLoadEvent(3);
		lessonListSetup();
		if(retry)
		{
			getMainPage();
		}
		else
		{
			history.back();
		}
		retry = false;
	}
	else if(result.type === "AuthenticationException")
	{
		if(!retry && window.sessionStorage)
		{
			sessionStorage.setItem("retryActionUrl", url);
			sessionStorage.setItem("retryActionMethod", method);
			sessionStorage.setItem("retryActionPayload", JSON.stringify(payload));
			window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
		}
		else
		{
			dialog("Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.", "OK");
		}
	}
	else if(result.type === "RoleException")
	{
		dialog("Nemáte dostatečné oprávnění k této akci.", "OK");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
	}
}
