"use strict";
/* exported showUserSubview */

function showUserSubview(noHistory)
{
	window.mainPageTab = "users";
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

function downloadUserList(searchName, page, perPage, role, group)
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
	if(!role)
	{
		role = "all";
	}
	if(!group)
	{
		group = "00000000-0000-0000-0000-000000000000";
	}
	var payload = {"name": searchName, "page": page, "per-page": perPage}
	if(role !== "all")
	{
		payload["role"] = role;
	}
	if(group !== "00000000-0000-0000-0000-000000000000")
	{
		payload["group"] = group;
	}
	request(CONFIG.apiuri + "/user", "GET", payload, function(response)
		{
			showUserList(response, searchName, page, perPage, role, group);
		}, reAuthHandler);
	refreshLogin(true);
}

function showUserList(list, searchName, page, perPage, role, group)
{
	if(mainPageTab !== "users")
	{
		return;
	}
	var users = list.users;
	var html = "<form id=\"userSearchForm\"><input type=\"text\" class=\"formText\" id=\"userSearchBox\" placeholder=\"Jméno uživatele\">";
	html += renderRoleSelector();
	html += renderGroupSelector();
	html += "<div class=\"button\" id=\"userSearchButton\"><i class=\"icon-search\"></i>Vyhledat</div>";
	if(searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000")
	{
		html += "<div class=\"button yellowButton\" id=\"userSearchCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	}
	html += "</form>";
	html += "<table class=\"userTable\"><th>Jméno</th><th>Role</th><th>Skupiny</th>";
	html += "</tr>";
	for(var j = 0; j < users.length; j++)
	{
		html += renderUserRow(users[j]);
	}
	html += "</table>";
	html += renderPagination(Math.ceil(list.count / perPage), page);
	document.getElementById("userList").innerHTML = html;

	document.getElementById("userSearchBox").value = searchName;
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("roleSearchFilter").value = role;
	}
	document.getElementById("groupSearchFilter").value = group;

	document.getElementById("userSearchForm").onsubmit = function()
		{
			var roleSel = document.getElementById("roleSearchFilter");
			var groupSel = document.getElementById("groupSearchFilter");
			var newRole = "all";
			if(roleSel)
			{
				newRole = roleSel.options[roleSel.selectedIndex].value;
			}
			downloadUserList(document.getElementById("userSearchBox").value, 1, perPage, newRole, groupSel.options[groupSel.selectedIndex].value);
			return false;
		}
	document.getElementById("userSearchButton").onclick = document.getElementById("userSearchForm").onsubmit;
	if(searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000")
		{
			document.getElementById("userSearchCancel").onclick = function()
				{
					downloadUserList(undefined, 1, perPage);
				};
		}
	var nodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = function(event)
			{
				var roleSel = document.getElementById("roleSearchFilter");
				var groupSel = document.getElementById("groupSearchFilter");
				var newRole = "all";
				if(roleSel)
				{
					newRole = roleSel.options[roleSel.selectedIndex].value;
				}
				downloadUserList(searchName, parseInt(event.target.dataset.page, 10), perPage, newRole, groupSel.options[groupSel.selectedIndex].value);
			};
	}

	addOnClicks("changeUserRole", changeUserRoleOnClick);
	addOnClicks("changeUserGroups", changeUserGroupsOnClick);
}

function renderRoleSelector()
{
	var html = "";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<select class=\"formSelect\" id=\"roleSearchFilter\">";
		html += "<option id=\"all\" value=\"all\" class=\"selectFilterSpecial\">Všechny role</option>";
		html += "<option id=\"user\" value=\"user\">Uživatel</option>";
		html += "<option id=\"editor\" value=\"editor\">Editor</option>";
		if(LOGINSTATE.role === "superuser")
		{
			html += "<option id=\"administrator\" value=\"administrator\">Administrátor</option>";
			html += "<option id=\"superuser\" value=\"superuser\">Superuser</option>";
		}
		html += "</select>";
	}
	return html;
}

function renderGroupSelector()
{
	var html = "<select class=\"formSelect\" id=\"groupSearchFilter\">";
	html += "<option id=\"00000000-0000-0000-0000-000000000000\" value=\"00000000-0000-0000-0000-000000000000\" class=\"selectFilterSpecial\">Všechny skupiny</option>";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id !== "00000000-0000-0000-0000-000000000000")
		{
			html += "<option id=\"" + GROUPS[i].id + "\" value=\"" + GROUPS[i].id + "\">" + GROUPS[i].name + "</option>";
		}
	}
	html += "</select>";
	return html;
}

function renderUserRow(user)
{
	var html = "<tr><td>" + user.name + "</td><td>";
	switch(user.role)
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
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<br><div class=\"button cyanButton changeUserRole\" data-id=\"" + user.id + "\" data-role=\"" + user.role + "\" data-name=\"" + user.name + "\"><i class=\"icon-pencil\"></i>Upravit</div><br>";
	}
	html += "</td><td>";
	var first = true;
	for(var j = 0; j < GROUPS.length; j++)
	{
		if(user.groups.indexOf(GROUPS[j].id) >= 0)
		{
			if(!first)
			{
				html += ", ";
			}
			html += GROUPS[j].name;
			first = false;
		}
	}
	if(user.groups.length > 0)
	{
		html += "<br>";
	}
	html += "<div class=\"button cyanButton changeUserGroups\" data-id=\"" + user.id + "\" data-groups='" + JSON.stringify(user.groups) + "' data-name=\"" + user.name + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
	html += "</td></tr>";
	return html;
}
