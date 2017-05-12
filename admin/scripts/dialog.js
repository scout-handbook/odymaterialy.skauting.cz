function dialog(mainText, confirmText, confirmCallback, dismissText, dismissCallback)
{
	document.getElementById("overlay").style.display = "inline";
	document.getElementById("dialogText").innerHTML = mainText;
	document.getElementById("confirmText").innerHTML = confirmText;
	var confirmCallbackWrapped;
	if(confirmCallback)
	{
		confirmCallbackWrapped = function()
			{
				confirmCallback();
				dismissDialog();
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
		document.getElementById("dismissText").innerHTML = dismissText;
		var dismissCallbackWrapped;
		if(dismissCallback)
		{
			dismissCallbackWrapped = function()
				{
					dismissCallback();
					dismissDialog();
				}
		}
		else
		{
			dismissCallbackWrapped = dismissDialog;
		}
		document.getElementById("dismissText").onclick = dismissCallbackWrapped;
	}
}

function dismissDialog()
{
	document.getElementById("overlay").style.display = "none";
	document.getElementById("dismissText").style.display = "none";
}
