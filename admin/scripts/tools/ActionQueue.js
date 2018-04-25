"use strict";

var ActionQueueRetry = false;

function Action(url, method, payloadBuilder, callback, exceptionHandler)
{
	this.url = url;
	this.method = method;
	this.payloadBuilder = typeof payloadBuilder !== 'undefined' ? payloadBuilder : function(){return {};};
	this.callback = typeof callback !== 'undefined' ? callback : function(){};
	this.exceptionHandler = typeof exceptionHandler !== 'undefined' ? exceptionHandler : {};

	this.fillID = function(id)
		{
			this.url = this.url.replace("{id}", encodeURIComponent(id));
		};
}

function serializeAction(action)
{
	return {"url": action.url, "method": action.method, "payload": action.payloadBuilder(), "callback": action.callback.toString()};
}

function deserializeAction(action)
{
	return new Action(action.url, action.method, function()
		{
			return action.payload;
		}, eval('(' + action.callback + ')'));
}

function ActionQueueSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("ActionQueue"))
	{
		var aq = new ActionQueue(JSON.parse(sessionStorage.getItem("ActionQueue")).map(deserializeAction));
		ActionQueueRetry = true;
		sessionStorage.clear();
		aq.dispatch();
	}
}

function ActionQueue(actions, retry)
{
	this.actions = typeof actions !== 'undefined' ? actions : [];
	ActionQueueRetry = typeof retry !== 'undefined' ? retry : false;
	var queue = this;
	
	this.fillID = function(id)
		{
			for(var i = 0; i < queue.actions.length; i++)
			{
				queue.actions[i].fillID(id);
			}
		};

	this.addDefaultCallback = function()
		{
			var origCallback = queue.actions[queue.actions.length - 1].callback;
			queue.actions[queue.actions.length - 1].callback = function(response)
				{
					dialog("Akce byla úspěšná.", "OK");
					refreshMetadata();
					if(origCallback)
					{
						origCallback(response);
					}
					if(ActionQueueRetry)
					{
						showMainView();
					}
					else
					{
						history.back();
					}
				};
		};

	this.pop = function(propagate, background)
		{
			if(queue.actions.length <= 1)
			{
				propagate = false;
			}
			if(!background)
			{
				spinner();
			}
			request(queue.actions[0].url, queue.actions[0].method, queue.actions[0].payloadBuilder(), function(response)
				{
					if(queue.after(response, queue.actions[0]) && propagate)
					{
						queue.pop(true, background);
					}
				});
		};

	this.dispatch = function(background)
		{
			queue.pop(true, background);
		};
	this.defaultDispatch = function(background)
		{
			queue.addDefaultCallback();
			queue.dispatch(background);
		};
	this.closeDispatch = function()
		{
			sidePanelClose();
			queue.defaultDispatch();
		};

	this.after = function(response, action)
		{
			if(Math.floor(response.status / 100) === 2)
			{
				queue.actions.shift();
				action.callback(response.response);
			}
			else if(response.type === "AuthenticationException")
			{
				if(!ActionQueueRetry && window.sessionStorage)
				{
					sessionStorage.setItem("ActionQueue", JSON.stringify(queue.actions.map(serializeAction)));
					window.location.replace(CONFIG.apiuri + "/login?return-uri=/admin/" + mainPageTab);
					return false;
				}
				else
				{
					dialog("Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.", "OK");
				}
			}
			else if(action.exceptionHandler.hasOwnProperty(response.type))
			{
				action.exceptionHandler[response.type]();
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
			return true;
		};
}
