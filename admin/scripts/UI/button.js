function getAttribute(event, attribute)
{
	el = event.target;
	while(!el.dataset.hasOwnProperty(attribute))
	{
		el = el.parentElement;
	}
	return el.dataset[attribute];
}
