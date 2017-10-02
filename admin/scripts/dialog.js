function dialog(mainText, confirmText, confirmCallback, dismissText, dismissCallback)
{
	dismissSpinner();
	document.getElementById("overlay").style.display = "inline";
	document.getElementById("dialog").style.display = "block";
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
	document.getElementById("dialog").style.display = "none";
	document.getElementById("dismissText").style.display = "none";
}

function spinner()
{
	document.getElementById("overlay").style.display = "inline";
	document.getElementById("spinner").style.display = "block";
}

function dismissSpinner()
{
	document.getElementById("overlay").style.display = "none";
	document.getElementById("spinner").style.display = "none";
}
