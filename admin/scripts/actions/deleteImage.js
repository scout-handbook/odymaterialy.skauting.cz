function deleteImageOnClick(event)
{
	dialog("Opravdu si přejete smazat tento obrázek?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/image/" + encodeURIComponent(getAttribute(event, "id")), "DELETE", {});
		}, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/images");
	refreshLogin();
}
