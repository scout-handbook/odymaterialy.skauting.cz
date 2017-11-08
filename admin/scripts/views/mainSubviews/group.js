function showGroupSubview(noHistory)
{
	mainPageTab = "groups";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("groupManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Uživatelské skupiny</h1>";
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		html += "<div class=\"button mainPage\" id=\"addGroup\">Přidat skupinu</div>";
	}
	html += renderGroupList()
	document.getElementById("mainPage").innerHTML = html;

	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		document.getElementById("addGroup").onclick = addGroup;
	}

	addOnClicks("changeGroup", changeGroupOnClick);
	addOnClicks("deleteGroup", deleteGroupOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "groups"}, "title", "/admin/groups");
	}
	refreshLogin(true);
}

function renderGroupList()
{
	var html = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == "00000000-0000-0000-0000-000000000000")
		{
			html += "<h3 class = \"mainPage publicGroup\">" + GROUPS[i].name + "</h3>";
		}
		else
		{
			html += "<h3 class = \"mainPage\">" + GROUPS[i].name + "</h3><span class=\"mainPage\">Uživatelů: " + GROUPS[i].count + "</span><br>";
		}
		if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
		{
			html += "<div class=\"button mainPage changeGroup\" data-id=\"" + GROUPS[i].id + "\">Upravit skupinu</div>";
			if(GROUPS[i].id != "00000000-0000-0000-0000-000000000000")
			{
				html += "<div class=\"button mainPage deleteGroup\" data-id=\"" + GROUPS[i].id + "\">Smazat skupinu</div>";
			}
		}
	}
	return html;
}
