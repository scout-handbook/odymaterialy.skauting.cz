"use strict";
/* exported restoreLesson */

function restoreLesson()
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"restoreLessonNext\"><i class=\"icon-fast-fw\"></i>Pokračovat</div>";
	html += "<h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<div id=\"restoreLessonList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel").innerHTML = html;
	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	request(CONFIG.apiuri + "/deleted-lesson", "GET", undefined, function(response)
		{
			restoreLessonRenderLessonList(response);
		}, reAuthHandler);

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}

function restoreLessonRenderLessonList(list)
{
	if(list.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Nejsou žádné smazané lekce.", "OK");
		refreshMetadata();
		history.back();
	}
	var html = "<form id=\"sidePanelForm\">";
	for(var i = 0; i < list.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"lesson\" data-id=\"" + list[i].id + "\"><span class=\"formCustom formRadio\"></span></label>" + list[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("restoreLessonList").innerHTML = html;
	document.getElementById("restoreLessonNext").onclick = restoreLessonSelectVersion;
}

function restoreLessonSelectVersion()
{
	var lessonId = parseBoolForm()[0];
	if(lessonId)
	{
		var html = "<div id=\"embeddedSpinner\"></div>";
		document.getElementById("restoreLessonList").innerHTML = html;
		request(CONFIG.apiuri + "/deleted-lesson/" + lessonId + "/history", "GET", undefined, function(response)
			{
				restoreLessonRenderVersionList(lessonId, response);
			}, reAuthHandler);
		document.getElementById("restoreLessonNext").onclick = function(){};
	}
}

function restoreLessonRenderVersionList(id, list)
{
	sidePanelDoubleOpen();
	var html = "<div id=\"restoreLessonVersionList\"><div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><span id=\"restoreLessonListHeader\"></span><h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<form id=\"sidePanelForm\">";
	for(var i = 0; i < list.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"restoreLessonversion\" data-name=\"" + list[i].name + "\" data-version=\"" + list[i].version + "\"><span class=\"formCustom formRadio\"></span></label><span class=\"restoreLessonVersion\">" + list[i].name + "</span> — " + parseVersion(list[i].version) + "</div>";
	}
	html += "</form>"
	html += "</div><div id=\"restoreLessonPreview\"></div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			sidePanelOpen();
			history.back();
		};
	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var j = 0; j < nodes.length; j++)
	{
		nodes[j].onchange = function(event) {restoreLessonShowVersion(id, event);};
	}
}

function restoreLessonShowVersion(id, event)
{
	var version = event.target.dataset.version;
	var name = event.target.dataset.name;
	document.getElementById("restoreLessonPreview").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/deleted-lesson/" + id + "/history/" + version, "GET", undefined, function(response)
		{
			restoreLessonRenderVersion(name, response);
		}, authFailHandler);
	document.getElementById("restoreLessonListHeader").innerHTML = "";

	refreshLogin();
}

function restoreLessonRenderVersion(name, body)
{
	refreshPreview(name, body, "restoreLessonPreview");
	var html = "<div class=\"button greenButton\" id=\"restoreLessonEdit\"><i class=\"icon-history\"></i>Obnovit</div>";
	document.getElementById("restoreLessonListHeader").innerHTML = html;
	document.getElementById("restoreLessonEdit").onclick = function()
		{
			sidePanelOpen();
			history.back();
			showLessonRestoreView(name, body);
		};
}
