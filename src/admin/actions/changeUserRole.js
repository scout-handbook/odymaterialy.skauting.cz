"use strict";
/* exported changeUserRoleOnClick */

var roleChanged = false;

function changeUserRoleOnClick(event)
{
	roleChanged = false;
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeUserRoleSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit roli: " + getAttribute(event, "name") + "</h3><form id=\"sidePanelForm\">";
	html += "<span class=\"roleText\">Role: </span><select class=\"formSelect\" id=\"roleSelect\">";
	html += "<option id=\"user\" value=\"user\">Uživatel</option>";
	html += "<option id=\"editor\" value=\"editor\">Editor</option>";
	if(LOGINSTATE.role === "superuser")
	{
		html += "<option id=\"administrator\" value=\"administrator\">Administrátor</option>";
		html += "<option id=\"superuser\" value=\"superuser\">Superuser</option>";
	}
	html += "</select>";
	html += "</form>";
	html += "<div class=\"roleHelp\"><i class=\"icon-info-circled\"></i><span class=\"roleHelpName\">Uživatel</span> - Kdokoliv, kdo se někdy přihlásil do OdyMateriálů pomocí skautISu. Nemá žádná oprávnění navíc oproti nepřihlášeným návštěvníkům.</div>";
	html += "<div class=\"roleHelp\"><i class=\"icon-info-circled\"></i><span class=\"roleHelpName\">Editor</span> - Instruktor, který má základní přístup k správě OdyMateriálů. Může přidávat lekce, měnit jejich obsah, kompetence a přesouvat je mezi oblastmi. Editor má přístup ke správě uživatelů, avšak může prohlížet a měnit pouze hosty a uživatele.</div>";
	if(LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"roleHelp\"><i class=\"icon-info-circled\"></i><span class=\"roleHelpName\">Administrátor</span> - Instruktor, mající všechna práva editora. Navíc může i mazat lekce a přidávat, upravovat a mazat oblasti a kompetence. Administrátor může navíc přidělovat a odebírat práva editorů.</div>";
		html += "<div class=\"roleHelp\"><i class=\"icon-info-circled\"></i><span class=\"roleHelpName\">Superuser</span> - Uživatel-polobůh.</div>";
	}
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("roleSelect").options.namedItem(getAttribute(event, "role")).selected = 'selected';

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/user/" + encodeURIComponent(getAttribute(event, "id")) + "/role", "PUT", changeUserRolePayloadBuilder)]);
	document.getElementById("changeUserRoleSave").onclick = aq.closeDispatch;

	document.getElementById("roleSelect").onchange = function()
		{
			roleChanged = true;
		};

	history.pushState({"sidePanel": "open"}, "title", "/admin/users");
	refreshLogin();
}

function changeUserRolePayloadBuilder()
{
	var sel = document.getElementById("roleSelect");
	return {"role": encodeURIComponent(sel.options[sel.selectedIndex].value)};
}
