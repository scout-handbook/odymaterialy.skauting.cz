function showLessonAddView(noHistory)
{
	if(!noHistory)
	{
		history.pushState({}, "title", "/admin/lessons");
	}

	showLessonEditor(defaultName, defaultBody, addLessonCallback);
}

function addLessonCallback()
{
	var payload = {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
	spinner();
	retryAction("/API/v0.9/lesson", "POST", payload);
}
