function authSetup()
{
	getLoginState();
}

function getLoginState()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if (this.readyState === 4)
			{
				response = JSON.parse(this.responseText);
				if(response.status === 200)
				{
					showUserAccount(response.response);
				}
				else
				{
					showLoginForm();
				}
			}
		}
	xhttp.open("GET", "/API/v0.9/account", true);
	xhttp.send();
}

function showUserAccount(response)
{
	document.getElementById("userName").innerHTML = response.name;
	document.getElementById("logLink").innerHTML = "<a href=\"/API/v0.9/logout\">Odhlásit</a>";
	if(response.hasOwnProperty("avatar"))
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + response.avatar;
	}
	else
	{
		document.getElementById("userAvatar").src = "/avatar.png";
	}
}

function showLoginForm()
{
	document.getElementById("userName").innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink").innerHTML = "<a href=\"/API/v0.9/login\">Přihlásit</a>";
	document.getElementById("userAvatar").src = "/avatar.png";
}

