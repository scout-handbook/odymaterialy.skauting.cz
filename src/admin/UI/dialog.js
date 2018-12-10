"use strict";
/* exported dialog */

var confirmCallbackWrapped;

function dialog(mainText, confirmText, confirmCallback, dismissText, dismissCallback)
{
	dismissSpinner();
	document.getElementById("overlay").style.display = "inline";
	document.getElementById("dialog").style.display = "block";
	document.getElementById("dialogText").innerHTML = mainText;
	document.getElementById("confirmText").innerHTML = "<i class=\"icon-ok\"></i>" + confirmText;
	if(confirmCallback)
	{
		confirmCallbackWrapped = function()
			{
				dismissDialog();
				confirmCallback();
			}
	}
	else
	{
		confirmCallbackWrapped = dismissDialog;
	}
	document.getElementById("confirmText").onclick = confirmCallbackWrapped;
	if(dismissText)
	{
		document.getElementById("dismissText").style.display = "inline";
		document.getElementById("dismissText").innerHTML = "<i class=\"icon-cancel\"></i>" + dismissText;
		var dismissCallbackWrapped;
		if(dismissCallback)
		{
			dismissCallbackWrapped = function()
				{
					dismissDialog();
					dismissCallback();
				}
		}
		else
		{
			dismissCallbackWrapped = dismissDialog;
		}
		document.getElementById("dismissText").onclick = dismissCallbackWrapped;
	}
	else
	{
		document.addEventListener('keypress', keyPressDialog);
	}
}

function keyPressDialog(event)
{
	if(event.keyCode === 13)
	{
		confirmCallbackWrapped();
	}
}

function dismissDialog()
{
	document.getElementById("overlay").style.display = "none";
	document.getElementById("dialog").style.display = "none";
	document.getElementById("dismissText").style.display = "none";
	document.removeEventListener('keypress', keyPressDialog);
}
