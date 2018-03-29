"use strict";

var metadataEvent;
var FIELDS = [];
var COMPETENCES = [];
var GROUPS = []
var LOGINSTATE = [];

function metadataSetup()
{
	configEvent.addCallback(refreshMetadata);
}

function refreshMetadata()
{
	metadataEvent = new AfterLoadEvent(4);
	request(CONFIG.apiuri + "/lesson?override-group=true", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				FIELDS = response.response;
				metadataEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
	request(CONFIG.apiuri + "/competence", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				COMPETENCES = response.response;
				metadataEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
	request(CONFIG.apiuri + "/group", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				GROUPS = response.response;
				metadataEvent.trigger();
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location));
			}
			else if(response.type === "RoleException")
			{
				window.location.replace(CONFIG.baseuri);
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
	request(CONFIG.apiuri + "/account", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				if(["editor", "administrator", "superuser"].indexOf(response.response.role) > -1)
				{
					LOGINSTATE = response.response;
					metadataEvent.trigger();
				}
				else
				{
					window.location.replace(CONFIG.baseuri);
				}
			}
			else if(response.status === 401)
			{
				window.location.replace(CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location));
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}
