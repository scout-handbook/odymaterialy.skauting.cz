var metadataEvent = new AfterLoadEvent(3);

function metadataSetup()
{
	cacheThenNetworkRequest(APIURI + "/lesson", "", function(response, second)
		{
			FIELDS = response;
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
			COMPETENCES = response;
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
				response = JSON.parse(this.responseText);
				if(response.status === 200)
				{
					LOGINSTATE = response.response;
				}
				else
				{
					LOGINSTATE = undefined;
				}
				metadataEvent.trigger();
			}
		}
	xhttp.open("GET", APIURI + "/account", true);
	xhttp.send();
}
