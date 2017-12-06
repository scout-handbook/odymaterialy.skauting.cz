function Action(url, method, payload, callback)
{
	this.url = url;
	this.method = method;
	this.payload = typeof payload !== 'undefined' ? payload : {};
	this.callback = typeof callback !== 'undefinded' ? callback : function(){};

	this.fillID = function(id)
		{
			this.url = this.url.replace("{id}", id);
		};
}

function ActionQueueSetup()
{
	if(window.sessionStorage && sessionStorage.getItem("retryActionUrl"))
	{
		aq = new ActionQueue(JSON.parse(sessionStorage.getItem("ActionQueue")), true);
		sessionStorage.clear();
		aq.dispatch();
	}
}

function ActionQueue(actions, retry)
{
	this.actions = typeof actions !== 'undefined' ? actions : [];
	this.retry = typeof retry !== 'undefined' ? retry : false;
	
	this.fillID = function(id)
		{
			for(var i = 0; i < this.actions.length; i++)
			{
				this.actions[i].fillID(id);
			}
		};

	this.addDefaultCallback = function()
		{
			this.actions[this.actions.length - 1].callback = function(response)
				{
					dialog("Akce byla úspěšná.", "OK");
					refreshMetadata();
					if(this.retry)
					{
						showMainView();
					}
					else
					{
						history.back();
					}
				};
		};

	this.pop = function()
		{
			request(this.actions[0].url, this.actions[0].method, this.actions[0].payload, function(response)
				{
					this.after(response, this.actions[0]);
				});
		};

	this.dispatch = function()
		{
			for(var i = 0; i < this.actions.length - 1; i++)
			{
				var callback = this.actions[i].callback;
				this.actions[i].callback = function(response)
					{
						callback(response);
						this.pop();
					};
			}
			this.pop();
		};

	this.after = function(response, action)
		{
			if(Math.floor(response.status / 100) === 2)
			{
				this.actions.shift();
				action.callback(response.response);
			}
			else if(response.type === "AuthenticationException")
			{
				if(!this.retry && window.sessionStorage)
				{
					sessionStorage.setItem("ActionQueue", JSON.stringify(this.actions));
					window.location.replace("https://odymaterialy.skauting.cz/API/v0.9/login?return-uri=/admin/" + mainPageTab);
				}
				else
				{
					dialog("Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.", "OK");
				}
			}
			else if(response.type === "RoleException")
			{
				dialog("Nemáte dostatečné oprávnění k této akci.", "OK");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		};
}
