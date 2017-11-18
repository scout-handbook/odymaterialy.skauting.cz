<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

$eventEndpoint = new OdyMaterialyAPI\Endpoint('user');

$listUsers = function($skautis, $data, $endpoint)
{
	$ISevents = $skautis->Events->EventEducationAllMyActions();
	$events = [];
	foreach($ISevents as $event)
	{
		$events[] = ['id' => $event->ID, 'name' => $event->DisplayName];
	}
	return ['status' => 200, 'response' => $events];
};
$eventEndpoint->setListMethod(new OdymaterialyAPI\Role('editor'), $listUsers);
