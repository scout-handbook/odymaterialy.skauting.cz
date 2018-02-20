function lessonHistoryOpen(id, actionQueue)
{
	sidePanelDoubleOpen();
	var html = "<div id=\"lessonHistoryList\"><div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div><div id=\"lessonHistoryForm\"><div id=\"embeddedSpinner\"></div></div></div><div id=\"lessonHistoryPreview\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("cancelEditorAction").onclick = function()
		{
			lessonSettings(id, actionQueue, true);
		};

	refreshLogin();
}
