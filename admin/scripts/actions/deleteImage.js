function deleteImageOnClick(event)
{
	dialog("Opravdu si přejete smazat tento obrázek?", "Ano", function()
		{
			spinner();
			retryAction("/API/v0.9/image/" + encodeURIComponent(event.target.dataset.id), "DELETE", {});
		}, "Ne", function(){history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/images");
	refreshLogin();
}
