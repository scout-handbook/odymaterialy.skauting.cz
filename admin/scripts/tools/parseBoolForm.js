function parseBoolForm()
{
	var ret = [];
	nodes = document.getElementById("sidePanelForm").getElementsByTagName("input");
	for(var i = 0; i < nodes.length; i++)
	{
		if(nodes[i].checked)
		{
			ret.push(nodes[i].dataset.id);
		}
	}
	return ret;
}
