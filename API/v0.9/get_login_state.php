<?php
const _API_EXEC = 1;

header("content-type:application/json");
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

function showUserAccount($skautis)
{
	$response = array();
	$response['login_state'] = true;
	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
	$response['role'] = OdyMaterialyAPI\getRole($idPerson);
	$response['user_avatar'] = base64_encode($skautis->OrganizationUnit->PersonPhoto(array(
		'ID' => $idPerson,
		'Size' => 'small'))->PhotoSmallContent);
	return $response;
}

function showGuest()
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(OdyMaterialyAPI\skautisTry('showUserAccount', 'showGuest')));
