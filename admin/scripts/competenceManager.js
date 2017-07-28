function showCompetenceManager()
{
	var html = "<h1>OdyMateriály - Správce kompetencí</h1>";
	html += "<div class=\"button mainPage\" id=\"lessonManager\">Správce lekcí</div>";
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		html += "<div class=\"button mainPage\" id=\"addCompetence\">Přidat kompetenci</div>";
	}
	html += renderCompetenceList()
	document.getElementById("mainPage").innerHTML = html;

	document.getElementById("lessonManager").onclick = showLessonManager;
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		document.getElementById("addCompetence").onclick = addCompetence;
	}

	addOnClicks("changeCompetence", changeCompetenceOnClick);
	addOnClicks("deleteCompetence", deleteCompetenceOnClick);
}

function renderCompetenceList()
{
	var html = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<h3 class = \"mainPage\"><i>" + COMPETENCES[i].number + ":</i> " + COMPETENCES[i].name + "</h3><span class=\"mainPage\">" + COMPETENCES[i].description + "</span><br>";
		if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
		{
			html += "<div class=\"button mainPage changeCompetence\" data-id=\"" + COMPETENCES[i].id + "\">Upravit kompetenci</div>";
			html += "<div class=\"button mainPage deleteCompetence\" data-id=\"" + COMPETENCES[i].id + "\">Smazat kompetenci</div>";
		}
	}
	return html;
}
