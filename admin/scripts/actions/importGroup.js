var addEvent;
var groupEvent;

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
	request("/API/v0.9/event", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				importGroupSelectEventRender(getAttribute(event, "id"), response.response);
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
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
		request("/API/v0.9/event/" + eventId + "/participant", "GET", {}, function(response)
			{
				if(response.status === 200)
				{
					importGroupSelectParticipantsRender(id, response.response);
				}
				else if(response.type === "AuthenticationException")
				{
					window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
				}
				else
				{
					dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
				}
			});
		document.getElementById("importGroupNext").onclick = function() {};
	}
}

function importGroupSelectParticipantsRender(id, participants)
{
	if(participants.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Akce nemá žádné účastníky.", "OK");
		refreshMetadata();
		history.back();
	}
	var html = "<h4>Výběr účastníků:</h4><form id=\"sidePanelForm\">";
	for(var i = 0; i < participants.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\" data-id=\"" + participants[i].id + "\" data-name=\"" + participants[i].name + "\"><span class=\"formCustom formCheckbox\"></span></label>" + participants[i].name + "</div>";
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
		request("/API/v0.9/user", "POST", participants[j], importAddUserCallback);
	}

	addEvent.addCallback(function()
		{
			groupEvent = new AfterLoadEvent(participants.length);
			for(var k = 0; k < participants.length; k++)
			{
				var payload = {"group": id};
				request("/API/v0.9/user/" + participants[k].id + "/group", "PUT", payload, importUserGroupCallback);
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
