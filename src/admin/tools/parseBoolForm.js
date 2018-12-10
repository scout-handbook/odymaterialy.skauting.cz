"use strict";
/* exported parseBoolForm */

function parseBoolForm()
{
	var ret = [];
	var nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var i = 0; i < nodes.length; i++)
	{
		if(nodes[i].checked)
		{
			ret.push(nodes[i].dataset.id);
		}
	}
	return ret;
}
