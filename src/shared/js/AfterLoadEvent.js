"use strict";
/* exported AfterLoadEvent */

function AfterLoadEvent(threshold)
{
	this.triggered = false;
	this.threshold = threshold;
	this.count = 0;
	this.callbacks = [];

	var ALE = this;
	this.addCallback = function(callback)
		{
			ALE.callbacks.push(callback);
			if(ALE.triggered)
			{
				callback();
			}
		};
	this.trigger = function()
		{
			ALE.count++;
			ALE.retrigger.apply(ALE, arguments);
		};
	this.retrigger = function()
		{
			if(ALE.count >= ALE.threshold)
			{
				ALE.triggered = true;
				for(var i = 0; i < ALE.callbacks.length; i++)
				{
					ALE.callbacks[i].apply(null, arguments);
				}
			}
		};
}
