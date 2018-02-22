var imageSelectorOpen = false;

function showLessonEditView(id, noHistory)
{
	spinner();
	request(APIURI + "/lesson/" + id, "GET", "", function(response)
		{
			if(response.status === 200)
			{
				metadataEvent.addCallback(function()
					{
						renderLessonEditView(id, response.response, noHistory);
					});
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(APIURI + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}

function renderLessonEditView(id, markdown, noHistory)
{
	dismissSpinner();
	var lesson = getLessonById(id);
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	aq = new ActionQueue([new Action(APIURI + "/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder)]);
	showLessonEditor(lesson.name, markdown, aq, id);
	document.getElementById("save").dataset.id = id;
}

function saveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(editor.value())};
}
