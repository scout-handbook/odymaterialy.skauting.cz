var lessonListEvent = new AfterLoadEvent(3);
var mainPageTab = "lessons";
var FIELDS = [];
var COMPETENCES = [];
var LOGINSTATE = [];

function mainPageSetup()
{
	getMainPage();
	lessonListSetup();
}

function lessonListSetup()
{
	request("/API/v0.9/list_lessons", "", function(response)
		{
			FIELDS = JSON.parse(response);
			lessonListEvent.trigger();
		});
	request("/API/v0.9/list_competences", "", function(response)
		{
			COMPETENCES = JSON.parse(response);
			lessonListEvent.trigger();
		});
	request("/API/v0.9/get_login_state", "", function(response)
		{
			LOGINSTATE = JSON.parse(response);
			lessonListEvent.trigger();
		});
}

function getMainPage(noHistory)
{
	lessonListEvent.addCallback(function()
		{
			showMainPage(noHistory);
		});
}

function showMainPage(noHistory)
{
	var html = "<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div>";
	html += "<div id=\"topBar\"><div id=\"userAccount\"><img id=\"userAvatar\" alt=\"Account avatar\" src=\"";
	if(LOGINSTATE.user_avatar)
	{
		html += "data:image/png;base64," + LOGINSTATE.user_avatar;
	}
	else
	{
		html += "/avatar.png";
	}
	html += "\"><div id=\"userName\">";
	html += LOGINSTATE.user_name;
	html += "</div><div id=\"logLink\"><a href=\"/auth/logout.php\">Odhlásit</a></div></div>";
	html += "<div class=\"topBarTab\" id=\"lessonManager\">Lekce</div>"
	html += "<div class=\"topBarTab\" id=\"competenceManager\">Kompetence</div>"
	html += "<div class=\"topBarTab\" id=\"imageManager\">Obrázky</div>"
	html += "<div class=\"topBarTab\" id=\"userManager\">Uživatelé</div>"
	html += "</div>";
	html += "<div id=\"mainPageContainer\"><div id=\"mainPage\"></div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;

	document.getElementById("lessonManager").onclick = showLessonManager;
	document.getElementById("competenceManager").onclick = showCompetenceManager;
	document.getElementById("imageManager").onclick = showImageManager;
	document.getElementById("userManager").onclick = showUserManager;

	if(mainPageTab == "competences")
	{
		showCompetenceManager();
	}
	else if(mainPageTab == "images")
	{
		showImageManager();
	}
	else if(mainPageTab == "users")
	{
		showUserManager();
	}
	else
	{
		showLessonManager();
	}

	if(!noHistory)
	{
		history.pushState({"lessonName": ""}, "title", "/admin/");
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
