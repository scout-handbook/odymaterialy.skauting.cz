var imageSelectorOpen = false;

function showLessonEditView(id, noHistory)
{
	spinner();
	request("/API/v0.9/lesson/" + id, "GET", "", function(response)
		{
			if(response.status === 200)
			{
				metadataEvent.addCallback(function()
					{
						renderLessonEditView(id, response.response, noHistory);
					});
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
	var lesson = {};
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id == id)
			{
				lesson = FIELDS[i].lessons[j];
				break outer;
			}
		}
	}

	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	aq = new ActionQueue([new Action("/API/v0.9/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder)]);
	showLessonEditor(lesson.name, markdown, aq, id);
	document.getElementById("save").dataset.id = id;
}

function saveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
}
