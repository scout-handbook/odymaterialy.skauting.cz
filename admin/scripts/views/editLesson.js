"use strict";

var imageSelectorOpen = false;

function showLessonEditView(id, noHistory)
{
	spinner();
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", {}, function(response)
		{
			if(response.status === 201)
			{
				getLessonEditView(id, noHistory);
			}
			else if(response.status === 409)
			{
				dialog("Nelze upravovat lekci, protože ji právě upravuje " + response.holder + ".", "OK");
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

function getLessonEditView(id, noHistory)
{
	request(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "GET", {}, function(response)
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
				window.location.replace(CONFIG.apiuri + "/login");
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

	var saveExceptionHandler = {"NotLockedException": function(){dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	var discardExceptionHandler = {"NotFoundException": function(){}};

	var saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder, function(){}, saveExceptionHandler)]);
	var discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", function(){}, function(){}, discardExceptionHandler)]);
	showLessonEditor(lesson.name, markdown, saveActionQueue, id, discardActionQueue, function() {lessonEditMutexExtend(id);});
	document.getElementById("save").dataset.id = id;
}

function saveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(editor.value())};
}

function lessonEditMutexExtend(id)
{
	var exceptionHandler = {"NotFoundException": function(){}};
	var actionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "PUT", undefined, function(){}, exceptionHandler)]);
	actionQueue.dispatch(true);
}
