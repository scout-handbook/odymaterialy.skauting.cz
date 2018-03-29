"use strict";

var participantEvent;
var addEvent;
var groupEvent;

var participants;
var users;

function importGroupOnClick(event)
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"importGroupNext\"><i class=\"icon-fast-fw\"></i>Pokračovat</div>";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === getAttribute(event, "id"))
		{
			html += "<h3 class=\"sidePanelTitle\">Importovat ze SkautISu: " + GROUPS[i].name + "</h3>";
			break;
		}
	}
	html += "<div id=\"importList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel").innerHTML = html;
	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	request(APIURI + "/event", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				importGroupSelectEventRender(getAttribute(event, "id"), response.response);
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(APIURI + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups");
	refreshLogin();
}

function importGroupSelectEventRender(id, events)
{
	if(events.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Nejste instruktorem na žádné akci.", "OK");
		refreshMetadata();
		history.back();
	}
	var html = "<h4>Volba kurzu:</h4><form id=\"sidePanelForm\">";
	for(var i = 0; i < events.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\" data-id=\"" + events[i].id + "\"><span class=\"formCustom formRadio\"></span></label>" + events[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList").innerHTML = html;
	document.getElementById("importGroupNext").onclick = function() {importGroupSelectParticipants(id)};
}

function importGroupSelectParticipants(id)
{
	var eventId = parseBoolForm()[0];
	if(eventId)
	{
		var html = "<div id=\"embeddedSpinner\"></div>";
		document.getElementById("importList").innerHTML = html;
		participantEvent = new AfterLoadEvent(2);
		request(APIURI + "/event/" + eventId + "/participant", "GET", {}, function(response)
			{
				importGroupGetParticipantsCallback(id, response);
			});
		request(APIURI + "/user", "GET", {"page": 1, "per-page": 1000, "group": id}, function(response)
			{
				importGroupGetGroupCallback(id, response);
			});
		participantEvent.addCallback(importGroupSelectParticipantsRender);
		document.getElementById("importGroupNext").onclick = function() {};
	}
}

function importGroupSelectParticipantsRender(id)
{
	var newparticipants = setdiff(participants, users);
	if(newparticipants.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Akce nemá žádné účastníky (kteří ještě nebyli importováni).", "OK");
		refreshMetadata();
		history.back();
	}
	var html = "<h4>Výběr účastníků:</h4><form id=\"sidePanelForm\">";
	for(var i = 0; i < newparticipants.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\" data-id=\"" + newparticipants[i].id + "\" data-name=\"" + newparticipants[i].name + "\"><span class=\"formCustom formCheckbox\"></span></label>" + newparticipants[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList").innerHTML = html;
	document.getElementById("importGroupNext").innerHTML = "<i class=\"icon-floppy\"></i>Uložit";
	document.getElementById("importGroupNext").onclick = function() {importGroupSave(id)};
}

function importGroupSave(id)
{
	var participants = [];
	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var i = 0; i < nodes.length; i++)
	{
		if(nodes[i].checked)
		{
			participants.push({"id": nodes[i].dataset.id, "name": nodes[i].dataset.name})
		}
	}

	var html = "<div id=\"embeddedSpinner\"></div>";
	document.getElementById("importList").innerHTML = html;

	addEvent = new AfterLoadEvent(participants.length);
	for(var j = 0; j < participants.length; j++)
	{
		request(APIURI + "/user", "POST", participants[j], importAddUserCallback);
	}

	addEvent.addCallback(function()
		{
			groupEvent = new AfterLoadEvent(participants.length);
			for(var k = 0; k < participants.length; k++)
			{
				var payload = {"group": id};
				request(APIURI + "/user/" + participants[k].id + "/group", "PUT", payload, importUserGroupCallback);
			}

			groupEvent.addCallback(function()
				{
					sidePanelClose();
					spinner();
					dialog("Akce byla úspěšná.", "OK");
					refreshMetadata();
					history.back();
				});
		});

	sidePanelClose();
	spinner();
}

function setdiff(a, b)
{
	var bArr = b.map(x => x.id);
	var result = [];
	for(var j = 0; j < a.length; j++)
	{
		if(bArr.indexOf(a[j].id) < 0)
		{
			result.push(a[j]);
		}
	}
	return result;
}

function importGroupGetParticipantsCallback(id, response)
{
	if(response.status === 200)
	{
		participants = response.response;
		participantEvent.trigger(id);
	}
	else if(response.type === "AuthenticationException")
	{
		window.location.replace(APIURI + "/login");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
	}
}

function importGroupGetGroupCallback(id, response)
{
	if(response.status === 200)
	{
		users = response.response.users;
		participantEvent.trigger(id);
	}
	else if(response.type === "AuthenticationException")
	{
		window.location.replace(APIURI + "/login");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
	}
}

function importAddUserCallback(response)
{
	if(response.status === 200)
	{
		addEvent.trigger();
	}
	else if(response.type === "AuthenticationException")
	{
		dialog("Import nebylo možné dokončit z důvodu automatického odhlášení. Přihlašte se prosím a zkuste to znovu.", "OK");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
	}
}

function importUserGroupCallback(response)
{
	if(response.status === 200)
	{
		groupEvent.trigger();
	}
	else if(response.type === "AuthenticationException")
	{
		dialog("Import nebylo možné dokončit z důvodu automatického odhlášení. Přihlašte se prosím a zkuste to znovu.", "OK");
	}
	else
	{
		dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
	}
}
