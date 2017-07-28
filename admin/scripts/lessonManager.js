function showLessonManager()
{
	var html = "<h1>OdyMateriály - Správce lekcí</h1>";
	html += "<div class=\"button mainPage\" id=\"competenceManager\">Správce kompetencí</div>";
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		html += "<div class=\"button mainPage\" id=\"addField\">Přidat oblast</div>";
	}
	html += "<div class=\"button mainPage\" id=\"addLesson\">Přidat lekci</div><br>";
	html += renderLessonList();
	document.getElementById("mainPage").innerHTML = html;

	document.getElementById("competenceManager").onclick = showCompetenceManager;
	if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
	{
		document.getElementById("addField").onclick = addField;
	}
	document.getElementById("addLesson").onclick = addLesson;

	addOnClicks("changeField", changeFieldOnClick);
	addOnClicks("deleteField", deleteFieldOnClick);
	addOnClicks("changeLesson", changeLessonOnClick);
	addOnClicks("changeLessonField", changeLessonFieldOnClick);
	addOnClicks("changeLessonCompetences", changeLessonCompetencesOnClick);
	addOnClicks("deleteLesson", deleteLessonOnClick);
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var secondLevel = "";
		if(FIELDS[i].name)
		{
			secondLevel = " secondLevel";
			html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
			{
				html += "<div class=\"button mainPage changeField\" data-id=\"" + FIELDS[i].id + "\">Upravit oblast</div>";
				html += "<div class=\"button mainPage deleteField\" data-id=\"" + FIELDS[i].id + "\">Smazat oblast</div>";
			}
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += "<h3 class=\"mainPage" + secondLevel + "\">" + FIELDS[i].lessons[j].name + "</h3>";
			if(FIELDS[i].lessons[j].competences.length > 0)
			{
				var competences = [];
				for(var k = 0; k < COMPETENCES.length; k++)
				{
					if(FIELDS[i].lessons[j].competences.indexOf(COMPETENCES[k].id) >= 0)
					{
						competences.push(COMPETENCES[k]);
					}
				}
				html += "<span class=\"mainPage" + secondLevel + "\">Kompetence: " + competences[0].number;
				for(var m = 1; m < competences.length; m++)
				{
					html += ", " + competences[m].number;
				}
				html += "</span><br>";
			}
			html += "<div class=\"button mainPage" + secondLevel + " changeLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Upravit lekci</div>";
			html += "<div class=\"button mainPage changeLessonField\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit oblast</div>";
			html += "<div class=\"button mainPage changeLessonCompetences\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit kompetence</div>";
			if(LOGINSTATE.role == "administrator" || LOGINSTATE.role == "superuser")
			{
				html += "<div class=\"button mainPage deleteLesson\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Smazat lekci</div>";
			}
		}
	}
	return html;
}
