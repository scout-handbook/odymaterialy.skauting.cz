// Showdown extensions definitions
var OdyMarkdown = function()
{
	var responsiveTablesBegin = {
		type: "output",
		regex: "<table>",
		replace: "<div class=\"tableContainer\"><table>"
	};
	var responsiveTablesEnd = {
		type: "output",
		regex: "</table>",
		replace: "</table></div>"
	};
	var blankLinks = {
		type: "output",
		regex: "<a href",
		replace: "<a target=\"_blank\" href"
	};
	var notes = {
		type: "lang",
		filter: function(text, c, o) {return filterCommand(text, "notes", notes_command);}
	};
	return [responsiveTablesBegin, responsiveTablesEnd, blankLinks, notes];
}

//Register extensions
showdown.extension("OdyMarkdown", OdyMarkdown);

// Generic command processing functions
function filterCommand(text, commandName, command)
{
	var start = text.indexOf("!" + commandName);
	while(start >= 0)
	{
		var argumentObject = {};
		var stop = 0;
		if(text.charAt(start + commandName.length + 1) === "[")
		{
			stop = text.indexOf("]", start + commandName.length + 2);
			var argumentString = text.substring(start + commandName.length + 2, stop);
			argumentObject = parseArguments(argumentString);
		}
		else
		{
			stop = start + commandName.length;
		}
		text = text.substring(0, start) + command(argumentObject) + text.substring(stop + 1, text.length)
		start = text.indexOf("!" + commandName);
	}
	return text;
}

function parseArguments(argumentString)
{
	var output = {};
	var list = argumentString.replace(/ /g,"").split(",");
	for(i = 0; i < list.length; ++i)
	{
		var tuple = list[i].split("=");
		if (tuple.length !== 2)
		{
			return {};
		}
		output[tuple[0]] = tuple[1];
	}
	return output;
}

// Specific commands
function notes_command(argumentObject)
{
	return "<textarea class=\"notes\" placeholder=\"Tvoje poznámky\"></textarea>";
}

