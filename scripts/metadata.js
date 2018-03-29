"use strict";

var metadataEvent = new AfterLoadEvent(3);

function metadataSetup()
{
	cacheThenNetworkRequest(APIURI + "/lesson", "", function(response, second)
		{
			window.FIELDS = response;
			if(second)
			{
				metadataEvent.retrigger();
			}
			else
			{
				metadataEvent.trigger();
			}
		});
	cacheThenNetworkRequest(APIURI + "/competence", "", function(response, second)
		{
			window.COMPETENCES = response;
			if(second)
			{
				metadataEvent.retrigger();
			}
			else
			{
				metadataEvent.trigger();
			}
		});
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
		{
			if(this.readyState === 4)
			{
				var response = JSON.parse(this.responseText);
				if(response.status === 200)
				{
					window.LOGINSTATE = response.response;
				}
				else
				{
					window.LOGINSTATE = undefined;
				}
				metadataEvent.trigger();
			}
		}
	xhttp.open("GET", APIURI + "/account", true);
	xhttp.send();
}
