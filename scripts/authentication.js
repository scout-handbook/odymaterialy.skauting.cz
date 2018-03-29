"use strict";

function authenticationSetup()
{
	showAccountInfo();
}

function showAccountInfo()
{
	metadataEvent.addCallback(function()
		{
			if(window.LOGINSTATE)
			{
				renderUserAccount();
			}
			else
			{
				renderLoginForm();
			}
		});
}

function renderUserAccount()
{
	document.getElementById("userName").innerHTML = LOGINSTATE.name;
	if(LOGINSTATE.role === "editor" || LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Odhlásit</a><a href=\"/admin\" id=\"adminLink\">Administrace</a>";
	}
	else
	{
		document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Odhlásit</a>";
	}
	document.getElementById("logLink").firstChild.onclick = logoutRedirect;
	if(LOGINSTATE.hasOwnProperty("avatar"))
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + LOGINSTATE.avatar;
	}
	else
	{
		document.getElementById("userAvatar").src = "/avatar.png";
	}
}

function renderLoginForm()
{
	document.getElementById("userName").innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink").innerHTML = "<a href=\"/error/enableJS.html\">Přihlásit</a>";
	document.getElementById("logLink").firstChild.onclick = loginRedirect;
	document.getElementById("userAvatar").src = "/avatar.png";
}

function loginRedirect()
{
	window.location = APIURI + "/login?return-uri=" + encodeURIComponent(window.location.href);
	return false;
}

function logoutRedirect()
{
	window.location = APIURI + "/logout";
	return false;
}

function refreshLogin()
{
	var allCookies = "; " + document.cookie;
	var parts = allCookies.split("; skautis_timeout=");
	if(parts.length === 2)
	{
		var timeout = parts.pop().split(";").shift();
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			request(APIURI + "/refresh");
		}
	}
}
