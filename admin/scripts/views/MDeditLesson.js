var MDimageSelectorOpen = false;

function MDshowLessonEditView(id, noHistory)
{
	spinner();
	request("/API/v0.9/lesson/" + id, "GET", "", function(response)
		{
			if(response.status === 200)
			{
				metadataEvent.addCallback(function()
					{
						MDrenderLessonEditView(id, response.response, noHistory);
					});
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}

function MDrenderLessonEditView(id, markdown, noHistory)
{
	dismissSpinner();
	var lesson = getLessonById(id);
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	aq = new ActionQueue([new Action("/API/v0.9/lesson/" + encodeURIComponent(id) , "PUT", MDsaveLessonPayloadBuilder)]);
	MDshowLessonEditor(lesson.name, markdown, aq, id);
	document.getElementById("save").dataset.id = id;
}

function MDsaveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
}
