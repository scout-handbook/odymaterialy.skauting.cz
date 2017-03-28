var lines = function()
{
	var lines1 = {
		type:  "lang",
		filter: function(text, converter, options)
		{
			var m = text.indexOf("!lines");
			if(text.charAt(m + 6) == "[")
			{
				var n = text.indexOf("]", m + 6);
			}
			else
			{
				var n = m + 5;
			}
			text = text.substring(0, m) + "<span class=\"lines\"></span>" + text.substring(n + 1, text.length)
			return text;
		}
	};
	return [lines1];
}

showdown.extension("lines", lines);

