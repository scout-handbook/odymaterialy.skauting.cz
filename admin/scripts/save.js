var resave = false;

function saveSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("id"))
	{
		save(sessionStorage.getItem("id"), sessionStorage.getItem("name"), JSON.parse(sessionStorage.getItem("competences")), sessionStorage.getItem("body"));
		sessionStorage.clear();
		resave = true;
	}
}

function save(id, name, competences, body)
{
	var competenceQuery = "";
	for(i = 0; i < competences.length; i++)
	{
		competenceQuery += "&competence[]=" + competences[i];
	}
	if(competenceQuery === "")
	{
		competenceQuery = "&competence[]=";
	}
	var query = "id=" + id + "&name=" + name + competenceQuery + "&body=" + encodeURIComponent(body);
	POSTrequest("/API/change_lesson", query, afterSave);
}

function afterSave(response)
{
	var success = JSON.parse(response).success;
	if(success)
	{
		dialog("Úspěšně uloženo.", "OK", function()
			{
				if(resave)
				{
					window.location.reload();
				}
			});
		history.back();
	}
	else
	{
		if(!resave && window.sessionStorage)
		{
			sessionStorage.setItem("id", document.getElementById("save").dataset.id);
			sessionStorage.setItem("name", document.getElementById("name").value);
			sessionStorage.setItem("competences", JSON.stringify(parseCompetences()));
			sessionStorage.setItem("body", ace.edit("editor").getValue());
			window.location.replace("https://odymaterialy.skauting.cz/auth/login.php");
		}
		else
		{
			dialog("Byl jste odhlášen a uložení se tedy nezdařilo. Přihlaste se prosím a zkuste to znovu.", "OK");
		}
	}
}
