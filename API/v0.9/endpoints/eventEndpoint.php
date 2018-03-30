<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Endpoint.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/endpoints/eventParticipantEndpoint.php');

$eventEndpoint = new HandbookAPI\Endpoint();
$eventEndpoint->addSubEndpoint('participant', $eventParticipantEndpoint);

$listUsers = function(Skautis\Skautis $skautis) : array
{
	$ISevents = $skautis->Events->EventEducationAllMyActions();
	$events = [];
	foreach($ISevents as $event)
	{
		$events[] = ['id' => $event->ID, 'name' => $event->DisplayName];
	}
	return ['status' => 200, 'response' => $events];
};
$eventEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listUsers);
