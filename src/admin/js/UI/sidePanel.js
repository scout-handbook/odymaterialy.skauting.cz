"use strict";
/* exported sidePanelState, sidePanelOpen, sidePanelDoubleOpen, sidePanelClose */

var sidePanelState = false;

function sidePanelOpen()
{
	var sidePanel = document.getElementById("sidePanel");
	var overlay = document.getElementById("sidePanelOverlay");
	sidePanel.style.right = "0";
	sidePanel.style.width = "";
	overlay.style.display = "inline";
	sidePanelState = true;
}

function sidePanelDoubleOpen()
{
	var sidePanel = document.getElementById("sidePanel");
	sidePanel.style.width = "939px";
}

function sidePanelClose()
{
	var sidePanel = document.getElementById("sidePanel");
	var overlay = document.getElementById("sidePanelOverlay");
	sidePanel.style.right = "";
	overlay.style.display = "";
	sidePanelState = false;
}
