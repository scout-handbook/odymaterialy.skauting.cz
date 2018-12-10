"use strict";
/* exported renderPagination */

function renderPagination(total, current)
{
	if(total < 2)
	{
		return "";
	}
	var ret = "<div id=\"pagination\">";
	if(current > 3)
	{
		ret += "<div class=\"paginationButton\" data-page=\"1\">1</div> ... ";
	}
	if(current > 2)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current - 2) + "\">" + (current - 2) + "</div>";
	}
	if(current > 1)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current - 1) + "\">" + (current - 1) + "</div>";
	}
	ret += "<div class=\"paginationButton activePaginationButton\">" + current + "</div>";
	if(current < total)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current + 1) + "\">" + (current + 1) + "</div>";
	}
	if(current < total - 1)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current + 2) + "\">" + (current + 2) + "</div>";
	}
	if(current < total - 2)
	{
		ret += " ... <div class=\"paginationButton\" data-page=\"" + total + "\">" + total + "</div>";
	}
	ret += "</div>";
	return ret;
}
