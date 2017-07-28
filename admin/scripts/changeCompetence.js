var competenceChanged = false;

function changeCompetenceOnClick(event)
{
	competenceChanged = false;
	sidePanelOpen();
	var html = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id == event.target.dataset.id)
		{
			html += "<h3 class=\"sidePanelTitle\">Kompetence " + COMPETENCES[i].number + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"changeCompetenceSave\" data-id=\"" + COMPETENCES[i].id + "\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
			html += "<span class=\"heading\">Kompetence</span> <input type=\"text\" class=\"formText formName\" id=\"competenceNumber\" value=\"" + COMPETENCES[i].number + "\" autocomplete=\"off\"><br>";
			html += "<input type=\"text\" class=\"formText\" id=\"competenceName\" value=\"" + COMPETENCES[i].name + "\" autocomplete=\"off\"><br>";
			html += "<textarea rows=\"5\" class=\"formText\" id=\"competenceDescription\" autocomplete=\"off\">" + COMPETENCES[i].description + "</textarea>";
			break;
		}
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("changeCompetenceSave").onclick = changeCompetenceSave;

	function addOnChange(id)
	{
		document.getElementById(id).oninput = function()
			{
				competenceChanged = true;
			};
		document.getElementById(id).onchange = function()
			{
				competenceChanged = true;
			};
	}
	addOnChange("competenceNumber");
	addOnChange("competenceName");
	addOnChange("competenceDescription");

	history.pushState({"sidePanel": "open"}, "title", "/admin/");
}

function changeCompetenceSave()
{
	if(competenceChanged)
	{
		var query = "id=" + document.getElementById("changeCompetenceSave").dataset.id;
		query += "&number=" + document.getElementById("competenceNumber").value;
		query += "&name=" + document.getElementById("competenceName").value;
		query += "&description=" + document.getElementById("competenceDescription").value;
		sidePanelClose();
		retryAction("/API/v0.9/update_competence", query);
	}
}
