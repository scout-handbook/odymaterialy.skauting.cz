function addCompetence()
{
	sidePanelOpen();
	var html = "<h3 class=\"sidePanelTitle\">Nová kompetence</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"addCompetenceSave\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	html += "<span class=\"heading\">Kompetence</span> <input type=\"text\" class=\"formText formName\" id=\"competenceNumber\" value=\"00\" autocomplete=\"off\"><br>";
	html += "<input type=\"text\" class=\"formText\" id=\"competenceName\" value=\"Nová kompetence\" autocomplete=\"off\"><br>";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"competenceDescription\" autocomplete=\"off\">Popis nové kompetence</textarea>";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addCompetenceSave").onclick = addCompetenceSave;

	history.pushState({"sidePanel": "open"}, "title", "/admin/");
}

function addCompetenceSave()
{
	var payload = {"number": encodeURIComponent(document.getElementById("competenceNumber").value), "name": encodeURIComponent(document.getElementById("competenceName").value), "description": encodeURIComponent(document.getElementById("competenceDescription").value)};
	sidePanelClose();
	retryAction("/API/v0.9/add_competence", payload);
}
