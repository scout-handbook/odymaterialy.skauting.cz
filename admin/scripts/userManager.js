function showUserManager()
{
	mainPageTab = "users";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("userManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Uživatelé</h1><div id=\"userList\">";
	document.getElementById("mainPage").innerHTML = html;
	getUserList();
}

function getUserList()
{
	request("/API/v0.9/list_users", "", function(response)
		{
			showUserList(JSON.parse(response));
		});
}

function showUserList(list)
{
	users = list.users;
	var html = "<table class=\"userTable\"><th>Jméno</th><th>Role</th><th>Akce</th></tr>";
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
			case "user":
				html += "Uživatel";
				break;
			default:
				html += "Host";
				break;
		}
		html += "</td><td><div class=\"button changeRole\" data-id=\"" + users[i].id + "\">Změnit roli</div></td></tr>";
	}
	html += "</table>";
	document.getElementById("userList").innerHTML = html;
}
