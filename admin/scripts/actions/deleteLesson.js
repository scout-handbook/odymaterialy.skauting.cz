"use strict";

function deleteLessonOnClick(event)
{
	var id = getAttribute(event, "id");
	spinner();
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", undefined, function(response)
		{
			if(response.status === 201)
			{
				deleteLessonDialog(id);
			}
			else if(response.status === 409)
			{
				dialog("Nelze smazat lekci, protože ji právě upravuje " + response.response.holder + ".", "OK");
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(CONFIG.apiuri + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}
function deleteLessonDialog(id)
{
	var name = "";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				name = FIELDS[i].lessons[j].name
				break outer;
			}
		}
	}

	var saveExceptionHandler = {"NotLockedException": function(){dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	var discardExceptionHandler = {"NotFoundException": function(){}};
	var saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "DELETE", undefined, undefined, saveExceptionHandler)]);
	var discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", undefined, undefined, discardExceptionHandler)]);
	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", saveActionQueue.closeDispatch, "Ne", function()
		{
			discardActionQueue.dispatch(true);
			history.back();
		});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
