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

function getUserList(page, perPage)
{
	if(!page)
	{
		page = 1;
	}
	if(!perPage)
	{
		perPage = 25;
	}
	var query = "page=" + page + "&per-page=" + perPage;
	request("/API/v0.9/list_users", query, function(response)
		{
			showUserList(JSON.parse(response), page, perPage);
		});
}

function showUserList(list, page, perPage)
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
		html += "</td><td><div class=\"button changeRole\" data-id=\"" + users[i].id + "\" data-role=\"" + users[i].role + "\" data-name=\"" + users[i].name + "\">Změnit roli</div></td></tr>";
	}
	html += "</table>";
	if(list.count > perPage)
	{
		var maxPage = Math.ceil(list.count / perPage);

		function renderPage(page)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + page + "\">" + page + "</div>";
		}

		html += "<div id=\"pagination\">";
		if(page > 3)
		{
			renderPage(1);
			html += " ... ";
		}
		if(page > 2)
		{
			renderPage(page - 2);
		}
		if(page > 1)
		{
			renderPage(page - 1);
		}
		html += "<div class=\"paginationButton active\">" + page + "</div>";
		if(page < maxPage)
		{
			renderPage(page + 1);
		}
		if(page < maxPage - 1)
		{
			renderPage(page + 2);
		}
		if(page < maxPage - 2)
		{
			html += " ... ";
			renderPage(maxPage);
		}
		html += "</div>";
	}
	document.getElementById("userList").innerHTML = html;

	var nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = showUserPage;
	}

	addOnClicks("changeRole", changeRoleOnClick);
}

function showUserPage(event)
{
	getUserList(parseInt(event.target.dataset.page));
}
