function showUserSubview(noHistory)
{
	mainPageTab = "users";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("userManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Uživatelé</h1><div id=\"userList\"></div>";
	document.getElementById("mainPage").innerHTML = html;
	downloadUserList();
	if(!noHistory)
	{
		history.pushState({"page": "users"}, "title", "/admin/users");
	}
}

function downloadUserList(searchName, page, perPage)
{
	document.getElementById("userList").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(!searchName)
	{
		searchName = "";
	}
	if(!page)
	{
		page = 1;
	}
	if(!perPage)
	{
		perPage = 25;
	}
	var payload = {"name": searchName, "page": page, "per-page": perPage}
	request("/API/v0.9/user", "GET", payload, function(response)
		{
			if(response.status === 200)
			{
				showUserList(response.response, searchName, page, perPage);
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
	refreshLogin(true);
}

function showUserList(list, searchName, page, perPage)
{
	if(mainPageTab != "users")
	{
		return;
	}
	users = list.users;
	var html = "<form id=\"userSearchForm\"><input type=\"text\" class=\"formText\" id=\"userSearchBox\" placeholder=\"Jméno uživatele\"><div class=\"button\" id=\"userSearchButton\">Vyhledat</div>";
	if(searchName)
	{
		html += "<div class=\"button\" id=\"userSearchCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	}
	html += "</form>";
	html += "<table class=\"userTable\"><th>Jméno</th><th>Role</th><th>Skupiny</th>";
	html += "<th>Akce</th>";
	html += "</tr>";
	for(var i = 0; i < users.length; i++)
	{
		html += "<tr><td>" + users[i].name + "</td><td>";
		switch(users[i].role)
		{
			case "superuser":
				html += "Superuser";
				break;
			case "administrator":
				html += "Administrátor";
				break;
			case "editor":
				html += "Editor";
				break;
			default:
				html += "Uživatel";
				break;
		}
		html += "</td><td>";
		var first = true;
		for(var j = 0; j < GROUPS.length; j++)
		{
			if(users[i].groups.indexOf(GROUPS[j].id) >= 0)
			{
				if(!first)
				{
					html += ", ";
				}
				html += GROUPS[j].name;
				first = false;
			}
		}
		html += "</td><td style=\"white-space: nowrap;\">";
		if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
		{
			html += "<div class=\"button changeUserRole\" data-id=\"" + users[i].id + "\" data-role=\"" + users[i].role + "\" data-name=\"" + users[i].name + "\">Změnit roli</div><br>";
		}
		html += "<div class=\"button changeUserGroups\" data-id=\"" + users[i].id + "\" data-groups=\'" + JSON.stringify(users[i].groups) + "\' data-name=\"" + users[i].name + "\">Změnit skupiny</div></td>";
		html += "</tr>";
	}
	html += "</table>";
	html += renderPagination(Math.ceil(list.count / perPage), page);
	document.getElementById("userList").innerHTML = html;

	document.getElementById("userSearchForm").onsubmit = function()
		{
			downloadUserList(document.getElementById("userSearchBox").value, 1, perPage);
			return false;
		}
	document.getElementById("userSearchButton").onclick = function()
		{
			downloadUserList(document.getElementById("userSearchBox").value, 1, perPage);
		};
	if(searchName)
		{
			document.getElementById("userSearchCancel").onclick = function()
				{
					downloadUserList("", 1, perPage);
				};
		}
	var nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				downloadUserList(searchName, parseInt(event.target.dataset.page), perPage);
			};
	}

	addOnClicks("changeUserRole", changeUserRoleOnClick);
	addOnClicks("changeUserGroups", changeUserGroupsOnClick);
}
