<?php
const _EXEC = 1;

header("content-type:application/json");
require_once('skautisTry.php');

session_start();

function showUserAccount($skautis)
{
	$response = array();
	$response['login_state'] = true;
	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
	//$response['user_avatar'] = base64_encode($skautis->OrganizationUnit->PersonPhoto(array('ID' => $idPerson, 'Size' => 'big'))->PhotoBigContent);
	return $response;
}

function showLoginForm($skautis)
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(skautisTry('showUserAccount', 'showLoginForm')));
