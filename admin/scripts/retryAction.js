var retry = false;

function retryActionSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("retryActionUrl"))
	{
		retry = true;
		retryAction(sessionStorage.getItem("retryActionUrl"), sessionStorage.getItem("retryActionQuery"));
		sessionStorage.clear();
	}
}

function retryAction(url, query)
{
	POSTrequest(url, query, function(response)
		{
			retryActionAfter(JSON.parse(response), url, query);
		})
}

function retryActionAfter(result, url, query)
{
	if(result.success)
	{
		dialog("Úspěšně uloženo", "OK");
		lessonListEvent = new AfterLoadEvent(2);
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
			sessionStorage.setItem("retryActionQuery", query);
			window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
		}
		else
		{
			dialog("Byl jste odhlášen a uložení se nepodařilo. Přihlašte se prosím a zkuste to znovu.", "OK");
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
