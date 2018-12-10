"use strict";
/* exported spinner, dismissSpinner */

function spinner()
{
	document.getElementById("overlay").style.display = "inline";
	document.getElementById("spinner").style.display = "block";
}

function dismissSpinner()
{
	document.getElementById("overlay").style.display = "none";
	document.getElementById("spinner").style.display = "none";
}
