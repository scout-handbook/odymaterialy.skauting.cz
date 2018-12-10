"use strict";
/* exported parseVersion */

function parseVersion(version)
{
	var d = new Date(version);
	return d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}
