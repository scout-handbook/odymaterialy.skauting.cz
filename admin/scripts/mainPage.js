var lessonListEvent = new AfterLoadEvent(2);
var FIELDS = [];
var COMPETENCES = [];
var sidePanelOpen = false;

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
	var html = "<div id=\"sidePanel\">Lorem ipsum.</div><div id=\"mainPageContainer\"><div id=\"mainPage\">";
	html += "<h1>OdyMateriály - administrace</h1>";
	html += "<div class=\"button\" id=\"addLesson\">Nová lekce</div><br>";
	html += renderLessonList();
	html += "</div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	
	document.getElementById("addLesson").onclick = function()
		{
			addLesson();
		};
	nodes = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].firstChild.onclick = itemOnClick;
	}
	nodes = document.getElementsByTagName("main")[0].getElementsByClassName("changeField");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = changeFieldOnClick;
	}


	document.getElementsByTagName("main")[0].scrollTop = 0;
	var stateObject = { lessonName: "" };
	if(!noHistory)
	{
		history.pushState(stateObject, "title", "/admin/");
	}
}

function itemOnClick(event)
{
	getLesson(event.target.dataset.id);
	return false;
}

function changeFieldOnClick(event)
{
	sidePanelOpen = !sidePanelOpen;
	reflowSidePanel();

	var html = "<form>"
	var name = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var checked = false;
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == event.target.dataset.id)
			{
				checked = true;
				break;
			}
		}
		if(FIELDS[i].id)
		{
			name = FIELDS[i].name;
		}
		else
		{
			name = "<i>Nezařazeno</i>"
		}
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\"";
		if(checked)
		{
			html += " checked";
		}
		html += "><span class=\"formRadio\"></span></label>" + name + "</div>";
	}
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;
}

function renderLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].name)
		{
			html += "<h2 class=\"mainPage\">" + FIELDS[i].name + "</h2>";
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage secondLevel\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
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
					html += "<span class=\"mainPage secondLevel\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span><br>";
				}
				html += "<div class=\"button mainPage secondLevel changeField\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit oblast</div>";
			}
		}
		else
		{
			for(var j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<h3 class=\"mainPage\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
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
					html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
					for(var m = 1; m < competences.length; m++)
					{
						html += ", " + competences[m].number;
					}
					html += "</span><br>";
				}
				html += "<div class=\"button changeField\" data-id=\"" + FIELDS[i].lessons[j].id + "\">Změnit oblast</div>";
			}
		}
	}
	return html;
}

function reflowSidePanel()
{
	var sidePanel = document.getElementById("sidePanel");
	if(sidePanelOpen)
	{
		sidePanel.style.right = "0";
	}
	else
	{
		sidePanel.style.right = "-431px";
	}
}
