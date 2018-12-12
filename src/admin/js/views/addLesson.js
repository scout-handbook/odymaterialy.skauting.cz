"use strict";
/* exported addLessonInFieldOnClick */

function showLessonAddView(field)
{
	history.pushState({}, "title", "/admin/lessons");

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson", "POST", addLessonPayloadBuilder)])
	if(field)
	{
		aq.actions.push(new Action(CONFIG.apiuri + "/lesson/{id}/field", "PUT", function() {return {"field": encodeURIComponent(field)};}))
	}
	aq.actions[0].callback = function(response) {aq.fillID(response)}
	showLessonEditor(defaultName, defaultBody, aq);
}

function addLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(editor.value())};
}

function addLessonInFieldOnClick(event)
{
	showLessonAddView(getAttribute(event, "id"));
}
