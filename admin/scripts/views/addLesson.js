function showLessonAddView(field)
{
	history.pushState({}, "title", "/admin/lessons");

	aq = new ActionQueue([new Action("/API/v0.9/lesson", "POST", addLessonPayloadBuilder)])
	if(field)
	{
		aq.actions.push(new Action("/API/v0.9/lesson/{id}/field", "PUT", function() {return {"field": encodeURIComponent(field)};}))
		aq.actions[0].callback = function(response) {aq.fillID(response)}
	}
	aq.addDefaultCallback();
	showLessonEditor(defaultName, defaultBody, aq);
}

function addLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(ace.edit("editor").getValue())};
}

function addLessonInFieldOnClick(event)
{
	showLessonAddView(event.target.dataset.id);
}
