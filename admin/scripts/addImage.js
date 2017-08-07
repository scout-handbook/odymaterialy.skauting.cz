function addImage()
{
	sidePanelOpen();
	var html = "<h3 class=\"sidePanelTitle\">Nahrát obrázek</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"addImageSave\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	html += "<input type=\"file\" class=\"formFile\" id=\"addImageFile\">";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addImageSave").onclick = addImageSave;

	history.pushState({"sidePanel": "open"}, "title", "/admin/");
}

function addImageSave()
{
	if(document.getElementById("addImageFile").value != "")
	{
		var formData = new FormData()
		formData.append("image", document.getElementById("addImageFile").files[0])
		sidePanelClose();
		retryAction("/API/v0.9/add_image", formData);
	}
}
