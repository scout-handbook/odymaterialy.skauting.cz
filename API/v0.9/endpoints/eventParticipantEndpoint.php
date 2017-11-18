<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$eventParticipantEndpoint = new OdyMaterialyAPI\Endpoint('event');

$listEventParticipants = function($skautis, $data, $endpoint)
{
	$id = ctype_digit($data['parent-id']) ? intval($data['parent-id']) : null;
	if($id === null)
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('id', ['Integer']);
	}

	$ISparticipants = $skautis->Events->ParticipantEducationAll([
		'ID_EventEducation' => $id]);
	$participants = [];
	foreach($ISparticipants as $participant)
	{
		if($participant->IsAccepted == 'TRUE')
		{
			$participants[] = ['id' => $participant->ID_Person, 'name' => $participant->Person];
		}
	}
	return ['status' => 200, 'response' => $participants];
};
$eventParticipantEndpoint->setListMethod(new OdymaterialyAPI\Role('editor'), $listEventParticipants);
