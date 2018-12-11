"use strict";
/* exported getAttribute */

function getAttribute(event, attribute)
{
	var el = event.target;
	while(!el.dataset.hasOwnProperty(attribute))
	{
		el = el.parentElement;
	}
	return el.dataset[attribute];
}
