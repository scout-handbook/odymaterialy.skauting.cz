var CACHE = "odymaterialy-v1";
var FIELDS;
var COMPETENCES;

function main()
{
	navigationSetup();
	headerSetup();
	historySetup();
	authSetup();
	listLessonsSetup();
	lessonViewSetup();
	if("serviceWorker" in navigator)
	{
		navigator.serviceWorker.register("/serviceworker.js");
	}
	WebFont.load({
		google: {
			families: ["Open Sans:400,400i,700,700i"]
		}
	});
}

window.onload = main;
