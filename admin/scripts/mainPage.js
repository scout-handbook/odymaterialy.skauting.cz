var lessonListEvent = new AfterLoadEvent(3);
var mainPageTab = "lessons";
var FIELDS = [];
var COMPETENCES = [];
var LOGINSTATE = [];

function mainPageSetup()
{
	lessonListSetup();
}

function lessonListSetup()
{
	request("/API/v0.9/lesson", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				FIELDS = response.response;
				lessonListEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	request("/API/v0.9/competence", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				COMPETENCES = response.response;
				lessonListEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	request("/API/v0.9/account", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				LOGINSTATE = response.response;
				lessonListEvent.trigger();
			}
			else if(response.status === 401)
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
}

function getMainPage(noHistory)
{
	var html = "<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div>";
	html += "<div id=\"topBar\"><div id=\"userAccount\"><img id=\"userAvatar\" alt=\"Account avatar\" src=\"/avatar.png\">";
	html += "<div id=\"userName\">&nbsp;</div>";
	html += "<div id=\"logLink\"><a href=\"/API/v0.9/logout?redirect-uri=" + encodeURIComponent("https://odymaterialy.skauting.cz") + "\">Odhlásit</a><a href=\"/\" id=\"frontendLink\">Zpět na web</a></div></div>";
	html += "<div class=\"topBarTab\" id=\"lessonManager\">Lekce</div>"
	html += "<div class=\"topBarTab\" id=\"competenceManager\">Kompetence</div>"
	html += "<div class=\"topBarTab\" id=\"imageManager\">Obrázky</div>"
	html += "<div class=\"topBarTab\" id=\"userManager\">Uživatelé</div>"
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
	lessonListEvent.addCallback(function()
		{
			showMainPage(noHistory);
		});
}

function showMainPage(noHistory)
{
	if(LOGINSTATE.avatar)
	{
		document.getElementById("userAvatar").src = "data:image/png;base64," + LOGINSTATE.avatar;
	}
	document.getElementById("userName").innerHTML = LOGINSTATE.name;

	document.getElementById("lessonManager").onclick = function() {showLessonManager()};
	document.getElementById("competenceManager").onclick = function() {showCompetenceManager()};
	document.getElementById("imageManager").onclick = function() {showImageManager()};
	document.getElementById("userManager").onclick = function() {showUserManager()};

	if(mainPageTab == "competences")
	{
		showCompetenceManager(noHistory);
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
		showLessonManager(noHistory);
	}
}

function addOnClicks(id, onclick)
{
	var nodes = document.getElementsByTagName("main")[0].getElementsByClassName(id);
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = onclick;
	}
}
