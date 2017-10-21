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
	if(response.role == "editor" || response.role == "administrator" || response.role == "superuser")
	{
		document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Odhlásit</a><a href=\"/admin\" id=\"adminLink\">Administrace</a>";
	}
	else
	{
		document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Odhlásit</a>";
	}
	document.getElementById("logLink").firstChild.onclick = logoutRedirect;
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
	document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Přihlásit</a>";
	document.getElementById("logLink").firstChild.onclick = loginRedirect;
	document.getElementById("userAvatar").src = "/avatar.png";
}

function loginRedirect()
{
	window.location = "/API/v0.9/login?return-uri=" + encodeURIComponent(window.location.href);
	return false;
}

function logoutRedirect()
{
	window.location = "/API/v0.9/logout?return-uri=" + encodeURIComponent(window.location.href);
	return false;
}

function refreshLogin()
{
	var allCookies = "; " + document.cookie;
	var parts = allCookies.split("; skautis_timeout=");
	if(parts.length == 2)
	{
		var timeout = parts.pop().split(";").shift();
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			request("/API/v0.9/refresh");
		}
	}
}
