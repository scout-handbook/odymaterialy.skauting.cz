function showCompetenceSubview(noHistory)
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
		html += "<div class=\"newButton greenButton\" id=\"addCompetence\"><i class=\"icon-plus\"></i>Přidat</div><br>";
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
	refreshLogin(true);
}

function renderCompetenceList()
{
	var html = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<h3 class = \"mainPage\">" + COMPETENCES[i].number + ": " + COMPETENCES[i].name + "</h3><br>";
		if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
		{
			html += "<div class=\"newButton cyanButton changeCompetence\" data-id=\"" + COMPETENCES[i].id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
			html += "<div class=\"newButton redButton deleteCompetence\" data-id=\"" + COMPETENCES[i].id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div><br>";
		}
		html += "<span class=\"mainPage competenceDescription\">" + COMPETENCES[i].description + "</span><br>";
	}
	return html;
}
