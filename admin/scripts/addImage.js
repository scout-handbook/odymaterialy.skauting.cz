function addImage()
{
	sidePanelOpen();
	var html = "<h3 class=\"sidePanelTitle\">Nahrát obrázek</h3><div class=\"button\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"button\" id=\"addImageSave\"><i class=\"icon-floppy\"></i>Uložit</div><form id=\"sidePanelForm\">";
	html += "<div class=\"formRow\"><label class=\"formFile\">";
	html += "<input type=\"file\" class=\"formFile\" id=\"addImageFile\">";
	html += "<div class=\"button\"><i class=\"icon-upload\"></i>Vybrat soubor...</div></label>"
	html += "</div></form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addImageSave").onclick = addImageSave;

	document.getElementById("addImageFile").onchange = changeLabel;

	history.pushState({"sidePanel": "open"}, "title", "/admin/");
}

function changeLabel(event)
{
	if(event.target.files)
	{
		event.target.parentElement.children[1].innerHTML = "<i class=\"icon-upload\"></i>" + event.target.files[0].name;
	}
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
