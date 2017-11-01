var sidePanelState = false;

function sidePanelOpen()
{
	var sidePanel = document.getElementById("sidePanel");
	var overlay = document.getElementById("sidePanelOverlay");
	sidePanel.style.right = "0";
	overlay.style.display = "inline";
	sidePanelState = true;
}

function sidePanelClose()
{
	var sidePanel = document.getElementById("sidePanel");
	var overlay = document.getElementById("sidePanelOverlay");
	sidePanel.style.right = "-600px";
	overlay.style.display = "none";
	sidePanelState = false;
}
