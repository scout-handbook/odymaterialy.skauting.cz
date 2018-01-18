var metadataEvent = new AfterLoadEvent(2);

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
}
