var metadataEvent = new AfterLoadEvent(2);

function metadataSetup()
{
	cacheThenNetworkRequest("/API/v0.9/lesson", "", function(response, second)
		{
			FIELDS = response;
			if(!second)
			{
				metadataEvent.trigger();
			}
		});
	cacheThenNetworkRequest("/API/v0.9/competence", "", function(response, second)
		{
			COMPETENCES = response;
			if(!second)
			{
				metadataEvent.trigger();
			}
		});
}
