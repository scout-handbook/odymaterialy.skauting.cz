var metadataEvent;
var FIELDS = [];
var COMPETENCES = [];
var LOGINSTATE = [];

function metadataSetup()
{
	refreshMetadata();
}

function refreshMetadata()
{
	metadataEvent = new AfterLoadEvent(3);
	request("/API/v0.9/lesson", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				FIELDS = response.response;
				metadataEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	request("/API/v0.9/competence", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				COMPETENCES = response.response;
				metadataEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
	request("/API/v0.9/account", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				LOGINSTATE = response.response;
				metadataEvent.trigger();
			}
			else if(response.status === 401)
			{
				window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + result.message, "OK");
			}
		});
}
