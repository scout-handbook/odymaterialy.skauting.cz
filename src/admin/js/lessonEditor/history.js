"use strict";
/* exported lessonHistoryOpen */

function lessonHistoryOpen(id, actionQueue)
{
	sidePanelDoubleOpen();
	var html = "<div id=\"lessonHistoryList\"><div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div><span id=\"lessonHistoryListHeader\"></span><h3 class=\"sidePanelTitle\">Historie lekce</h3><div id=\"lessonHistoryForm\"><div id=\"embeddedSpinner\"></div></div></div><div id=\"lessonHistoryPreview\"></div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};

	request(CONFIG.apiuri + "/lesson/" + id + "/history", "GET", undefined, function(response)
		{
			lessonHistoryListRender(id, actionQueue, response);
		}, authFailHandler);
	lessonHistoryPreviewShowCurrent();
}

function lessonHistoryListRender(id, actionQueue, list)
{
	var html = "<form id=\"sidePanelForm\">";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" checked><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryCurrent\">Současná verze</span> — " + parseVersion(FIELDS[i].lessons[j].version) + "</div>";
				break outer;
			}
		}
	}
	for(var k = 0; k < list.length; k++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" data-name=\"" + list[k].name + "\" data-version=\"" + list[k].version + "\"><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryVersion\">" + list[k].name + "</span> — " + parseVersion(list[k].version) + "</div>";
	}
	html += "</form>";
	document.getElementById("lessonHistoryForm").innerHTML = html;

	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	nodes[0].onchange = function() {lessonHistoryPreviewShowCurrent();};
	if(nodes.length > 1)
	{
		for(var l = 1; l < nodes.length; l++)
		{
			nodes[l].onchange = function(event) {lessonHistoryPreviewShowVersion(id, actionQueue, event);};
		}
	}
}

function lessonHistoryPreviewShowCurrent()
{
	document.getElementById("lessonHistoryPreview").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	refreshPreview(document.getElementById("name").value, editor.value(), "lessonHistoryPreview");

	document.getElementById("lessonHistoryListHeader").innerHTML = "";

	refreshLogin();
}

function lessonHistoryPreviewShowVersion(id, actionQueue, event)
{
	document.getElementById("lessonHistoryPreview").innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/lesson/" + id + "/history/" + event.target.dataset.version, "GET", undefined, function(response)
		{
			lessonHistoryPreviewRenderVersion(id, event.target.dataset.name, response, actionQueue);
		}, authFailHandler);

	document.getElementById("lessonHistoryListHeader").innerHTML = "";

	refreshLogin();
}

function lessonHistoryPreviewRenderVersion(id, name, body, actionQueue)
{
	refreshPreview(name, body, "lessonHistoryPreview");
	var html = "<div class=\"button greenButton\" id=\"lessonHistoryRevert\"><i class=\"icon-history\"></i>Obnovit</div>";
	document.getElementById("lessonHistoryListHeader").innerHTML = html;

	document.getElementById("lessonHistoryRevert").onclick = function()
		{
			document.getElementById("name").value = name;
			editor.value(body);
			lessonSettings(id, body, actionQueue, true);
		};
}
