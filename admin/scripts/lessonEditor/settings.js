function lessonSettings()
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-right-open\"></i>Zavřít</div>";
	document.getElementById("sidePanel").innerHTML = html;
	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
