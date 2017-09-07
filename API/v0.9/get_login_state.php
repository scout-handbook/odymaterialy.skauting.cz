<?php
const _API_EXEC = 1;

header("content-type:application/json");
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
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
	echo(json_encode($response, JSON_UNESCAPED_UNICODE));
}

function showGuest()
{
	echo(json_encode(array('login_state' => false)));
}

try
{
	OdyMaterialyAPI\skautisTry('showUserAccount', false);
}
catch(OdyMaterialyAPI\AuthenticationException $e)
{
	showGuest();
}
