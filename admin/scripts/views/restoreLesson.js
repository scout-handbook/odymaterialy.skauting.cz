function showLessonRestoreView(name, body)
{
	var aq = new ActionQueue([new Action(APIURI + "/lesson", "POST", restoreLessonPayloadBuilder)])
	aq.actions[0].callback = function(response) {aq.fillID(response)}
	showLessonEditor(name, body, aq);

	history.pushState({}, "title", "/admin/lessons");
}

function restoreLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(editor.value())};
}
