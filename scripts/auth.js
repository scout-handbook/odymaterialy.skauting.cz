function authSetup()
{
	getLoginState();
}

function getLoginState()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				response = JSON.parse(this.responseText);
				if(response.login_state)
				{
					showUserAccount(response);
				}
				else
				{
					showLoginForm(response);
				}
			}
		}
	xhttp.open("GET", "/API/v0.9/get_login_state?returnUri=" + window.location.pathname, true);
	xhttp.send();
}

function showUserAccount(response)
{
	document.getElementById("userName").innerHTML = response.user_name;
	document.getElementById("logLink").innerHTML = "<a href=\"/auth/logout.php\">Odhlásit</a>";
	if(response.hasOwnProperty("user_avatar"))
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + response.user_avatar;
	}
	else
	{
		document.getElementById("userAvatar").src = "/images/avatar.png";
	}
}

function showLoginForm(response)
{
	document.getElementById("userName").innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink").innerHTML = "<a href=\"/auth/login.php\">Přihlásit</a>";
	document.getElementById("userAvatar").src = "/images/avatar.png";
}

