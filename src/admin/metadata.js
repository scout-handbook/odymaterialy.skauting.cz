"use strict";
/* global FIELDS:true, COMPETENCES:true, GROUPS:true, LOGINSTATE:true, metadataEvent:true */
/* exported FIELDS, COMPETENCES, GROUPS, LOGINSTATE, metadataSetup */

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
	request(CONFIG.apiuri + "/lesson?override-group=true", "GET", undefined, function(response)
		{
			FIELDS = response;
			metadataEvent.trigger();
		});
	request(CONFIG.apiuri + "/competence", "GET", undefined, function(response)
		{
			COMPETENCES = response;
			metadataEvent.trigger();
		});
	var groupExceptionHandler = {"AuthenticationException": function()
		{
			window.location.replace(CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location));
		}, "RoleException": function()
		{
			window.location.replace(CONFIG.baseuri);
		}};
	request(CONFIG.apiuri + "/group", "GET", undefined, function(response)
		{
			GROUPS = response;
			metadataEvent.trigger();
		}, groupExceptionHandler);
	rawRequest(CONFIG.apiuri + "/account", "GET", undefined, function(response)
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
