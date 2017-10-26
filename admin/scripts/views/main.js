var mainPageTab = "lessons";

function showMainView(noHistory)
{
	var html = "<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div>";
	html += "<div id=\"topBar\"><div id=\"userAccount\"><img id=\"userAvatar\" alt=\"Account avatar\" src=\"/avatar.png\">";
	html += "<div id=\"userName\">&nbsp;</div>";
	html += "<div id=\"logLink\"><a href=\"/API/v0.9/logout?redirect-uri=" + encodeURIComponent("https://odymaterialy.skauting.cz") + "\">Odhlásit</a><a href=\"/\" id=\"frontendLink\">Zpět na web</a></div></div>";
	html += "<div class=\"topBarTab\" id=\"lessonManager\">Lekce</div>";
	html += "<div class=\"topBarTab\" id=\"competenceManager\">Kompetence</div>";
	html += "<div class=\"topBarTab\" id=\"imageManager\">Obrázky</div>";
	html += "<div class=\"topBarTab\" id=\"userManager\">Uživatelé</div>";
	html += "</div>";
	html += "<div id=\"mainPageContainer\"><div id=\"mainPage\">";
	html += "<h1>OdyMateriály - ";
	if(mainPageTab == "competences")
	{
		html += "Kompetence";
	}
	else if(mainPageTab == "images")
	{
		html += "Obrázky";
	}
	else if(mainPageTab == "users")
	{
		html += "Uživatelé";
	}
	else
	{
		html += "Lekce";
	}
	html += "</h1><div id=\"embeddedSpinner\"></div></div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;
	metadataEvent.addCallback(function()
		{
			renderMainView(noHistory);
		});
}

function renderMainView(noHistory)
{
	if(LOGINSTATE.avatar)
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + LOGINSTATE.avatar;
	}
	document.getElementById("userName").innerHTML = LOGINSTATE.name;

	document.getElementById("lessonManager").onclick = function() {showLessonSubview()};
	document.getElementById("competenceManager").onclick = function() {showCompetenceSubview()};
	document.getElementById("imageManager").onclick = function() {showImageManager()};
	document.getElementById("userManager").onclick = function() {showUserManager()};

	if(mainPageTab == "competences")
	{
		showCompetenceSubview(noHistory);
	}
	else if(mainPageTab == "images")
	{
		showImageManager(noHistory);
	}
	else if(mainPageTab == "users")
	{
		showUserManager(noHistory);
	}
	else
	{
		showLessonSubview(noHistory);
	}
}
