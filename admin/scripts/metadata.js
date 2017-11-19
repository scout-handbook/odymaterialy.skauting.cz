var metadataEvent;
var FIELDS = [];
var COMPETENCES = [];
var GROUPS = []
var LOGINSTATE = [];

function metadataSetup()
{
	refreshMetadata();
}

function refreshMetadata()
{
	metadataEvent = new AfterLoadEvent(4);
	request("/API/v0.9/lesson?override-group=true", "GET", "", function(response)
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
	request("/API/v0.9/competence", "GET", "", function(response)
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
	request("/API/v0.9/group", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				GROUPS = response.response;
				metadataEvent.trigger();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
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
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}
