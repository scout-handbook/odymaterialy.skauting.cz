function saveSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("id"))
	{
		save(sessionStorage.getItem("id"), sessionStorage.getItem("body"));
		sessionStorage.clear();
	}
	else if(readCookie("id"))
	{
		save(readCookie("id"), readCookie("body"));
		document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
		document.cookie = "body=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
	}
}

function readCookie(name)
{
	var regex = new RegExp("[; ]" + name + "=([^\\s;]*)");
	var match = (" " + document.cookie).match(regex);
	if(name && match)
	{
		return unescape(match[1]);
	}
	return undefined;
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
		history.back();
	}
	else
	{
		var id = document.getElementById("save").dataset.id;
		var body = ace.edit("editor").getValue()
		if(window.sessionStorage)
		{
			sessionStorage.setItem("id", id);
			sessionStorage.setItem("body", body);
		}
		else
		{
			document.cookie = "id=" + id + ";path=/";
			document.cookie = "body=" + body + ";path=/";
		}
		window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
	}
}
