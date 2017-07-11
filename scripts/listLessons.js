var lessonListEvent = new AfterLoadEvent(2);

function listLessonsSetup()
{
	cacheThenNetworkRequest("/API/v0.9/list_lessons", "", function(response, second)
		{
			FIELDS = JSON.parse(response);
			if(!second)
			{
				lessonListEvent.trigger();
			}
		});
	cacheThenNetworkRequest("/API/v0.9/list_competences", "", function(response, second)
		{
			COMPETENCES = JSON.parse(response);
			if(!second)
			{
				lessonListEvent.trigger();
			}
		});
	lessonListEvent.addCallback(showLessonList);
}

function showLessonList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		html += "<h1>" + FIELDS[i].name + "</h1>";
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			var name = FIELDS[i].lessons[j].name;
			html += "<a title=\"" + name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + name + "</a><br>";
		}
	}
	document.getElementById("navigation").innerHTML = html;
	nodes = document.getElementById("navigation").getElementsByTagName("a");
	for(var k = 0; k < nodes.length; k++)
	{
		nodes[k].onclick = itemOnClick;
	}
	document.getElementsByTagName("nav")[0].style.transition = "margin-left 0.3s ease";
}

function itemOnClick(event)
{
	getLesson(event.target.dataset.id);
	return false;
}

function AfterLoadEvent(threshold)
{
	this.triggered = false;
	this.threshold = threshold;
	this.count = 0;
	this.callbacks = [];
	this.addCallback = function(callback)
		{
			if(this.triggered)
			{
				callback();
			}
			else
			{
				this.callbacks.push(callback);
			}
		};
	this.trigger = function()
		{
			this.count++;
			if(this.count >= this.threshold)
			{
				this.triggered = true;
				for(var i = 0; i < this.callbacks.length; i++)
				{
					this.callbacks[i]();
				}
			}
		};
}
