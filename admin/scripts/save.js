function saveSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("id"))
	{
		save(sessionStorage.getItem("id"), sessionStorage.getItem("body"));
		sessionStorage.clear();
	}
}

function save(id, body)
{
	var query = "id=" + id + "&body=" + encodeURIComponent(body);
	POSTrequest("/API/change_lesson", query, afterSave);
}

function afterSave(response)
{
	var success = JSON.parse(response).success;
	if(success)
	{
		dialog("Úspěšně uloženo.", "OK");
		history.back();
	}
	else
	{
		if(window.sessionStorage)
		{
			sessionStorage.setItem("id", document.getElementById("save").dataset.id);
			sessionStorage.setItem("body", ace.edit("editor").getValue());
			window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
		}
		else
		{
			dialog("Byl jste odhlášen a uložení se tedy nezdařilo. Přihlaste se prosím a zkuste to znovu.", "OK");
		}
	}
}
