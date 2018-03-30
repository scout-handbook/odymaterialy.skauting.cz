<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Endpoint.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

$eventParticipantEndpoint = new HandbookAPI\Endpoint();

$listEventParticipants = function(Skautis\Skautis $skautis, array $data) : array
{
	$id = ctype_digit($data['parent-id']) ? intval($data['parent-id']) : null;
	if($id === null)
	{
		throw new HandbookAPI\InvalidArgumentTypeException('id', ['Integer']);
	}

	// Set the right role
	$eventName = $skautis->Events->EventEducationDetail([
		'ID' => $id
	])->DisplayName;
	$userID = $skautis->UserManagement->LoginDetail()->ID_User;
	$ISroles = $skautis->UserManagement->UserRoleAll([
		'ID_User' => $userID]);
	foreach($ISroles as $ISrole)
	{
		if(mb_strpos($ISrole->DisplayName, '"' . $eventName . '"') !== false)
		{
			$response = $skautis->UserManagement->LoginUpdate(["ID_UserRole" => $ISrole->ID, "ID" => $skautis->getUser()->getLoginId()]);
			$skautis->getUser()->updateLoginData(null, $ISrole->ID, $response->ID_Unit);
			break;
		}
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
$eventParticipantEndpoint->setListMethod(new HandbookAPI\Role('editor'), $listEventParticipants);
