function getCompetence(id, noHistory)
{
	if(screen.width < 700)
	{
		navOpen = false;
		reflow();
	}
	lessonListEvent.addCallback(function()
		{
			showCompetence(id, noHistory);
		});
}

function showCompetence(id, noHistory)
{
	var competence = {};
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id == id)
		{
			competence = COMPETENCES[i];
			break;
		}
	}
	var html = "<h1>" + competence.name + "</h1>";
	document.getElementById("content").innerHTML = html;

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/competence/" + id + "/" + urlEscape(competence.number));
	}
	document.getElementById("offlineSwitch").style.display = "none";
}
