function lessonHistoryOpen(id, body, actionQueue)
{
	sidePanelDoubleOpen();
	var html = "<div id=\"lessonHistoryList\"><div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div><h3 class=\"sidePanelTitle\">Historie lekce</h3><div id=\"lessonHistoryForm\"><div id=\"embeddedSpinner\"></div></div></div><div id=\"lessonHistoryPreview\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, body, actionQueue, true);
		};

	request(APIURI + "/lesson/" + id + "/history", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				lessonHistoryListRender(id, response.response);
			}
			else if(response.type === "AuthenticationException")
			{
				dialog("Proběhlo automatické odhlášení. Přihlašte se a zkuste to znovu.");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});

	refreshLogin();
}

function parseVersionToDate(version)
{
	var d = new Date(version);
	return d.getDay() + ". " + d.getMonth() + ". " + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}

function lessonHistoryListRender(id, list)
{
	var html = "<form id=\"sidePanelForm\">";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" checked data-id=\"current\"><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryCurrent\">Současná verze</span> — " + parseVersionToDate(FIELDS[i].lessons[j].version) + "</div>";
				break outer;
			}
		}
	}
	for(var k = 0; k < list.length; k++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" data-id=\"current\"><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryVersion\">" + list[k].name + "</span> — " + parseVersionToDate(list[k].version) + "</div>";
	}
	html += "</form>";
	document.getElementById("lessonHistoryForm").innerHTML = html;
}
