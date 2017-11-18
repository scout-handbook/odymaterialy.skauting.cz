function importGroupOnClick(event)
{
	sidePanelOpen();
	var html = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id == event.target.dataset.id)
		{
			html += "<h3 class=\"sidePanelTitle\">" + GROUPS[i].name + "</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"importGroupNext\" data-id=\"" + event.target.dataset.id + "\">Pokračovat</div>"; // TODO: Icon
			break;
		}
	}
	html += "<div id=\"importList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel").innerHTML = html;
	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("importGroupNext").onclick = importGroupSelectParticipants;
	request("/API/v0.9/event", "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				importGroupSelectEventRender(response.response);
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

function importGroupSelectEventRender(events)
{

	var html = "<form id=\"sidePanelForm\">";
	for(var i = 0; i < events.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\" data-id=\"" + events[i].id + "\"><span class=\"formCustom formRadio\"></span></label>" + events[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList").innerHTML = html;
}

function importGroupSelectParticipants(event)
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
					importGroupSelectParticipantsRender(response.response);
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
	}
	document.getElementById("importGroupNext").onclick = importGroupSave;
}

function importGroupSelectParticipantsRender(participants)
{
	var html = "<form id=\"sidePanelForm\">";
	for(var i = 0; i < participants.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\" data-id=\"" + participants[i].id + "\" data-name=\"" + participants[i].name + "\"><span class=\"formCustom formCheckbox\"></span></label>" + participants[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList").innerHTML = html;
}

function importGroupSave(event)
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

	var addEvent = new AfterLoadEvent(participants.length);
	for(var j = 0; j < participants.length; j++)
	{
		request("/API/v0.9/user", "POST", participants[j], function(response)
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
			});
	}

	addEvent.addCallback(function()
		{
			var groupEvent = new AfterLoadEvent(participants.length);
			for(var k = 0; k < participants.length; k++)
			{
				var payload = {"group": event.target.dataset.id};
				request("/API/v0.9/user/" + participants[k].id + "/group", "PUT", payload, function(response)
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
					});
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
