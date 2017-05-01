var navOpen = true;

function navSetup()
{
	window.onresize = reflow;
	document.getElementById("navCloseButton").onclick = switchNav;
	document.getElementById("overlay").onclick = switchNav;
	reflow();
}

function switchNav()
{
	navOpen = !navOpen;
	reflow();
}

function reflow()
{
	if(navOpen)
	{
		document.getElementById("navBar").style.marginLeft = "0px"
		if(screen.width > 700)
		{
			document.getElementById("main").style.marginLeft = "300px"
			document.getElementById("overlay").style.display = "none";
		}
		else
		{
			document.getElementById("main").style.marginLeft = "0px"
			document.getElementById("overlay").style.display = "inline";
		}
	}
	else
	{
		document.getElementById("navBar").style.marginLeft = "-300px"
		document.getElementById("main").style.marginLeft = "0px"
		document.getElementById("overlay").style.display = "none";
	}
}

