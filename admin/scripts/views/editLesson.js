var changed;
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
	changed = false;
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

	showLessonEditor(lesson.name, markdown, saveLessonCallback);
	document.getElementById("save").dataset.id = id;
}

function saveLessonCallback()
{
	if(changed)
	{
		var payload = {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
		spinner();
		retryAction("/API/v0.9/lesson/" + encodeURIComponent(document.getElementById("save").dataset.id), "PUT", payload);
	}
	else
	{
		discard();
	}
}
