"use strict";

var CONFIG;
var FIELDS;
var COMPETENCES;
var LOGINSTATE;

function main()
{
	var configRequest = new XMLHttpRequest();
	configRequest.overrideMimeType("application/json");
	configRequest.open('GET', '/client-config.json', false);
	configRequest.onreadystatechange = function ()
		{
			if(this.readyState === 4 && this.status === 200)
			{
				CONFIG = JSON.parse(this.responseText);
			}
		};
	configRequest.send();

	navigationSetup();
	headerSetup();
	historySetup();
	authenticationSetup();
	metadataSetup();
	lessonViewSetup();
	TOCSetup();
	if("serviceWorker" in navigator)
	{
		navigator.serviceWorker.register("/serviceworker.js");
	}
	WebFont.load({
		google: {
			families: ["Open Sans:400,400i,700,700i"]
		}
	});
}

window.onload = main;
