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

function parseForm()
{
	var ret = [];
	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var i = 0; i < nodes.length; i++)
	{
		if(nodes[i].checked)
		{
			ret.push(nodes[i].dataset.id);
		}
	}
	return ret;
}
