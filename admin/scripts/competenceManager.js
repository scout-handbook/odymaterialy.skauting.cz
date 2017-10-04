function showCompetenceManager(noHistory)
{
	mainPageTab = "competences";
	var nodes = document.getElementsByClassName("topBarTab");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].className = "topBarTab";
	}
	document.getElementById("competenceManager").className += " activeTopBarTab";
	var html = "<h1>OdyMateriály - Kompetence</h1>";
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		html += "<div class=\"button mainPage\" id=\"addCompetence\">Přidat kompetenci</div>";
	}
	html += renderCompetenceList()
	document.getElementById("mainPage").innerHTML = html;

	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		document.getElementById("addCompetence").onclick = addCompetence;
	}

	addOnClicks("changeCompetence", changeCompetenceOnClick);
	addOnClicks("deleteCompetence", deleteCompetenceOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "competences"}, "title", "/admin/competences");
	}
}

function renderCompetenceList()
{
	var html = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<h3 class = \"mainPage\">" + COMPETENCES[i].number + ": " + COMPETENCES[i].name + "</h3><span class=\"mainPage\">" + COMPETENCES[i].description + "</span><br>";
		if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
		{
			html += "<div class=\"button mainPage changeCompetence\" data-id=\"" + COMPETENCES[i].id + "\">Upravit kompetenci</div>";
			html += "<div class=\"button mainPage deleteCompetence\" data-id=\"" + COMPETENCES[i].id + "\">Smazat kompetenci</div>";
		}
	}
	return html;
}
