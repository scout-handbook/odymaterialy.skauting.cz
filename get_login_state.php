<?php
const _EXEC = 1;

require_once('skautisTry.php');

session_start();

function showUserAccount($skautis)
{
	$response = array();
	$response['login_state'] = true;
	$id_person = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $id_person))->DisplayName;
	//$response['user_avatar'] = base64_encode($skautis->OrganizationUnit->PersonPhoto(array('ID' => $id_person, 'Size' => 'big'))->PhotoBigContent);
	return $response;
}

function showLoginForm($skautis)
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(skautisTry('showUserAccount', 'showLoginForm')));

