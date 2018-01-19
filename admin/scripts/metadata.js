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
	request(APIURI + "/lesson?override-group=true", "GET", "", function(response)
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
	request(APIURI + "/competence", "GET", "", function(response)
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
	request(APIURI + "/group", "GET", "", function(response)
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
	request(APIURI + "/account", "GET", "", function(response)
		{
			if(response.status === 200)
			{
				LOGINSTATE = response.response;
				metadataEvent.trigger();
			}
			else if(response.status === 401)
			{
				window.location.replace(APIURI + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}
